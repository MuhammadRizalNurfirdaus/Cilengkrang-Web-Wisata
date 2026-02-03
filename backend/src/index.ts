import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import "dotenv/config";

import { authRoutes } from "./routes/auth";
import { usersRoutes } from "./routes/users";
import { articlesRoutes } from "./routes/articles";
import { wisataRoutes } from "./routes/wisata";
import { galeriRoutes } from "./routes/galeri";
import { feedbackRoutes } from "./routes/feedback";
import { contactsRoutes } from "./routes/contacts";
import { jenisTiketRoutes } from "./routes/jenisTiket";
import { pemesananRoutes } from "./routes/pemesanan";
import { pembayaranRoutes } from "./routes/pembayaran";
import { sewaAlatRoutes } from "./routes/sewaAlat";

const app = new Elysia()
    .use(
        cors({
            origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
            credentials: true,
        })
    )
    .use(
        staticPlugin({
            assets: "uploads",
            prefix: "/uploads",
        })
    )
    // Health check
    .get("/api/health", () => ({
        status: "ok",
        timestamp: new Date().toISOString(),
    }))
    // API routes
    .group("/api", (app) =>
        app
            .use(authRoutes)
            .use(usersRoutes)
            .use(articlesRoutes)
            .use(wisataRoutes)
            .use(galeriRoutes)
            .use(feedbackRoutes)
            .use(contactsRoutes)
            .use(jenisTiketRoutes)
            .use(pemesananRoutes)
            .use(pembayaranRoutes)
            .use(sewaAlatRoutes)
    )
    // Error handler
    .onError(({ code, error }) => {
        console.error(`Error [${code}]:`, error);
        return {
            success: false,
            message: error.message || "Terjadi kesalahan server",
        };
    })
    .listen(process.env.PORT || 3001);

console.log(
    `🦊 Elysia server running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
