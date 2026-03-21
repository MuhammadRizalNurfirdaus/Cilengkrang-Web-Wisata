import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl) {
	throw new Error("DATABASE_URL is not defined");
}

const parsedUrl = new URL(databaseUrl);

const adapter = new PrismaMariaDb({
	host: parsedUrl.hostname,
	port: parsedUrl.port ? Number(parsedUrl.port) : 3306,
	user: decodeURIComponent(parsedUrl.username),
	password: decodeURIComponent(parsedUrl.password),
	database: parsedUrl.pathname.replace(/^\//, ""),
	connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
