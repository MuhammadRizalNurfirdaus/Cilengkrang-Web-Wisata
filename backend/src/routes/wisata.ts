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

export const wisataRoutes = new Elysia({ prefix: "/wisata" })
    // Get all wisata with pagination
    .get("/", async ({ query }) => {
        try {
            const page = parseInt(query.page || "1");
            const limit = parseInt(query.limit || "10");
            const skip = (page - 1) * limit;
            const aktif = query.aktif !== "false";

            const [wisata, total] = await Promise.all([
                prisma.wisata.findMany({
                    where: aktif ? { aktif: true } : undefined,
                    skip,
                    take: limit,
                    orderBy: { createdAt: "desc" },
                    include: {
                        jenisTiket: {
                            where: { aktif: true },
                            take: 3,
                        },
                    },
                }),
                prisma.wisata.count({
                    where: aktif ? { aktif: true } : undefined,
                }),
            ]);

            return {
                success: true,
                data: wisata,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            console.error("Get wisata error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    // Get popular wisata (latest 3)
    .get("/popular", async ({ query }) => {
        try {
            const limit = parseInt(query.limit || "3");

            const wisata = await prisma.wisata.findMany({
                where: { aktif: true },
                take: limit,
                orderBy: { createdAt: "desc" },
            });

            return { success: true, data: wisata };
        } catch (error) {
            console.error("Get popular wisata error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    // Get wisata by slug
    .get("/slug/:slug", async ({ params, set }) => {
        try {
            const wisata = await prisma.wisata.findUnique({
                where: { slug: params.slug },
                include: {
                    jenisTiket: {
                        where: { aktif: true },
                    },
                    galeri: {
                        take: 10,
                        orderBy: { uploadedAt: "desc" },
                    },
                    feedback: {
                        include: {
                            user: {
                                select: { id: true, nama: true, fotoProfil: true },
                            },
                        },
                        take: 5,
                        orderBy: { createdAt: "desc" },
                    },
                },
            });

            if (!wisata) {
                set.status = 404;
                return { success: false, message: "Wisata tidak ditemukan" };
            }

            return { success: true, data: wisata };
        } catch (error) {
            console.error("Get wisata by slug error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    // Get wisata by ID
    .get("/:id", async ({ params, set }) => {
        try {
            const wisata = await prisma.wisata.findUnique({
                where: { id: parseInt(params.id) },
                include: {
                    jenisTiket: {
                        where: { aktif: true },
                    },
                    galeri: {
                        take: 10,
                        orderBy: { uploadedAt: "desc" },
                    },
                },
            });

            if (!wisata) {
                set.status = 404;
                return { success: false, message: "Wisata tidak ditemukan" };
            }

            return { success: true, data: wisata };
        } catch (error) {
            console.error("Get wisata error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    // Create wisata
    .post(
        "/",
        async ({ body, set }) => {
            try {
                let gambarPath = body.gambar;

                // Handle file upload if it's a File object (Bun's Blob)
                if (body.gambar && body.gambar instanceof Blob) {
                    const { saveFile } = await import("../utils/file");
                    gambarPath = await saveFile(body.gambar as File, "wisata");
                }

                // Create unique slug
                let slug = createSlug(body.nama);
                const existingSlug = await prisma.wisata.findUnique({ where: { slug } });
                if (existingSlug) {
                    slug = `${slug}-${Date.now()}`;
                }

                const wisata = await prisma.wisata.create({
                    data: {
                        nama: body.nama,
                        slug,
                        deskripsi: body.deskripsi,
                        gambar: typeof gambarPath === 'string' ? gambarPath : null,
                        lokasi: body.lokasi,
                        fasilitas: body.fasilitas,
                        jamOperasi: body.jamOperasi,
                        latitude: body.latitude ? parseFloat(body.latitude) : null,
                        longitude: body.longitude ? parseFloat(body.longitude) : null,
                        aktif: body.aktif !== false,
                    },
                });

                set.status = 201;
                return {
                    success: true,
                    message: "Wisata berhasil dibuat",
                    data: wisata,
                };
            } catch (error) {
                console.error("Create wisata error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                nama: t.String({ minLength: 1 }),
                deskripsi: t.Optional(t.String()),
                gambar: t.Optional(t.Union([t.File(), t.String()])),
                lokasi: t.Optional(t.String()),
                fasilitas: t.Optional(t.String()),
                jamOperasi: t.Optional(t.String()),
                latitude: t.Optional(t.String()),
                longitude: t.Optional(t.String()),
                aktif: t.Optional(t.Boolean()),
            }),
        }
    )
    // Update wisata
    .put(
        "/:id",
        async ({ params, body, set }) => {
            try {
                const wisataId = parseInt(params.id);
                let gambarPath = body.gambar;

                const existingWisata = await prisma.wisata.findUnique({
                    where: { id: wisataId },
                });

                if (!existingWisata) {
                    set.status = 404;
                    return { success: false, message: "Wisata tidak ditemukan" };
                }

                if (body.gambar && body.gambar instanceof Blob) {
                    const { saveFile } = await import("../utils/file");
                    gambarPath = await saveFile(body.gambar as File, "wisata");
                }

                // Update slug if name changed
                let slug = existingWisata.slug;
                if (body.nama && body.nama !== existingWisata.nama) {
                    slug = createSlug(body.nama);
                    const existingSlugWisata = await prisma.wisata.findFirst({
                        where: { slug, id: { not: wisataId } }
                    });
                    if (existingSlugWisata) {
                        slug = `${slug}-${Date.now()}`;
                    }
                }

                const wisata = await prisma.wisata.update({
                    where: { id: wisataId },
                    data: {
                        nama: body.nama,
                        slug: body.nama ? slug : undefined,
                        deskripsi: body.deskripsi,
                        gambar: typeof gambarPath === 'string' ? gambarPath : undefined,
                        lokasi: body.lokasi,
                        fasilitas: body.fasilitas,
                        jamOperasi: body.jamOperasi,
                        latitude: body.latitude ? parseFloat(body.latitude) : undefined,
                        longitude: body.longitude ? parseFloat(body.longitude) : undefined,
                        aktif: body.aktif,
                    },
                });

                return {
                    success: true,
                    message: "Wisata berhasil diupdate",
                    data: wisata,
                };
            } catch (error) {
                console.error("Update wisata error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                nama: t.Optional(t.String()),
                deskripsi: t.Optional(t.String()),
                gambar: t.Optional(t.Union([t.File(), t.String()])),
                lokasi: t.Optional(t.String()),
                fasilitas: t.Optional(t.String()),
                jamOperasi: t.Optional(t.String()),
                latitude: t.Optional(t.String()),
                longitude: t.Optional(t.String()),
                aktif: t.Optional(t.Boolean()),
            }),
        }
    )
    // Delete wisata
    .delete("/:id", async ({ params, set }) => {
        try {
            const wisataId = parseInt(params.id);

            const existingWisata = await prisma.wisata.findUnique({
                where: { id: wisataId },
            });

            if (!existingWisata) {
                set.status = 404;
                return { success: false, message: "Wisata tidak ditemukan" };
            }

            await prisma.wisata.delete({
                where: { id: wisataId },
            });

            return { success: true, message: "Wisata berhasil dihapus" };
        } catch (error) {
            console.error("Delete wisata error:", error);
            set.status = 500;
            return { success: false, message: "Terjadi kesalahan server" };
        }
    });
