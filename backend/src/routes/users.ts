import { Elysia, t } from "elysia";
import prisma from "../db";
import { hashPassword } from "../utils/password";

export const usersRoutes = new Elysia({ prefix: "/users" })
    // Get all users (admin only)
    .get("/", async ({ query }) => {
        try {
            const page = parseInt(query.page || "1");
            const limit = parseInt(query.limit || "10");
            const skip = (page - 1) * limit;

            const [users, total] = await Promise.all([
                prisma.user.findMany({
                    skip,
                    take: limit,
                    select: {
                        id: true,
                        nama: true,
                        email: true,
                        role: true,
                        noHp: true,
                        alamat: true,
                        fotoProfil: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: "desc" },
                }),
                prisma.user.count(),
            ]);

            return {
                success: true,
                data: users,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            console.error("Get users error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    // Get user by ID
    .get("/:id", async ({ params, set }) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: parseInt(params.id) },
                select: {
                    id: true,
                    nama: true,
                    email: true,
                    role: true,
                    noHp: true,
                    alamat: true,
                    fotoProfil: true,
                    createdAt: true,
                },
            });

            if (!user) {
                set.status = 404;
                return { success: false, message: "User tidak ditemukan" };
            }

            return { success: true, data: user };
        } catch (error) {
            console.error("Get user error:", error);
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    // Create user (admin only)
    .post(
        "/",
        async ({ body, set }) => {
            try {
                const existingUser = await prisma.user.findUnique({
                    where: { email: body.email },
                });

                if (existingUser) {
                    set.status = 400;
                    return { success: false, message: "Email sudah terdaftar" };
                }

                const hashedPassword = await hashPassword(body.password);

                const user = await prisma.user.create({
                    data: {
                        nama: body.nama,
                        email: body.email,
                        password: hashedPassword,
                        noHp: body.noHp,
                        alamat: body.alamat,
                        role: body.role || "user",
                    },
                    select: {
                        id: true,
                        nama: true,
                        email: true,
                        role: true,
                        createdAt: true,
                    },
                });

                set.status = 201;
                return { success: true, message: "User berhasil dibuat", data: user };
            } catch (error) {
                console.error("Create user error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                nama: t.String({ minLength: 1 }),
                email: t.String({ format: "email" }),
                password: t.String({ minLength: 6 }),
                noHp: t.Optional(t.String()),
                alamat: t.Optional(t.String()),
                role: t.Optional(t.String()),
            }),
        }
    )
    // Update user
    .put(
        "/:id",
        async ({ params, body, set }) => {
            try {
                const userId = parseInt(params.id);

                const existingUser = await prisma.user.findUnique({
                    where: { id: userId },
                });

                if (!existingUser) {
                    set.status = 404;
                    return { success: false, message: "User tidak ditemukan" };
                }

                const updateData: any = {
                    nama: body.nama,
                    noHp: body.noHp,
                    alamat: body.alamat,
                };

                if (body.role) {
                    updateData.role = body.role;
                }

                if (body.password) {
                    updateData.password = await hashPassword(body.password);
                }

                const user = await prisma.user.update({
                    where: { id: userId },
                    data: updateData,
                    select: {
                        id: true,
                        nama: true,
                        email: true,
                        role: true,
                        noHp: true,
                        alamat: true,
                        createdAt: true,
                    },
                });

                return { success: true, message: "User berhasil diupdate", data: user };
            } catch (error) {
                console.error("Update user error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                nama: t.Optional(t.String()),
                password: t.Optional(t.String()),
                noHp: t.Optional(t.String()),
                alamat: t.Optional(t.String()),
                role: t.Optional(t.String()),
            }),
        }
    )
    // Delete user
    .delete("/:id", async ({ params, set }) => {
        try {
            const userId = parseInt(params.id);

            const existingUser = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!existingUser) {
                set.status = 404;
                return { success: false, message: "User tidak ditemukan" };
            }

            await prisma.user.delete({
                where: { id: userId },
            });

            return { success: true, message: "User berhasil dihapus" };
        } catch (error) {
            console.error("Delete user error:", error);
            set.status = 500;
            return { success: false, message: "Terjadi kesalahan server" };
        }
    });
