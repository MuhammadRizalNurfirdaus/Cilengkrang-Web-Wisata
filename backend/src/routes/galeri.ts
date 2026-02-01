import { Elysia, t } from "elysia";
import prisma from "../db";

export const galeriRoutes = new Elysia({ prefix: "/galeri" })
    .get("/", async ({ query }) => {
        try {
            const page = parseInt(query.page || "1");
            const limit = parseInt(query.limit || "12");
            const skip = (page - 1) * limit;

            const [galeri, total] = await Promise.all([
                prisma.galeri.findMany({
                    skip,
                    take: limit,
                    orderBy: { uploadedAt: "desc" },
                }),
                prisma.galeri.count(),
            ]);

            return {
                success: true,
                data: galeri,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            console.error("Get galeri error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .get("/:id", async ({ params, set }) => {
        try {
            const galeri = await prisma.galeri.findUnique({
                where: { id: parseInt(params.id) },
            });

            if (!galeri) {
                set.status = 404;
                return { success: false, message: "Galeri tidak ditemukan" };
            }

            return { success: true, data: galeri };
        } catch (error) {
            console.error("Get galeri error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .post(
        "/",
        async ({ body, set }) => {
            try {
                let filePath = "";

                if (body.namaFile && body.namaFile instanceof Blob) {
                    const { saveFile } = await import("../utils/file");
                    filePath = await saveFile(body.namaFile as File, "galeri");
                } else {
                    set.status = 400;
                    return { success: false, message: "File gambar wajib diupload" };
                }

                const galeri = await prisma.galeri.create({
                    data: {
                        namaFile: filePath,
                        keterangan: body.keterangan,
                    },
                });

                set.status = 201;
                return { success: true, message: "Galeri berhasil dibuat", data: galeri };
            } catch (error) {
                console.error("Create galeri error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                namaFile: t.File(),
                keterangan: t.Optional(t.String()),
            }),
        }
    )
    .put(
        "/:id",
        async ({ params, body, set }) => {
            try {
                const galeriId = parseInt(params.id);
                let filePath = undefined;

                const existingGaleri = await prisma.galeri.findUnique({
                    where: { id: galeriId },
                });

                if (!existingGaleri) {
                    set.status = 404;
                    return { success: false, message: "Galeri tidak ditemukan" };
                }

                if (body.namaFile && body.namaFile instanceof Blob) {
                    const { saveFile } = await import("../utils/file");
                    filePath = await saveFile(body.namaFile as File, "galeri");
                }

                const galeri = await prisma.galeri.update({
                    where: { id: galeriId },
                    data: {
                        namaFile: filePath, // Update only if new file
                        keterangan: body.keterangan,
                    },
                });

                return { success: true, message: "Galeri berhasil diupdate", data: galeri };
            } catch (error) {
                console.error("Update galeri error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                namaFile: t.Optional(t.Union([t.File(), t.String()])),
                keterangan: t.Optional(t.String()),
            }),
        }
    )
    .delete("/:id", async ({ params, set }) => {
        try {
            const galeriId = parseInt(params.id);

            const existingGaleri = await prisma.galeri.findUnique({
                where: { id: galeriId },
            });

            if (!existingGaleri) {
                set.status = 404;
                return { success: false, message: "Galeri tidak ditemukan" };
            }

            await prisma.galeri.delete({
                where: { id: galeriId },
            });

            return { success: true, message: "Galeri berhasil dihapus" };
        } catch (error) {
            console.error("Delete galeri error:", error);
            set.status = 500;
            return { success: false, message: "Terjadi kesalahan server" };
        }
    });
