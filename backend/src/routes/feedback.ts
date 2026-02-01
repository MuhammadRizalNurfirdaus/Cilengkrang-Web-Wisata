import { Elysia, t } from "elysia";
import prisma from "../db";

export const feedbackRoutes = new Elysia({ prefix: "/feedback" })
    .get("/", async ({ query }) => {
        try {
            const page = parseInt(query.page || "1");
            const limit = parseInt(query.limit || "10");
            const skip = (page - 1) * limit;

            const [feedback, total] = await Promise.all([
                prisma.feedback.findMany({
                    skip,
                    take: limit,
                    include: {
                        user: { select: { id: true, nama: true, fotoProfil: true } },
                        artikel: { select: { id: true, judul: true } },
                    },
                    orderBy: { createdAt: "desc" },
                }),
                prisma.feedback.count(),
            ]);

            return {
                success: true,
                data: feedback,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            };
        } catch (error) {
            console.error("Get feedback error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .post(
        "/",
        async ({ body, set }) => {
            try {
                const feedback = await prisma.feedback.create({
                    data: {
                        userId: body.userId,
                        artikelId: body.artikelId,
                        komentar: body.komentar,
                        rating: body.rating,
                    },
                });

                set.status = 201;
                return { success: true, message: "Feedback berhasil dikirim", data: feedback };
            } catch (error) {
                console.error("Create feedback error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                userId: t.Optional(t.Number()),
                artikelId: t.Optional(t.Number()),
                komentar: t.String({ minLength: 1 }),
                rating: t.Optional(t.Number({ minimum: 1, maximum: 5 })),
            }),
        }
    )
    .delete("/:id", async ({ params, set }) => {
        try {
            const feedbackId = parseInt(params.id);

            await prisma.feedback.delete({ where: { id: feedbackId } });

            return { success: true, message: "Feedback berhasil dihapus" };
        } catch (error) {
            console.error("Delete feedback error:", error);
            set.status = 500;
            return { success: false, message: "Terjadi kesalahan server" };
        }
    });
