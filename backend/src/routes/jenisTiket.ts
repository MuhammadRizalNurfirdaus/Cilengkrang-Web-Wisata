import { Elysia, t } from "elysia";
import prisma from "../db";

export const jenisTiketRoutes = new Elysia({ prefix: "/jenis-tiket" })
    .get("/", async ({ query }) => {
        try {
            const aktifOnly = query.aktif === "true";

            const where = aktifOnly ? { aktif: true } : {};

            const jenisTiket = await prisma.jenisTiket.findMany({
                where,
                include: { wisata: { select: { id: true, nama: true } } },
                orderBy: { createdAt: "desc" },
            });

            return { success: true, data: jenisTiket };
        } catch (error) {
            console.error("Get jenis tiket error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .get("/:id", async ({ params, set }) => {
        try {
            const jenisTiket = await prisma.jenisTiket.findUnique({
                where: { id: parseInt(params.id) },
                include: { wisata: true },
            });

            if (!jenisTiket) {
                set.status = 404;
                return { success: false, message: "Jenis tiket tidak ditemukan" };
            }

            return { success: true, data: jenisTiket };
        } catch (error) {
            console.error("Get jenis tiket error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .post(
        "/",
        async ({ body, set }) => {
            try {
                const jenisTiket = await prisma.jenisTiket.create({
                    data: {
                        namaLayananDisplay: body.namaLayananDisplay,
                        tipeHari: body.tipeHari as any,
                        harga: body.harga,
                        deskripsi: body.deskripsi,
                        aktif: body.aktif ?? true,
                        wisataId: body.wisataId,
                    },
                });

                set.status = 201;
                return { success: true, message: "Jenis tiket berhasil dibuat", data: jenisTiket };
            } catch (error) {
                console.error("Create jenis tiket error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                namaLayananDisplay: t.String({ minLength: 1 }),
                tipeHari: t.String(),
                harga: t.Number({ minimum: 0 }),
                deskripsi: t.Optional(t.String()),
                aktif: t.Optional(t.Boolean()),
                wisataId: t.Optional(t.Number()),
            }),
        }
    )
    .put(
        "/:id",
        async ({ params, body, set }) => {
            try {
                const id = parseInt(params.id);

                const existing = await prisma.jenisTiket.findUnique({ where: { id } });
                if (!existing) {
                    set.status = 404;
                    return { success: false, message: "Jenis tiket tidak ditemukan" };
                }

                const jenisTiket = await prisma.jenisTiket.update({
                    where: { id },
                    data: {
                        namaLayananDisplay: body.namaLayananDisplay,
                        tipeHari: body.tipeHari as any,
                        harga: body.harga,
                        deskripsi: body.deskripsi,
                        aktif: body.aktif,
                        wisataId: body.wisataId,
                    },
                });

                return { success: true, message: "Jenis tiket berhasil diupdate", data: jenisTiket };
            } catch (error) {
                console.error("Update jenis tiket error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                namaLayananDisplay: t.Optional(t.String()),
                tipeHari: t.Optional(t.String()),
                harga: t.Optional(t.Number()),
                deskripsi: t.Optional(t.String()),
                aktif: t.Optional(t.Boolean()),
                wisataId: t.Optional(t.Number()),
            }),
        }
    )
    .delete("/:id", async ({ params, set }) => {
        try {
            const id = parseInt(params.id);

            await prisma.jenisTiket.delete({ where: { id } });

            return { success: true, message: "Jenis tiket berhasil dihapus" };
        } catch (error) {
            console.error("Delete jenis tiket error:", error);
            set.status = 500;
            return { success: false, message: "Terjadi kesalahan server" };
        }
    });
