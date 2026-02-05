import { Elysia, t } from "elysia";
import prisma from "../db";

export const jadwalRoutes = new Elysia({ prefix: "/jadwal" })
    // Get all schedule for a ticket type
    .get("/", async ({ query }) => {
        try {
            const ticketId = query.ticketId ? parseInt(query.ticketId) : undefined;
            const startDate = query.start ? new Date(query.start) : undefined;
            const endDate = query.end ? new Date(query.end) : undefined;

            const schedules = await prisma.jadwalKetersediaanTiket.findMany({
                where: {
                    jenisTiketId: ticketId,
                    tanggal: {
                        gte: startDate,
                        lte: endDate,
                    },
                    aktif: true,
                },
                orderBy: { tanggal: "asc" },
                include: {
                    jenisTiket: {
                        select: {
                            namaLayananDisplay: true,
                            wisata: {
                                select: { nama: true }
                            }
                        }
                    }
                }
            });

            return { success: true, data: schedules };
        } catch (error) {
            console.error("Get jadwal error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    // Get schedule by ID
    .get("/:id", async ({ params, set }) => {
        try {
            const jadwal = await prisma.jadwalKetersediaanTiket.findUnique({
                where: { id: parseInt(params.id) },
                include: {
                    jenisTiket: true
                }
            });

            if (!jadwal) {
                set.status = 404;
                return { success: false, message: "Jadwal tidak ditemukan" };
            }

            return { success: true, data: jadwal };
        } catch (error) {
            console.error("Get jadwal error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    // Update availability
    .put("/:id/availability", async ({ params, body, set }) => {
        try {
            const id = parseInt(params.id);
            const count = parseInt(body.count);

            const jadwal = await prisma.jadwalKetersediaanTiket.update({
                where: { id },
                data: {
                    jumlahSaatIniTersedia: {
                        decrement: count
                    }
                }
            });

            return { success: true, data: jadwal };
        } catch (error) {
            console.error("Update availability error:", error);
            set.status = 500;
            return { success: false, message: "Gagal memperbarui ketersediaan" };
        }
    }, {
        body: t.Object({
            count: t.Number()
        })
    });
