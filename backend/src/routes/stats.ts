import { Elysia } from "elysia";
import { StatusPemesanan } from "@prisma/client";
import prisma from "../db";

const SUCCESS_ORDER_STATUSES: StatusPemesanan[] = ["PAID", "CONFIRMED", "COMPLETED"];

type OrderRevenueRow = {
    createdAt: Date;
    totalHargaAkhir: unknown;
};

type RevenuePoint = {
    key: string;
    label: string;
    revenue: number;
    orders: number;
};

function startOfDay(date: Date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}

function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function toNumber(value: unknown) {
    if (typeof value === "number") {
        return value;
    }

    if (typeof value === "bigint") {
        return Number(value);
    }

    if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
}

function calcGrowth(current: number, previous: number) {
    if (previous === 0) {
        return current > 0 ? 100 : 0;
    }

    return Number((((current - previous) / previous) * 100).toFixed(1));
}

function buildDailyPoints(rows: OrderRevenueRow[], now: Date) {
    const points: RevenuePoint[] = [];
    const startDate = startOfDay(addDays(now, -6));

    for (let index = 0; index < 7; index += 1) {
        const current = addDays(startDate, index);
        const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;

        points.push({
            key,
            label: current.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
            revenue: 0,
            orders: 0,
        });
    }

    const pointMap = new Map(points.map((point) => [point.key, point]));

    rows.forEach((row) => {
        const key = `${row.createdAt.getFullYear()}-${String(row.createdAt.getMonth() + 1).padStart(2, "0")}-${String(row.createdAt.getDate()).padStart(2, "0")}`;
        const point = pointMap.get(key);

        if (!point) {
            return;
        }

        point.revenue += toNumber(row.totalHargaAkhir);
        point.orders += 1;
    });

    return points;
}

function buildMonthlyPoints(rows: OrderRevenueRow[], now: Date) {
    const points: RevenuePoint[] = [];

    for (let offset = 5; offset >= 0; offset -= 1) {
        const current = new Date(now.getFullYear(), now.getMonth() - offset, 1);
        const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;

        points.push({
            key,
            label: current.toLocaleDateString("id-ID", { month: "short", year: "numeric" }),
            revenue: 0,
            orders: 0,
        });
    }

    const pointMap = new Map(points.map((point) => [point.key, point]));

    rows.forEach((row) => {
        const key = `${row.createdAt.getFullYear()}-${String(row.createdAt.getMonth() + 1).padStart(2, "0")}`;
        const point = pointMap.get(key);

        if (!point) {
            return;
        }

        point.revenue += toNumber(row.totalHargaAkhir);
        point.orders += 1;
    });

    return points;
}

export const statsRoutes = new Elysia({ prefix: "/stats" })
    .get("/admin", async () => {
        try {
            const now = new Date();
            const todayStart = startOfDay(now);
            const current30Start = addDays(todayStart, -29);
            const previous30Start = addDays(todayStart, -59);
            const monthSeriesStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

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
                statusBreakdownRaw,
                paidOrdersForMonthly,
                paidOrdersForDaily,
                paidOrdersCurrent30,
                paidOrdersPrevious30,
                allOrdersCurrent30,
                allOrdersPrevious30,
                topDestinationsRaw,
                recentOrders,
            ] = await Promise.all([
                prisma.wisata.count({ where: { aktif: true } }),
                prisma.article.count({ where: { published: true } }),
                prisma.user.count(),
                prisma.pemesananTiket.count(),
                prisma.pemesananTiket.aggregate({
                    _sum: { totalHargaAkhir: true },
                    where: { status: { in: SUCCESS_ORDER_STATUSES } },
                }),
                prisma.pemesananTiket.count({ where: { status: "PENDING" } }),
                prisma.pemesananTiket.count({
                    where: {
                        createdAt: { gte: todayStart },
                    },
                }),
                prisma.contact.count({ where: { dibaca: false } }),
                prisma.feedback.count(),
                prisma.galeri.count(),
                prisma.pemesananTiket.groupBy({
                    by: ["status"],
                    _count: { _all: true },
                }),
                prisma.pemesananTiket.findMany({
                    where: {
                        status: { in: SUCCESS_ORDER_STATUSES },
                        createdAt: { gte: monthSeriesStart },
                    },
                    select: { createdAt: true, totalHargaAkhir: true },
                }),
                prisma.pemesananTiket.findMany({
                    where: {
                        status: { in: SUCCESS_ORDER_STATUSES },
                        createdAt: { gte: addDays(todayStart, -6) },
                    },
                    select: { createdAt: true, totalHargaAkhir: true },
                }),
                prisma.pemesananTiket.findMany({
                    where: {
                        status: { in: SUCCESS_ORDER_STATUSES },
                        createdAt: { gte: current30Start },
                    },
                    select: { createdAt: true, totalHargaAkhir: true },
                }),
                prisma.pemesananTiket.findMany({
                    where: {
                        status: { in: SUCCESS_ORDER_STATUSES },
                        createdAt: { gte: previous30Start, lt: current30Start },
                    },
                    select: { createdAt: true, totalHargaAkhir: true },
                }),
                prisma.pemesananTiket.count({
                    where: {
                        createdAt: { gte: current30Start },
                    },
                }),
                prisma.pemesananTiket.count({
                    where: {
                        createdAt: { gte: previous30Start, lt: current30Start },
                    },
                }),
                prisma.detailPemesananTiket.findMany({
                    where: {
                        pemesananTiket: {
                            status: { in: SUCCESS_ORDER_STATUSES },
                            createdAt: { gte: current30Start },
                        },
                    },
                    include: {
                        jenisTiket: {
                            include: {
                                wisata: {
                                    select: { id: true, nama: true },
                                },
                            },
                        },
                    },
                }),
                prisma.pemesananTiket.findMany({
                    take: 5,
                    orderBy: { createdAt: "desc" },
                    include: {
                        user: { select: { nama: true, email: true } },
                    },
                }),
            ]);

            const monthlyRevenue = buildMonthlyPoints(paidOrdersForMonthly, now);
            const dailyRevenue = buildDailyPoints(paidOrdersForDaily, now);

            const current30Revenue = paidOrdersCurrent30.reduce(
                (sum, row) => sum + toNumber(row.totalHargaAkhir),
                0
            );
            const previous30Revenue = paidOrdersPrevious30.reduce(
                (sum, row) => sum + toNumber(row.totalHargaAkhir),
                0
            );

            const paidOrderCount30 = paidOrdersCurrent30.length;
            const averageOrderValue = paidOrderCount30 > 0 ? Math.round(current30Revenue / paidOrderCount30) : 0;

            const statusBreakdown = statusBreakdownRaw
                .map((item) => ({
                    status: item.status,
                    count: item._count._all,
                }))
                .sort((left, right) => right.count - left.count);

            const destinationRevenueMap = new Map<
                number,
                { wisataId: number; nama: string; revenue: number; totalItem: number }
            >();

            topDestinationsRaw.forEach((row) => {
                const wisata = row.jenisTiket.wisata;
                if (!wisata) {
                    return;
                }

                const current = destinationRevenueMap.get(wisata.id) || {
                    wisataId: wisata.id,
                    nama: wisata.nama,
                    revenue: 0,
                    totalItem: 0,
                };

                current.revenue += toNumber(row.subtotalItem);
                current.totalItem += row.jumlah;
                destinationRevenueMap.set(wisata.id, current);
            });

            const topDestinations = Array.from(destinationRevenueMap.values())
                .sort((left, right) => right.revenue - left.revenue)
                .slice(0, 5);

            return {
                success: true,
                data: {
                    totalWisata,
                    totalArtikel,
                    totalUser,
                    totalPemesanan,
                    totalPendapatan: toNumber(totalPendapatan._sum?.totalHargaAkhir),
                    pemesananPending,
                    pesananHariIni,
                    contactBelumDibaca,
                    feedbackCount,
                    galeriCount,
                    recentOrders: recentOrders.map((order) => ({
                        id: order.id,
                        kodePemesanan: order.kodePemesanan,
                        status: order.status,
                        totalHargaAkhir: toNumber(order.totalHargaAkhir),
                        createdAt: order.createdAt,
                        user: order.user,
                    })),
                    financialSummary: {
                        current30Revenue,
                        previous30Revenue,
                        revenueGrowthPercent: calcGrowth(current30Revenue, previous30Revenue),
                        current30Orders: allOrdersCurrent30,
                        previous30Orders: allOrdersPrevious30,
                        orderGrowthPercent: calcGrowth(allOrdersCurrent30, allOrdersPrevious30),
                        averageOrderValue,
                        paidOrderCount30,
                    },
                    monthlyRevenue,
                    dailyRevenue,
                    statusBreakdown,
                    topDestinations,
                },
            };
        } catch (error) {
            console.error("Stats admin error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .get("/user/:userId", async ({ params }) => {
        try {
            const userId = parseInt(params.userId);

            const [totalPemesanan, pemesananPending, totalBelanja, recentOrders] = await Promise.all([
                prisma.pemesananTiket.count({ where: { userId } }),
                prisma.pemesananTiket.count({ where: { userId, status: "PENDING" } }),
                prisma.pemesananTiket.aggregate({
                    _sum: { totalHargaAkhir: true },
                    where: { userId, status: { in: SUCCESS_ORDER_STATUSES } },
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
                    totalBelanja: toNumber(totalBelanja._sum?.totalHargaAkhir),
                    recentOrders: recentOrders.map((order) => ({
                        id: order.id,
                        kodePemesanan: order.kodePemesanan,
                        status: order.status,
                        totalHargaAkhir: toNumber(order.totalHargaAkhir),
                        tanggalKunjungan: order.tanggalKunjungan,
                        createdAt: order.createdAt,
                        detailPemesanan: order.detailPemesanan,
                    })),
                },
            };
        } catch (error) {
            console.error("Stats user error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    });
