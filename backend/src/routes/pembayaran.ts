import { Elysia, t } from "elysia";
import prisma from "../db";

export const pembayaranRoutes = new Elysia({ prefix: "/pembayaran" })
    .get("/", async ({ query }) => {
        try {
            const page = parseInt(query.page || "1");
            const limit = parseInt(query.limit || "10");
            const skip = (page - 1) * limit;

            const [pembayaran, total] = await Promise.all([
                prisma.pembayaran.findMany({
                    skip,
                    take: limit,
                    include: {
                        pemesananTiket: {
                            select: { id: true, kodePemesanan: true, namaPemesanTamu: true, user: { select: { nama: true, email: true } } },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                }),
                prisma.pembayaran.count(),
            ]);

            return {
                success: true,
                data: pembayaran,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            };
        } catch (error) {
            console.error("Get pembayaran error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .get("/:id", async ({ params, set }) => {
        try {
            const pembayaran = await prisma.pembayaran.findUnique({
                where: { id: parseInt(params.id) },
                include: {
                    pemesananTiket: {
                        include: { user: { select: { id: true, nama: true, email: true } } },
                    },
                },
            });

            if (!pembayaran) {
                set.status = 404;
                return { success: false, message: "Pembayaran tidak ditemukan" };
            }

            return { success: true, data: pembayaran };
        } catch (error) {
            console.error("Get pembayaran error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .post(
        "/",
        async ({ body, set }) => {
            try {
                // Check if pemesanan already has payment
                const existingPayment = await prisma.pembayaran.findUnique({
                    where: { pemesananTiketId: body.pemesananTiketId },
                });

                if (existingPayment) {
                    set.status = 400;
                    return { success: false, message: "Pemesanan ini sudah memiliki data pembayaran" };
                }

                const pembayaran = await prisma.pembayaran.create({
                    data: {
                        pemesananTiketId: body.pemesananTiketId,
                        metodePembayaran: body.metodePembayaran,
                        jumlahDibayar: body.jumlahDibayar,
                        statusPembayaran: "PENDING",
                        nomorVirtualAccount: body.nomorVirtualAccount,
                    },
                });

                set.status = 201;
                return { success: true, message: "Pembayaran berhasil dibuat", data: pembayaran };
            } catch (error) {
                console.error("Create pembayaran error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                pemesananTiketId: t.Number(),
                metodePembayaran: t.String(),
                jumlahDibayar: t.Number(),
                nomorVirtualAccount: t.Optional(t.String()),
            }),
        }
    )
    .put(
        "/:id/confirm",
        async ({ params, body, set }) => {
            try {
                const id = parseInt(params.id);

                const pembayaran = await prisma.pembayaran.update({
                    where: { id },
                    data: {
                        statusPembayaran: "SUCCESS",
                        waktuPembayaran: new Date(),
                        buktiPembayaran: body.buktiPembayaran,
                        idTransaksiGateway: body.idTransaksiGateway,
                    },
                });

                // Update pemesanan status to PAID
                await prisma.pemesananTiket.update({
                    where: { id: pembayaran.pemesananTiketId },
                    data: { status: "PAID" },
                });

                return { success: true, message: "Pembayaran berhasil dikonfirmasi", data: pembayaran };
            } catch (error) {
                console.error("Confirm pembayaran error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                buktiPembayaran: t.Optional(t.String()),
                idTransaksiGateway: t.Optional(t.String()),
            }),
        }
    )
    .delete("/:id", async ({ params, set }) => {
        try {
            await prisma.pembayaran.delete({ where: { id: parseInt(params.id) } });

            return { success: true, message: "Pembayaran berhasil dihapus" };
        } catch (error) {
            console.error("Delete pembayaran error:", error);
            set.status = 500;
            return { success: false, message: "Terjadi kesalahan server" };
        }
    });
