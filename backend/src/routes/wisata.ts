import { Elysia, t } from "elysia";
import prisma from "../db";

export const wisataRoutes = new Elysia({ prefix: "/wisata" })
    // Get all wisata with pagination
    .get("/", async ({ query }) => {
        try {
            const page = parseInt(query.page || "1");
            const limit = parseInt(query.limit || "10");
            const skip = (page - 1) * limit;

            const [wisata, total] = await Promise.all([
                prisma.wisata.findMany({
                    skip,
                    take: limit,
                    orderBy: { createdAt: "desc" },
                }),
                prisma.wisata.count(),
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
                take: limit,
                orderBy: { createdAt: "desc" },
            });

            return { success: true, data: wisata };
        } catch (error) {
            console.error("Get popular wisata error:", error);
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
                // If it's a string, it might be a URL or path, keep as is

                const wisata = await prisma.wisata.create({
                    data: {
                        nama: body.nama,
                        deskripsi: body.deskripsi,
                        gambar: typeof gambarPath === 'string' ? gambarPath : null,
                        lokasi: body.lokasi,
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

                const wisata = await prisma.wisata.update({
                    where: { id: wisataId },
                    data: {
                        nama: body.nama,
                        deskripsi: body.deskripsi,
                        gambar: typeof gambarPath === 'string' ? gambarPath : undefined,
                        lokasi: body.lokasi,
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
