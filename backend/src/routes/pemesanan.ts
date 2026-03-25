import { Elysia, t } from "elysia";
import type { StatusPemesanan } from "@prisma/client";
import prisma from "../db";
import { RequestError, parseDateOnly, parsePositiveInt } from "../utils/request";

// Generate unique order code
function generateKodePemesanan(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CIL${timestamp}${random}`;
}

const ALLOWED_STATUS_PEMESANAN = new Set([
    "PENDING",
    "WAITING_PAYMENT",
    "PAID",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
    "EXPIRED",
]);

function parsePage(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value || "", 10);
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export const pemesananRoutes = new Elysia({ prefix: "/pemesanan" })
    .get("/", async ({ query }) => {
        try {
            const page = parsePage(query.page, 1);
            const limit = parsePage(query.limit, 10);
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
            const userId = parsePositiveInt(params.userId, "User ID");
            const page = parsePage(query.page, 1);
            const limit = parsePage(query.limit, 10);
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
            if (error instanceof RequestError) {
                return { success: false, message: error.message };
            }

            console.error("Get user pemesanan error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .get("/:id", async ({ params, set }) => {
        try {
            const id = parsePositiveInt(params.id);
            const pemesanan = await prisma.pemesananTiket.findUnique({
                where: { id },
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
            if (error instanceof RequestError) {
                set.status = error.status;
                return { success: false, message: error.message };
            }

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
                const tanggalKunjungan = parseDateOnly(body.tanggalKunjungan, "Tanggal kunjungan");

                if (body.items.length === 0) {
                    throw new RequestError("Mohon pilih minimal 1 tiket", 400);
                }

                if (!body.userId && (!body.namaPemesanTamu || !body.emailPemesanTamu)) {
                    throw new RequestError("Nama dan email tamu wajib diisi untuk pemesanan tanpa akun", 400);
                }

                const seenTicketIds = new Set<number>();
                for (const item of body.items) {
                    if (seenTicketIds.has(item.jenisTiketId)) {
                        throw new RequestError(`Jenis tiket ID ${item.jenisTiketId} duplikat`, 400);
                    }

                    seenTicketIds.add(item.jenisTiketId);
                }

                const ticketIds = body.items.map((item) => item.jenisTiketId);
                const kodePemesanan = generateKodePemesanan();

                const pemesanan = await prisma.$transaction(async (tx) => {
                    const jenisTiketList = await tx.jenisTiket.findMany({
                        where: {
                            id: { in: ticketIds },
                            aktif: true,
                        },
                    });
                    const jenisTiketMap = new Map(
                        jenisTiketList.map((jenisTiket) => [jenisTiket.id, jenisTiket])
                    );

                    const jadwalList = await tx.jadwalKetersediaanTiket.findMany({
                        where: {
                            jenisTiketId: { in: ticketIds },
                            tanggal: tanggalKunjungan,
                            aktif: true,
                        },
                    });
                    const jadwalMap = new Map(
                        jadwalList.map((jadwal) => [jadwal.jenisTiketId, jadwal])
                    );

                    let totalHarga = 0;
                    const detailData = body.items.map((item) => {
                        const jenisTiket = jenisTiketMap.get(item.jenisTiketId);

                        if (!jenisTiket) {
                            throw new RequestError(
                                `Jenis tiket ID ${item.jenisTiketId} tidak ditemukan atau tidak aktif`,
                                400
                            );
                        }

                        const jadwal = jadwalMap.get(item.jenisTiketId);
                        if (jadwal && jadwal.jumlahSaatIniTersedia < item.jumlah) {
                            throw new RequestError(
                                `${jenisTiket.namaLayananDisplay} hanya tersisa ${jadwal.jumlahSaatIniTersedia} tiket`,
                                409
                            );
                        }

                        const subtotal = jenisTiket.harga * item.jumlah;
                        totalHarga += subtotal;

                        return {
                            jenisTiketId: item.jenisTiketId,
                            jumlah: item.jumlah,
                            hargaSatuanSaatPesan: jenisTiket.harga,
                            subtotalItem: subtotal,
                        };
                    });

                    const createdPemesanan = await tx.pemesananTiket.create({
                        data: {
                            userId: body.userId,
                            namaPemesanTamu: body.namaPemesanTamu,
                            emailPemesanTamu: body.emailPemesanTamu,
                            nohpPemesanTamu: body.nohpPemesanTamu,
                            kodePemesanan,
                            tanggalKunjungan,
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

                    for (const item of body.items) {
                        const jadwal = jadwalMap.get(item.jenisTiketId);
                        if (!jadwal) {
                            continue;
                        }

                        const updated = await tx.jadwalKetersediaanTiket.updateMany({
                            where: {
                                id: jadwal.id,
                                jumlahSaatIniTersedia: { gte: item.jumlah },
                            },
                            data: {
                                jumlahSaatIniTersedia: {
                                    decrement: item.jumlah,
                                },
                            },
                        });

                        if (updated.count !== 1) {
                            throw new RequestError(
                                "Ketersediaan tiket berubah. Silakan ulangi pemesanan.",
                                409
                            );
                        }
                    }

                    return createdPemesanan;
                });

                set.status = 201;
                return { success: true, message: "Pemesanan berhasil dibuat", data: pemesanan };
            } catch (error) {
                if (error instanceof RequestError) {
                    set.status = error.status;
                    return { success: false, message: error.message };
                }

                console.error("Create pemesanan error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                userId: t.Optional(t.Number()),
                namaPemesanTamu: t.Optional(t.String()),
                emailPemesanTamu: t.Optional(t.String({ format: "email" })),
                nohpPemesanTamu: t.Optional(t.String()),
                tanggalKunjungan: t.String(),
                catatan: t.Optional(t.String()),
                items: t.Array(
                    t.Object({
                        jenisTiketId: t.Number(),
                        jumlah: t.Number({ minimum: 1 }),
                    }),
                    { minItems: 1 }
                ),
            }),
        }
    )
    .put(
        "/:id/status",
        async ({ params, body, set }) => {
            try {
                const id = parsePositiveInt(params.id);

                if (!ALLOWED_STATUS_PEMESANAN.has(body.status)) {
                    throw new RequestError("Status pemesanan tidak valid", 400);
                }

                const status = body.status as StatusPemesanan;

                const pemesanan = await prisma.pemesananTiket.update({
                    where: { id },
                    data: { status },
                });

                return { success: true, message: "Status pemesanan berhasil diupdate", data: pemesanan };
            } catch (error) {
                if (error instanceof RequestError) {
                    set.status = error.status;
                    return { success: false, message: error.message };
                }

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
            const id = parsePositiveInt(params.id);

            await prisma.pemesananTiket.delete({ where: { id } });

            return { success: true, message: "Pemesanan berhasil dihapus" };
        } catch (error) {
            if (error instanceof RequestError) {
                set.status = error.status;
                return { success: false, message: error.message };
            }

            console.error("Delete pemesanan error:", error);
            set.status = 500;
            return { success: false, message: "Terjadi kesalahan server" };
        }
    });
