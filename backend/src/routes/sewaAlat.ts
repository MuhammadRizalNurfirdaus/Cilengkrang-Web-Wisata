import { Elysia, t } from "elysia";
import prisma from "../db";

export const sewaAlatRoutes = new Elysia({ prefix: "/sewa-alat" })
    .get("/", async ({ query }) => {
        try {
            const page = parseInt(query.page || "1");
            const limit = parseInt(query.limit || "10");
            const skip = (page - 1) * limit;
            const kategori = query.kategori;

            const where: any = {};
            if (kategori) where.kategoriAlat = kategori;

            const [sewaAlat, total] = await Promise.all([
                prisma.sewaAlat.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { createdAt: "desc" },
                }),
                prisma.sewaAlat.count({ where }),
            ]);

            return {
                success: true,
                data: sewaAlat,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            };
        } catch (error) {
            console.error("Get sewa alat error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .get("/available", async () => {
        try {
            const sewaAlat = await prisma.sewaAlat.findMany({
                where: {
                    stokTersedia: { gt: 0 },
                    kondisiAlat: "BAIK",
                },
                orderBy: { namaItem: "asc" },
            });

            return { success: true, data: sewaAlat };
        } catch (error) {
            console.error("Get available sewa alat error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .get("/:id", async ({ params, set }) => {
        try {
            const sewaAlat = await prisma.sewaAlat.findUnique({
                where: { id: parseInt(params.id) },
            });

            if (!sewaAlat) {
                set.status = 404;
                return { success: false, message: "Alat sewa tidak ditemukan" };
            }

            return { success: true, data: sewaAlat };
        } catch (error) {
            console.error("Get sewa alat error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .post(
        "/",
        async ({ body, set }) => {
            try {
                const sewaAlat = await prisma.sewaAlat.create({
                    data: {
                        namaItem: body.namaItem,
                        kategoriAlat: body.kategoriAlat,
                        deskripsi: body.deskripsi,
                        hargaSewa: body.hargaSewa,
                        durasiHargaSewa: body.durasiHargaSewa || 1,
                        satuanDurasiHarga: body.satuanDurasiHarga as any || "HARI",
                        stokTersedia: body.stokTersedia || 0,
                        gambarAlat: body.gambarAlat,
                        kondisiAlat: "BAIK",
                    },
                });

                set.status = 201;
                return { success: true, message: "Alat sewa berhasil dibuat", data: sewaAlat };
            } catch (error) {
                console.error("Create sewa alat error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                namaItem: t.String({ minLength: 1 }),
                kategoriAlat: t.Optional(t.String()),
                deskripsi: t.Optional(t.String()),
                hargaSewa: t.Number({ minimum: 0 }),
                durasiHargaSewa: t.Optional(t.Number()),
                satuanDurasiHarga: t.Optional(t.String()),
                stokTersedia: t.Optional(t.Number()),
                gambarAlat: t.Optional(t.String()),
            }),
        }
    )
    .put(
        "/:id",
        async ({ params, body, set }) => {
            try {
                const id = parseInt(params.id);

                const sewaAlat = await prisma.sewaAlat.update({
                    where: { id },
                    data: {
                        namaItem: body.namaItem,
                        kategoriAlat: body.kategoriAlat,
                        deskripsi: body.deskripsi,
                        hargaSewa: body.hargaSewa,
                        durasiHargaSewa: body.durasiHargaSewa,
                        satuanDurasiHarga: body.satuanDurasiHarga as any,
                        stokTersedia: body.stokTersedia,
                        gambarAlat: body.gambarAlat,
                        kondisiAlat: body.kondisiAlat as any,
                    },
                });

                return { success: true, message: "Alat sewa berhasil diupdate", data: sewaAlat };
            } catch (error) {
                console.error("Update sewa alat error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                namaItem: t.Optional(t.String()),
                kategoriAlat: t.Optional(t.String()),
                deskripsi: t.Optional(t.String()),
                hargaSewa: t.Optional(t.Number()),
                durasiHargaSewa: t.Optional(t.Number()),
                satuanDurasiHarga: t.Optional(t.String()),
                stokTersedia: t.Optional(t.Number()),
                gambarAlat: t.Optional(t.String()),
                kondisiAlat: t.Optional(t.String()),
            }),
        }
    )
    .delete("/:id", async ({ params, set }) => {
        try {
            await prisma.sewaAlat.delete({ where: { id: parseInt(params.id) } });

            return { success: true, message: "Alat sewa berhasil dihapus" };
        } catch (error) {
            console.error("Delete sewa alat error:", error);
            set.status = 500;
            return { success: false, message: "Terjadi kesalahan server" };
        }
    });
