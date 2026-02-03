import { Elysia, t } from "elysia";
import prisma from "../db";

// Helper function to create slug
function createSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export const articlesRoutes = new Elysia({ prefix: "/articles" })
    // Get all articles with pagination
    .get("/", async ({ query }) => {
        try {
            const page = parseInt(query.page || "1");
            const limit = parseInt(query.limit || "10");
            const skip = (page - 1) * limit;
            const published = query.published !== "false";

            const [articles, total] = await Promise.all([
                prisma.article.findMany({
                    where: published ? { published: true } : undefined,
                    skip,
                    take: limit,
                    orderBy: { createdAt: "desc" },
                }),
                prisma.article.count({
                    where: published ? { published: true } : undefined,
                }),
            ]);

            return {
                success: true,
                data: articles,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            console.error("Get articles error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    // Get latest articles
    .get("/latest", async ({ query }) => {
        try {
            const limit = parseInt(query.limit || "3");

            const articles = await prisma.article.findMany({
                where: { published: true },
                take: limit,
                orderBy: { createdAt: "desc" },
            });

            return { success: true, data: articles };
        } catch (error) {
            console.error("Get latest articles error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    // Get article by slug
    .get("/slug/:slug", async ({ params, set }) => {
        try {
            const article = await prisma.article.findUnique({
                where: { slug: params.slug },
                include: {
                    feedback: {
                        include: {
                            user: {
                                select: { id: true, nama: true, fotoProfil: true },
                            },
                        },
                        orderBy: { createdAt: "desc" },
                    },
                },
            });

            if (!article) {
                set.status = 404;
                return { success: false, message: "Artikel tidak ditemukan" };
            }

            return { success: true, data: article };
        } catch (error) {
            console.error("Get article by slug error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    // Get article by ID
    .get("/:id", async ({ params, set }) => {
        try {
            const article = await prisma.article.findUnique({
                where: { id: parseInt(params.id) },
                include: {
                    feedback: {
                        include: {
                            user: {
                                select: { id: true, nama: true, fotoProfil: true },
                            },
                        },
                        orderBy: { createdAt: "desc" },
                    },
                },
            });

            if (!article) {
                set.status = 404;
                return { success: false, message: "Artikel tidak ditemukan" };
            }

            return { success: true, data: article };
        } catch (error) {
            console.error("Get article error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    // Create article
    .post(
        "/",
        async ({ body, set }) => {
            try {
                let gambarPath = body.gambar;

                if (body.gambar && body.gambar instanceof Blob) {
                    const { saveFile } = await import("../utils/file");
                    gambarPath = await saveFile(body.gambar as File, "artikel");
                }

                // Create unique slug
                let slug = createSlug(body.judul);
                const existingSlug = await prisma.article.findUnique({ where: { slug } });
                if (existingSlug) {
                    slug = `${slug}-${Date.now()}`;
                }

                const article = await prisma.article.create({
                    data: {
                        judul: body.judul,
                        slug,
                        isi: body.isi,
                        ringkasan: body.ringkasan,
                        penulis: body.penulis,
                        published: body.published ?? false,
                        gambar: typeof gambarPath === 'string' ? gambarPath : null,
                    },
                });

                set.status = 201;
                return {
                    success: true,
                    message: "Artikel berhasil dibuat",
                    data: article,
                };
            } catch (error) {
                console.error("Create article error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                judul: t.String({ minLength: 1 }),
                isi: t.String({ minLength: 1 }),
                ringkasan: t.Optional(t.String()),
                penulis: t.Optional(t.String()),
                published: t.Optional(t.Boolean()),
                gambar: t.Optional(t.Union([t.File(), t.String()])),
            }),
        }
    )
    // Update article
    .put(
        "/:id",
        async ({ params, body, set }) => {
            try {
                const articleId = parseInt(params.id);
                let gambarPath = body.gambar;

                const existingArticle = await prisma.article.findUnique({
                    where: { id: articleId },
                });

                if (!existingArticle) {
                    set.status = 404;
                    return { success: false, message: "Artikel tidak ditemukan" };
                }

                if (body.gambar && body.gambar instanceof Blob) {
                    const { saveFile } = await import("../utils/file");
                    gambarPath = await saveFile(body.gambar as File, "artikel");
                }

                // Update slug if title changed
                let slug = existingArticle.slug;
                if (body.judul && body.judul !== existingArticle.judul) {
                    slug = createSlug(body.judul);
                    const existingSlugArticle = await prisma.article.findFirst({
                        where: { slug, id: { not: articleId } }
                    });
                    if (existingSlugArticle) {
                        slug = `${slug}-${Date.now()}`;
                    }
                }

                const article = await prisma.article.update({
                    where: { id: articleId },
                    data: {
                        judul: body.judul,
                        slug: body.judul ? slug : undefined,
                        isi: body.isi,
                        ringkasan: body.ringkasan,
                        penulis: body.penulis,
                        published: body.published,
                        gambar: typeof gambarPath === 'string' ? gambarPath : undefined,
                    },
                });

                return {
                    success: true,
                    message: "Artikel berhasil diupdate",
                    data: article,
                };
            } catch (error) {
                console.error("Update article error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                judul: t.Optional(t.String()),
                isi: t.Optional(t.String()),
                ringkasan: t.Optional(t.String()),
                penulis: t.Optional(t.String()),
                published: t.Optional(t.Boolean()),
                gambar: t.Optional(t.Union([t.File(), t.String()])),
            }),
        }
    )
    // Delete article
    .delete("/:id", async ({ params, set }) => {
        try {
            const articleId = parseInt(params.id);

            const existingArticle = await prisma.article.findUnique({
                where: { id: articleId },
            });

            if (!existingArticle) {
                set.status = 404;
                return { success: false, message: "Artikel tidak ditemukan" };
            }

            await prisma.article.delete({
                where: { id: articleId },
            });

            return { success: true, message: "Artikel berhasil dihapus" };
        } catch (error) {
            console.error("Delete article error:", error);
            set.status = 500;
            return { success: false, message: "Terjadi kesalahan server" };
        }
    });
