import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import prisma from "../db";
import { hashPassword, verifyPassword } from "../utils/password";

export const authRoutes = new Elysia({ prefix: "/auth" })
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET || "default-secret-key",
        })
    )
    .post(
        "/register",
        async ({ body, set }) => {
            try {
                const { nama, email, password, noHp, alamat } = body;

                // Check if email already exists
                const existingUser = await prisma.user.findUnique({
                    where: { email },
                });

                if (existingUser) {
                    set.status = 400;
                    return { success: false, message: "Email sudah terdaftar" };
                }

                // Hash password
                const hashedPassword = await hashPassword(password);

                // Create user
                const user = await prisma.user.create({
                    data: {
                        nama,
                        email,
                        password: hashedPassword,
                        noHp,
                        alamat,
                        role: "user",
                    },
                    select: {
                        id: true,
                        nama: true,
                        email: true,
                        role: true,
                        createdAt: true,
                    },
                });

                return {
                    success: true,
                    message: "Registrasi berhasil",
                    data: user,
                };
            } catch (error) {
                console.error("Register error:", error);
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
            }),
        }
    )
    .post(
        "/login",
        async ({ body, jwt, set }) => {
            try {
                const { email, password } = body;

                // Find user by email
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    set.status = 401;
                    return { success: false, message: "Email atau password salah" };
                }

                // Verify password
                const isValidPassword = await verifyPassword(password, user.password);

                if (!isValidPassword) {
                    set.status = 401;
                    return { success: false, message: "Email atau password salah" };
                }

                // Generate JWT token
                const token = await jwt.sign({
                    userId: user.id,
                    email: user.email,
                    role: user.role,
                });

                return {
                    success: true,
                    message: "Login berhasil",
                    data: {
                        token,
                        user: {
                            id: user.id,
                            nama: user.nama,
                            email: user.email,
                            role: user.role,
                            noHp: user.noHp,
                            alamat: user.alamat,
                            fotoProfil: user.fotoProfil,
                        },
                    },
                };
            } catch (error) {
                console.error("Login error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan server" };
            }
        },
        {
            body: t.Object({
                email: t.String({ format: "email" }),
                password: t.String({ minLength: 1 }),
            }),
        }
    )
    .get("/me", async ({ headers, jwt, set }) => {
        try {
            const authHeader = headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                set.status = 401;
                return { success: false, message: "Token tidak ditemukan" };
            }

            const token = authHeader.substring(7);
            const payload = await jwt.verify(token);

            if (!payload) {
                set.status = 401;
                return { success: false, message: "Token tidak valid" };
            }

            const user = await prisma.user.findUnique({
                where: { id: payload.userId as number },
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
            console.error("Get me error:", error);
            set.status = 500;
            return { success: false, message: "Terjadi kesalahan server" };
        }
    });
