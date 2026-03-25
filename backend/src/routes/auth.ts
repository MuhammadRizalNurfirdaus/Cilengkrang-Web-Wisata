import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import prisma from "../db";
import { hashPassword, verifyPassword } from "../utils/password";
import { RequestError } from "../utils/request";

const FRONTEND_URL = (process.env.FRONTEND_URL || "http://localhost:5174").replace(/\/$/, "");
const DEFAULT_FRONTEND_ORIGIN = new URL(FRONTEND_URL).origin;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_ALLOWED_ORIGINS = new Set(
    [
        DEFAULT_FRONTEND_ORIGIN,
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ].filter(Boolean)
);

interface GoogleTokenResponse {
    access_token?: string;
    error?: string;
    error_description?: string;
}

interface GoogleUserProfile {
    email?: string;
    name?: string;
    picture?: string;
}

function normalizeOrigin(origin?: string | null) {
    if (!origin) {
        return undefined;
    }

    try {
        return new URL(origin).origin;
    } catch {
        return undefined;
    }
}

function getGoogleRedirectUri(request: Request) {
    const requestOrigin = normalizeOrigin(request.headers.get("origin"));
    const allowedOrigin =
        requestOrigin && GOOGLE_ALLOWED_ORIGINS.has(requestOrigin) ? requestOrigin : DEFAULT_FRONTEND_ORIGIN;

    return `${allowedOrigin}/auth/google/callback`;
}

function assertGoogleOAuthConfigured() {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
        throw new RequestError("Google OAuth belum dikonfigurasi di server", 503);
    }
}

export const authRoutes = new Elysia({ prefix: "/auth" })
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET || "default-secret-key",
        })
    )
    // --- Google OAuth Endpoints ---
    .get("/google/url", ({ request, set }) => {
        try {
            assertGoogleOAuthConfigured();
            const redirectUri = getGoogleRedirectUri(request);

            const params = new URLSearchParams({
                client_id: GOOGLE_CLIENT_ID,
                redirect_uri: redirectUri,
                response_type: "code",
                scope: "openid email profile",
                access_type: "offline",
                prompt: "consent",
            });

            return {
                success: true,
                data: {
                    url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
                    redirectUri,
                },
            };
        } catch (error) {
            if (error instanceof RequestError) {
                set.status = error.status;
                return { success: false, message: error.message };
            }

            console.error("Google OAuth config error:", error);
            set.status = 500;
            return { success: false, message: "Terjadi kesalahan server" };
        }
    })
    .post(
        "/google/callback",
        async ({ body, jwt, request, set }) => {
            try {
                assertGoogleOAuthConfigured();
                const { code } = body;
                const redirectUri = getGoogleRedirectUri(request);

                const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        code,
                        client_id: GOOGLE_CLIENT_ID,
                        client_secret: GOOGLE_CLIENT_SECRET,
                        redirect_uri: redirectUri,
                        grant_type: "authorization_code",
                    }),
                });

                const tokenData = await tokenResponse.json() as GoogleTokenResponse;

                if (!tokenResponse.ok || tokenData.error || !tokenData.access_token) {
                    set.status = 400;
                    return {
                        success: false,
                        message: `Google OAuth error: ${tokenData.error_description || tokenData.error || "Token Google tidak valid"}`,
                    };
                }

                const userInfoResponse = await fetch(GOOGLE_USER_INFO_URL, {
                    headers: { Authorization: `Bearer ${tokenData.access_token}` },
                });

                const googleUser = await userInfoResponse.json() as GoogleUserProfile;

                if (!userInfoResponse.ok || !googleUser.email) {
                    set.status = 400;
                    return { success: false, message: "Tidak bisa mendapatkan email dari Google" };
                }

                const googleEmail = googleUser.email;
                const fallbackName = googleEmail.split("@")[0] || googleEmail;

                // Find or create user
                let user = await prisma.user.findUnique({
                    where: { email: googleEmail },
                });

                if (!user) {
                    // Create new user from Google data
                    const randomPassword = await hashPassword(crypto.randomUUID());
                    user = await prisma.user.create({
                        data: {
                            nama: googleUser.name || fallbackName,
                            email: googleEmail,
                            password: randomPassword,
                            fotoProfil: googleUser.picture || null,
                            role: "user",
                        },
                    });
                }

                // Generate JWT
                const token = await jwt.sign({
                    userId: user.id,
                    email: user.email,
                    role: user.role,
                });

                return {
                    success: true,
                    message: "Login Google berhasil",
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
                if (error instanceof RequestError) {
                    set.status = error.status;
                    return { success: false, message: error.message };
                }

                console.error("Google OAuth error:", error);
                set.status = 500;
                return { success: false, message: "Terjadi kesalahan saat login dengan Google" };
            }
        },
        {
            body: t.Object({
                code: t.String(),
            }),
        }
    )
    // --- Standard Auth Endpoints ---
    .post(
        "/register",
        async ({ body, jwt, set }) => {
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
                });

                const token = await jwt.sign({
                    userId: user.id,
                    email: user.email,
                    role: user.role,
                });

                return {
                    success: true,
                    message: "Registrasi berhasil",
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
                            createdAt: user.createdAt,
                        },
                    },
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
            let payload: Awaited<ReturnType<typeof jwt.verify>>;

            try {
                payload = await jwt.verify(token);
            } catch {
                set.status = 401;
                return { success: false, message: "Token tidak valid" };
            }

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
