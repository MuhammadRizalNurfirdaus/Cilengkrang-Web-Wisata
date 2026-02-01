import { Elysia, t } from "elysia";
import prisma from "../db";

export const contactsRoutes = new Elysia({ prefix: "/contacts" })
    .get("/", async ({ query }) => {
        try {
            const page = parseInt(query.page || "1");
            const limit = parseInt(query.limit || "10");
            const skip = (page - 1) * limit;

            const [contacts, total] = await Promise.all([
                prisma.contact.findMany({
                    skip,
                    take: limit,
                    orderBy: { createdAt: "desc" },
                }),
                prisma.contact.count(),
            ]);

            return {
                success: true,
                data: contacts,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            };
        } catch (error) {
            console.error("Get contacts error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .get("/:id", async ({ params, set }) => {
        try {
            const contact = await prisma.contact.findUnique({
                where: { id: parseInt(params.id) },
            });

            if (!contact) {
                set.status = 404;
                return { success: false, message: "Kontak tidak ditemukan" };
            }

            return { success: true, data: contact };
        } catch (error) {
            console.error("Get contact error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .post(
        "/",
        async ({ body, set }) => {
            try {
                const contact = await prisma.contact.create({
                    data: {
                        nama: body.nama,
                        email: body.email,
                        pesan: body.pesan,
                    },
                });

                set.status = 201;
                return { success: true, message: "Pesan berhasil dikirim", data: contact };
            } catch (error) {
                console.error("Create contact error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                nama: t.String({ minLength: 1 }),
                email: t.String({ format: "email" }),
                pesan: t.String({ minLength: 1 }),
            }),
        }
    )
    .delete("/:id", async ({ params, set }) => {
        try {
            const contactId = parseInt(params.id);

            await prisma.contact.delete({ where: { id: contactId } });

            return { success: true, message: "Kontak berhasil dihapus" };
        } catch (error) {
            console.error("Delete contact error:", error);
            set.status = 500;
            return { success: false, message: "Terjadi kesalahan server" };
        }
    });
