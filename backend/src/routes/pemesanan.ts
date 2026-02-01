import { Elysia, t } from "elysia";
import prisma from "../db";

// Generate unique order code
function generateKodePemesanan(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CIL${timestamp}${random}`;
}

export const pemesananRoutes = new Elysia({ prefix: "/pemesanan" })
    .get("/", async ({ query }) => {
        try {
            const page = parseInt(query.page || "1");
            const limit = parseInt(query.limit || "10");
            const skip = (page - 1) * limit;
            const status = query.status;

            const where: any = {};
            if (status) where.status = status;

            const [pemesanan, total] = await Promise.all([
                prisma.pemesananTiket.findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
                        user: { select: { id: true, nama: true, email: true } },
                        detailPemesanan: {
                            include: { jenisTiket: { select: { namaLayananDisplay: true, tipeHari: true } } },
                        },
                        pembayaran: true,
                    },
                    orderBy: { createdAt: "desc" },
                }),
                prisma.pemesananTiket.count({ where }),
            ]);

            return {
                success: true,
                data: pemesanan,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            };
        } catch (error) {
            console.error("Get pemesanan error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .get("/user/:userId", async ({ params, query }) => {
        try {
            const userId = parseInt(params.userId);
            const page = parseInt(query.page || "1");
            const limit = parseInt(query.limit || "10");
            const skip = (page - 1) * limit;

            const [pemesanan, total] = await Promise.all([
                prisma.pemesananTiket.findMany({
                    where: { userId },
                    skip,
                    take: limit,
                    include: {
                        detailPemesanan: {
                            include: { jenisTiket: { select: { namaLayananDisplay: true, tipeHari: true } } },
                        },
                        pembayaran: true,
                    },
                    orderBy: { createdAt: "desc" },
                }),
                prisma.pemesananTiket.count({ where: { userId } }),
            ]);

            return {
                success: true,
                data: pemesanan,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            };
        } catch (error) {
            console.error("Get user pemesanan error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .get("/:id", async ({ params, set }) => {
        try {
            const pemesanan = await prisma.pemesananTiket.findUnique({
                where: { id: parseInt(params.id) },
                include: {
                    user: { select: { id: true, nama: true, email: true, noHp: true } },
                    detailPemesanan: {
                        include: { jenisTiket: true },
                    },
                    pembayaran: true,
                    pemesananSewaAlat: {
                        include: { sewaAlat: true },
                    },
                },
            });

            if (!pemesanan) {
                set.status = 404;
                return { success: false, message: "Pemesanan tidak ditemukan" };
            }

            return { success: true, data: pemesanan };
        } catch (error) {
            console.error("Get pemesanan detail error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .get("/kode/:kode", async ({ params, set }) => {
        try {
            const pemesanan = await prisma.pemesananTiket.findUnique({
                where: { kodePemesanan: params.kode },
                include: {
                    user: { select: { id: true, nama: true, email: true, noHp: true } },
                    detailPemesanan: {
                        include: { jenisTiket: true },
                    },
                    pembayaran: true,
                },
            });

            if (!pemesanan) {
                set.status = 404;
                return { success: false, message: "Pemesanan tidak ditemukan" };
            }

            return { success: true, data: pemesanan };
        } catch (error) {
            console.error("Get pemesanan by kode error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .post(
        "/",
        async ({ body, set }) => {
            try {
                const kodePemesanan = generateKodePemesanan();

                // Calculate total price from items
                let totalHarga = 0;
                const detailData = [];

                for (const item of body.items) {
                    const jenisTiket = await prisma.jenisTiket.findUnique({
                        where: { id: item.jenisTiketId },
                    });

                    if (!jenisTiket) {
                        set.status = 400;
                        return { success: false, message: `Jenis tiket ID ${item.jenisTiketId} tidak ditemukan` };
                    }

                    const subtotal = jenisTiket.harga * item.jumlah;
                    totalHarga += subtotal;

                    detailData.push({
                        jenisTiketId: item.jenisTiketId,
                        jumlah: item.jumlah,
                        hargaSatuanSaatPesan: jenisTiket.harga,
                        subtotalItem: subtotal,
                    });
                }

                const pemesanan = await prisma.pemesananTiket.create({
                    data: {
                        userId: body.userId,
                        namaPemesanTamu: body.namaPemesanTamu,
                        emailPemesanTamu: body.emailPemesanTamu,
                        nohpPemesanTamu: body.nohpPemesanTamu,
                        kodePemesanan,
                        tanggalKunjungan: new Date(body.tanggalKunjungan),
                        totalHargaAkhir: totalHarga,
                        status: "PENDING",
                        catatanUmumPemesanan: body.catatan,
                        detailPemesanan: {
                            create: detailData,
                        },
                    },
                    include: {
                        detailPemesanan: { include: { jenisTiket: true } },
                    },
                });

                set.status = 201;
                return { success: true, message: "Pemesanan berhasil dibuat", data: pemesanan };
            } catch (error) {
                console.error("Create pemesanan error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                userId: t.Optional(t.Number()),
                namaPemesanTamu: t.Optional(t.String()),
                emailPemesanTamu: t.Optional(t.String()),
                nohpPemesanTamu: t.Optional(t.String()),
                tanggalKunjungan: t.String(),
                catatan: t.Optional(t.String()),
                items: t.Array(
                    t.Object({
                        jenisTiketId: t.Number(),
                        jumlah: t.Number({ minimum: 1 }),
                    })
                ),
            }),
        }
    )
    .put(
        "/:id/status",
        async ({ params, body, set }) => {
            try {
                const id = parseInt(params.id);

                const pemesanan = await prisma.pemesananTiket.update({
                    where: { id },
                    data: { status: body.status as any },
                });

                return { success: true, message: "Status pemesanan berhasil diupdate", data: pemesanan };
            } catch (error) {
                console.error("Update pemesanan status error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                status: t.String(),
            }),
        }
    )
    .delete("/:id", async ({ params, set }) => {
        try {
            const id = parseInt(params.id);

            await prisma.pemesananTiket.delete({ where: { id } });

            return { success: true, message: "Pemesanan berhasil dihapus" };
        } catch (error) {
            console.error("Delete pemesanan error:", error);
            set.status = 500;
            return { success: false, message: "Terjadi kesalahan server" };
        }
    });
