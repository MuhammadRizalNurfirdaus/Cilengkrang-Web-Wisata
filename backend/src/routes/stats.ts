import { Elysia } from "elysia";
import prisma from "../db";

export const statsRoutes = new Elysia({ prefix: "/stats" })
    // Admin dashboard stats
    .get("/admin", async () => {
        try {
            const [
                totalWisata,
                totalArtikel,
                totalUser,
                totalPemesanan,
                totalPendapatan,
                pemesananPending,
                pesananHariIni,
                contactBelumDibaca,
                feedbackCount,
                galeriCount,
            ] = await Promise.all([
                prisma.wisata.count({ where: { aktif: true } }),
                prisma.article.count({ where: { published: true } }),
                prisma.user.count(),
                prisma.pemesananTiket.count(),
                prisma.pemesananTiket.aggregate({
                    _sum: { totalHargaAkhir: true },
                    where: { status: { in: ["PAID", "CONFIRMED", "COMPLETED"] } },
                }),
                prisma.pemesananTiket.count({ where: { status: "PENDING" } }),
                prisma.pemesananTiket.count({
                    where: {
                        createdAt: {
                            gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        },
                    },
                }),
                prisma.contact.count({ where: { dibaca: false } }),
                prisma.feedback.count(),
                prisma.galeri.count(),
            ]);

            // Recent orders (5 latest)
            const recentOrders = await prisma.pemesananTiket.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { nama: true, email: true } },
                },
            });

            return {
                success: true,
                data: {
                    totalWisata,
                    totalArtikel,
                    totalUser,
                    totalPemesanan,
                    totalPendapatan: Number(totalPendapatan._sum.totalHargaAkhir || 0),
                    pemesananPending,
                    pesananHariIni,
                    contactBelumDibaca,
                    feedbackCount,
                    galeriCount,
                    recentOrders: recentOrders.map((o) => ({
                        id: o.id,
                        kodePemesanan: o.kodePemesanan,
                        status: o.status,
                        totalHargaAkhir: Number(o.totalHargaAkhir),
                        createdAt: o.createdAt,
                        user: o.user,
                    })),
                },
            };
        } catch (error) {
            console.error("Stats admin error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    // User dashboard stats
    .get("/user/:userId", async ({ params }) => {
        try {
            const userId = parseInt(params.userId);

            const [totalPemesanan, pemesananPending, totalBelanja, recentOrders] = await Promise.all([
                prisma.pemesananTiket.count({ where: { userId } }),
                prisma.pemesananTiket.count({ where: { userId, status: "PENDING" } }),
                prisma.pemesananTiket.aggregate({
                    _sum: { totalHargaAkhir: true },
                    where: { userId, status: { in: ["PAID", "CONFIRMED", "COMPLETED"] } },
                }),
                prisma.pemesananTiket.findMany({
                    where: { userId },
                    take: 3,
                    orderBy: { createdAt: "desc" },
                    include: {
                        detailPemesanan: {
                            include: {
                                jenisTiket: { select: { namaLayananDisplay: true } },
                            },
                        },
                    },
                }),
            ]);

            return {
                success: true,
                data: {
                    totalPemesanan,
                    pemesananPending,
                    totalBelanja: Number(totalBelanja._sum.totalHargaAkhir || 0),
                    recentOrders: recentOrders.map((o) => ({
                        id: o.id,
                        kodePemesanan: o.kodePemesanan,
                        status: o.status,
                        totalHargaAkhir: Number(o.totalHargaAkhir),
                        tanggalKunjungan: o.tanggalKunjungan,
                        createdAt: o.createdAt,
                        detailPemesanan: o.detailPemesanan,
                    })),
                },
            };
        } catch (error) {
            console.error("Stats user error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    });
