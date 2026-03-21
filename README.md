# Cilengkrang Web Wisata

Aplikasi web fullstack untuk pengelolaan destinasi wisata Cilengkrang, pemesanan tiket, pengelolaan konten artikel, galeri, feedback, serta dashboard operasional multi-role (user, kasir, admin, owner).

## Ringkasan

Project ini merupakan modernisasi dari sistem PHP legacy ke stack TypeScript modern:

- Frontend: React + TypeScript + Vite
- Backend: Bun + Elysia
- ORM dan database: Prisma ORM + MariaDB
- Deployment lokal: Docker Compose

Repository ini juga menyimpan kode lama di folder `legacy_php/` sebagai referensi historis migrasi.

## Fitur Utama

- Landing page destinasi wisata
- Daftar dan detail destinasi wisata
- Daftar dan detail artikel
- Galeri foto wisata
- Form kontak
- Autentikasi JWT (register/login/me)
- Google OAuth login (opsional)
- Pemesanan tiket dengan detail item tiket
- Manajemen pembayaran
- Manajemen tiket dan jadwal ketersediaan
- Manajemen sewa alat
- Feedback/rating pengunjung
- Dashboard statistik admin dan user
- Panel manajemen user, wisata, artikel, galeri
- Upload file gambar (profil, artikel, galeri, wisata)
- Theme mode (light/dark) di frontend

## Arsitektur

### Komponen

- `frontend/`: aplikasi SPA React yang mengonsumsi API backend
- `backend/`: REST API Elysia dengan Prisma Client
- `database/`: SQL bootstrap tambahan
- `legacy_php/`: kode PHP lama yang tidak digunakan dalam runtime modern

### Topologi Docker Compose

Service default dari `docker-compose.yml`:

- `db`: MariaDB 10.11, host port `3307`
- `backend`: Bun + Elysia, host port `3002` (container `3001`)
- `frontend`: Vite app, host port `5174` (container `5173`)
- `adminer`: UI database, host port `8080`

## Tech Stack dan Versi

### Backend

- Bun `1.3.x`
- Elysia `^1.4.28`
- `@elysiajs/cors` `^1.4.1`
- `@elysiajs/jwt` `^1.4.1`
- `@elysiajs/static` `^1.4.7`
- Prisma `^7.5.0`
- `@prisma/client` `^7.5.0`
- `@prisma/adapter-mariadb` `^7.5.0`
- bcrypt `^6.0.0`

### Frontend

- React `^19.2.0`
- React DOM `^19.2.0`
- React Router DOM `^6.30.3`
- TypeScript `~5.9.3`
- Vite `^8.0.1`
- `@vitejs/plugin-react` `^6.0.1`
- ESLint `^9.39.4`

### Infrastruktur

- Docker + Docker Compose
- MariaDB 10.11
- Adminer

## Struktur Repository

```text
.
├── docker-compose.yml
├── README.md
├── package.json
├── test_e2e.sh
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── db.ts
│   │   ├── routes/
│   │   └── utils/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
├── database/
└── legacy_php/
```

## Environment Variables

Salin `.env.example` menjadi `.env` di root project.

```bash
cp .env.example .env
```

Daftar variabel utama:

### Database

- `MYSQL_ROOT_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`

### Backend

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`

### Google OAuth (opsional)

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `FRONTEND_URL`

### Frontend

- `VITE_API_URL`

Contoh default ada di `.env.example`.

## Cara Menjalankan

## 1. Menjalankan dengan Docker (direkomendasikan)

### Prasyarat

- Docker
- Docker Compose

### Langkah

```bash
# dari root repository
docker compose up -d --build
```

Verifikasi service:

```bash
docker compose ps
```

Akses aplikasi:

- Frontend: `http://localhost:5174`
- Backend API: `http://localhost:3002/api`
- Health check: `http://localhost:3002/api/health`
- Adminer: `http://localhost:8080`

### Inisialisasi Prisma (saat pertama kali)

```bash
# generate client
cd backend && bunx prisma generate

# push schema ke database
cd backend && bunx prisma db push

# seed data demo (opsional)
cd backend && bun run prisma/seed.ts
```

Catatan:

- Pada Prisma 7, URL datasource dikelola via `backend/prisma.config.ts`.
- Koneksi runtime Prisma menggunakan adapter MariaDB di `backend/src/db.ts`.

## 2. Menjalankan secara Lokal (tanpa Docker)

### Prasyarat

- Bun `>=1.3`
- Node.js `>=20.19` (disarankan untuk Vite 8)
- npm `>=10`
- MariaDB/MySQL aktif di lokal

### Langkah backend

```bash
cd backend
bun install
bunx prisma generate
bunx prisma db push
bun run prisma/seed.ts  # opsional
bun run dev
```

Backend default berjalan di `http://localhost:3001`.

### Langkah frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default berjalan di `http://localhost:5173`.

## NPM Scripts

### Root scripts (`package.json`)

- `npm run dev:backend` - jalankan backend dev
- `npm run dev:frontend` - jalankan frontend dev
- `npm run dev:all` - jalankan backend + frontend paralel
- `npm run docker:up` - start compose
- `npm run docker:down` - stop compose
- `npm run docker:logs` - follow logs compose
- `npm run prisma:generate` - prisma generate (backend)
- `npm run prisma:push` - prisma db push (backend)
- `npm run prisma:studio` - prisma studio (backend)
- `npm run setup` - docker up + prisma generate + prisma push
- `npm run build:frontend` - build frontend production

### Backend scripts (`backend/package.json`)

- `bun run dev`
- `bun run start`
- `bun run db:push`
- `bun run db:generate`
- `bun run db:studio`
- `bun run db:seed`

### Frontend scripts (`frontend/package.json`)

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

## API Reference

Semua route backend digabung di prefix `/api` dari `backend/src/index.ts`.

### Health

- `GET /api/health`

### Auth (`/api/auth`)

- `GET /google/url`
- `POST /google/callback`
- `POST /register`
- `POST /login`
- `GET /me`

### Users (`/api/users`)

- `GET /`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`
- `POST /:id/photo`

### Wisata (`/api/wisata`)

- `GET /`
- `GET /popular`
- `GET /slug/:slug`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

### Articles (`/api/articles`)

- `GET /`
- `GET /latest`
- `GET /slug/:slug`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

### Galeri (`/api/galeri`)

- `GET /`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

### Contacts (`/api/contacts`)

- `GET /`
- `GET /:id`
- `POST /`
- `DELETE /:id`

### Feedback (`/api/feedback`)

- `GET /`
- `POST /`
- `DELETE /:id`

### Jenis Tiket (`/api/jenis-tiket`)

- `GET /`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

### Jadwal (`/api/jadwal`)

- `GET /`
- `GET /:id`
- `PUT /:id/availability`

### Pemesanan (`/api/pemesanan`)

- `GET /`
- `GET /user/:userId`
- `GET /:id`
- `GET /kode/:kode`
- `POST /`
- `PUT /:id/status`
- `DELETE /:id`

### Pembayaran (`/api/pembayaran`)

- `GET /`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

### Sewa Alat (`/api/sewa-alat`)

- `GET /`
- `GET /available`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

### Stats (`/api/stats`)

- `GET /admin`
- `GET /user/:userId`

## Database Model

Prisma schema berada di `backend/prisma/schema.prisma`.

### Models

- `User`
- `Article`
- `Contact`
- `Feedback`
- `Galeri`
- `Wisata`
- `JenisTiket`
- `JadwalKetersediaanTiket`
- `PemesananTiket`
- `DetailPemesananTiket`
- `Pembayaran`
- `SewaAlat`
- `PemesananSewaAlat`
- `PengaturanSitus`
- `Aktivitas`

### Enums

- `TipeHari`
- `StatusPemesanan`
- `StatusPembayaran`
- `SatuanDurasi`
- `KondisiAlat`
- `StatusItemSewa`

## Seed Data Demo

File seed: `backend/prisma/seed.ts`.

Akun yang dibuat oleh seed:

- Admin: `admin12345@gmail.com` / `password123`
- Kasir: `kasir12345@gmail.com` / `password123`
- Owner: `owner@cilengkrang.com` / `password123`
- User: `user@cilengkrang.com` / `password123`

Selain user, seed juga menambahkan:

- Data wisata contoh
- Jenis tiket contoh
- Artikel contoh
- Data sewa alat contoh
- Pengaturan situs

## Validasi Kualitas Kode

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

### Backend

```bash
cd backend
bunx prisma generate
bunx tsc --noEmit -p tsconfig.json
```

### E2E helper (opsional)

```bash
./test_e2e.sh
```

## Troubleshooting

### 1. Backend tidak bisa konek database

- Pastikan `DATABASE_URL` benar
- Jika Docker dipakai, hostname DB adalah `db` (bukan `localhost`)
- Cek status database dengan `docker compose ps`

### 2. Prisma error setelah upgrade

Pastikan konfigurasi Prisma 7 terpenuhi:

- URL datasource di `backend/prisma.config.ts`
- `schema.prisma` datasource tanpa `url`
- Runtime PrismaClient menggunakan `@prisma/adapter-mariadb`

Lalu regenerate:

```bash
cd backend
bunx prisma generate
```

### 3. Frontend tidak memanggil API yang benar

- Pastikan `VITE_API_URL` diarahkan ke backend aktif
- Untuk Docker default: `http://localhost:3002/api`
- Untuk lokal langsung backend: `http://localhost:3001/api`

### 4. Port bentrok

Ubah port mapping di `docker-compose.yml` atau hentikan service yang memakai port tersebut.

### 5. OAuth Google gagal

Periksa nilai:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `FRONTEND_URL`

Lalu cocokkan dengan konfigurasi OAuth app di Google Cloud Console.

## Keamanan

- Jangan commit `.env` ke repository
- Gunakan `JWT_SECRET` yang kuat di environment production
- Rotasi secret/API key jika sempat terekspos
- Batasi akses endpoint manajemen role di level middleware/authz saat hardening production

## Catatan Migrasi

- Kode lama tersimpan di `legacy_php/`
- Aplikasi aktif saat ini adalah stack TypeScript (`frontend/` + `backend/`)
- Riwayat perbaikan modernisasi tambahan dapat dilihat di `IMPROVEMENTS_REPORT.md`

## Roadmap Singkat

- Penambahan test otomatis backend (unit/integration)
- Penguatan authorization berbasis role di backend middleware
- Penambahan OpenAPI/Swagger docs
- CI pipeline lint/build/test

## Kontribusi

1. Fork repository
2. Buat branch fitur: `feature/nama-fitur`
3. Commit dengan pesan yang jelas
4. Buka Pull Request

Saran format commit:

- `feat:` fitur baru
- `fix:` perbaikan bug
- `docs:` perubahan dokumentasi
- `refactor:` perbaikan struktur kode
- `chore:` perubahan tooling/dependency

## Lisensi

MIT License. Lihat file `LICENSE`.

## Author

Muhammad Rizal Nurfirdaus
