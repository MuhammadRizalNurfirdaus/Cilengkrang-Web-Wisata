import { Elysia, t } from "elysia";
import prisma from "../db";
import { RequestError, parseDateOnly, parsePositiveInt } from "../utils/request";

export const jadwalRoutes = new Elysia({ prefix: "/jadwal" })
    // Get all schedule for a ticket type
    .get("/", async ({ query, set }) => {
        try {
            const ticketId = query.ticketId ? parsePositiveInt(query.ticketId, "Ticket ID") : undefined;
            const startDate = query.start ? parseDateOnly(query.start, "Tanggal mulai") : undefined;
            const endDate = query.end ? parseDateOnly(query.end, "Tanggal selesai") : undefined;

            if (startDate && endDate && startDate > endDate) {
                throw new RequestError("Tanggal mulai tidak boleh lebih besar dari tanggal selesai", 400);
            }

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
            if (error instanceof RequestError) {
                set.status = error.status;
                return { success: false, message: error.message };
            }

            console.error("Get jadwal error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    // Get schedule by ID
    .get("/:id", async ({ params, set }) => {
        try {
            const id = parsePositiveInt(params.id);
            const jadwal = await prisma.jadwalKetersediaanTiket.findUnique({
                where: { id },
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
            if (error instanceof RequestError) {
                set.status = error.status;
                return { success: false, message: error.message };
            }

            console.error("Get jadwal error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    // Update availability
    .put("/:id/availability", async ({ params, body, set }) => {
        try {
            const id = parsePositiveInt(params.id);
            const count = body.count;

            if (!Number.isInteger(count) || count < 1) {
                throw new RequestError("Jumlah pengurangan ketersediaan harus berupa bilangan bulat minimal 1", 400);
            }

            const existingSchedule = await prisma.jadwalKetersediaanTiket.findUnique({
                where: { id },
            });

            if (!existingSchedule) {
                throw new RequestError("Jadwal tidak ditemukan", 404);
            }

            if (existingSchedule.jumlahSaatIniTersedia < count) {
                throw new RequestError("Jumlah ketersediaan tidak mencukupi", 409);
            }

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
            if (error instanceof RequestError) {
                set.status = error.status;
                return { success: false, message: error.message };
            }

            console.error("Update availability error:", error);
            set.status = 500;
            return { success: false, message: "Gagal memperbarui ketersediaan" };
        }
    }, {
        body: t.Object({
            count: t.Number({ minimum: 1 })
        })
    });
