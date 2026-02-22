# 🏔️ Cilengkrang Web Wisata

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-1.0-fbf0df?logo=bun&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?logo=docker&logoColor=white)

**Aplikasi Web Wisata Lembah Cilengkrang** — Platform digital untuk pengelolaan dan pemesanan tiket wisata alam Cilengkrang, Bandung, Jawa Barat.

[Demo](#-akses-aplikasi) · [Instalasi](#-instalasi--setup) · [API Docs](#-api-endpoints) · [Kontribusi](#-kontribusi)

</div>

---

## 📖 Tentang Project

**Cilengkrang Web Wisata** adalah aplikasi web fullstack untuk mengelola objek wisata Lembah Cilengkrang. Aplikasi ini awalnya dikembangkan menggunakan PHP Native dan telah di-**migrasi secara penuh** ke stack modern berbasis **TypeScript** dengan arsitektur yang lebih scalable dan maintainable.

### Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🏠 **Landing Page** | Halaman beranda dengan hero video, destinasi populer, artikel, testimonial |
| 🗺️ **Destinasi Wisata** | Daftar & detail destinasi lengkap dengan galeri foto, fasilitas, jam operasi, lokasi |
| 🎫 **Pemesanan Tiket** | Sistem booking tiket wisata dengan pilihan jenis tiket (hari kerja/libur) |
| 📰 **Artikel & Berita** | CMS untuk artikel wisata dengan editor konten, share ke sosial media |
| 🖼️ **Galeri Foto** | Koleksi foto wisata dengan lightbox viewer & pagination |
| 📞 **Kontak** | Form kontak dengan validasi, link WhatsApp, email, Google Maps |
| ⭐ **Feedback & Rating** | Sistem ulasan dan rating dari pengunjung |
| 🔐 **Multi-Role Auth** | Autentikasi JWT dengan 4 role: User, Kasir, Admin, Owner |
| 🔑 **Google OAuth** | Login cepat menggunakan akun Google |
| 📊 **Dashboard Admin** | Statistik real-time, pesanan terkini, grafik pendapatan |
| 📊 **Dashboard User** | Ringkasan tiket aktif, riwayat pesanan, menu navigasi cepat |
| 📜 **Riwayat & Cetak Tiket** | Riwayat pemesanan dengan status tracking & pembatalan |
| 👤 **Profil Pengguna** | Edit profil, upload foto, ubah password |
| 🏷️ **Manajemen Tiket** | CRUD jenis tiket, jadwal ketersediaan, harga dinamis |
| 🏕️ **Sewa Alat** | Sistem sewa alat camping/outdoor dengan tracking status |
| 💳 **Pembayaran** | Tracking status pembayaran dengan multi metode |
| 🌙 **Dark / Light Mode** | Toggle tema gelap/terang dengan animasi, persistent di localStorage |
| 📱 **Responsive Design** | Tampilan optimal di desktop, tablet, dan mobile |

---

## 🛠️ Tech Stack

### Backend
| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| [Bun](https://bun.sh/) | 1.0+ | JavaScript runtime & package manager (pengganti Node.js) |
| [ElysiaJS](https://elysiajs.com/) | 1.4 | Framework web TypeScript yang cepat untuk Bun |
| [Prisma](https://www.prisma.io/) | 6.x | ORM modern untuk TypeScript/JavaScript |
| [MariaDB](https://mariadb.org/) | 10.11 | Database relasional (MySQL-compatible) |
| [JWT](https://jwt.io/) | - | Autentikasi berbasis token |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | 6.x | Hashing password |

### Frontend
| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| [React](https://react.dev/) | 19 | UI library utama |
| [Vite](https://vitejs.dev/) | 7.2 | Build tool & dev server |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Type safety |
| [React Router](https://reactrouter.com/) | 6.30 | Client-side routing (SPA) |
| [Bootstrap 5](https://getbootstrap.com/) | 5.3 | CSS framework |
| [Font Awesome](https://fontawesome.com/) | 6.4 | Icon library |

### DevOps
| Teknologi | Deskripsi |
|-----------|-----------|
| [Docker](https://www.docker.com/) | Containerization |
| [Docker Compose](https://docs.docker.com/compose/) | Multi-container orchestration |
| [Adminer](https://www.adminer.org/) | Database admin UI |

---

## 📂 Struktur Project

```
Cilengkrang-Web-Wisata/
├── 📄 docker-compose.yml        # Konfigurasi Docker (4 services)
├── 📄 .env.example              # Template environment variables
├── 📄 package.json              # Root package (scripts orchestrator)
│
├── 📁 backend/                  # ⚙️ API Server (Bun + ElysiaJS)
│   ├── Dockerfile               # Container image backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema (15 model, 6 enum)
│   │   └── seed.ts              # Seed data awal
│   ├── src/
│   │   ├── index.ts             # Entry point server
│   │   ├── db.ts                # Prisma client instance
│   │   ├── middleware/          # (Reserved untuk middleware)
│   │   ├── routes/              # API route handlers
│   │   │   ├── auth.ts          # Login, register, Google OAuth
│   │   │   ├── wisata.ts        # CRUD destinasi wisata
│   │   │   ├── articles.ts      # CRUD artikel
│   │   │   ├── galeri.ts        # CRUD galeri foto
│   │   │   ├── pemesanan.ts     # Pemesanan tiket
│   │   │   ├── jenisTiket.ts    # Jenis tiket & harga
│   │   │   ├── jadwal.ts        # Jadwal ketersediaan tiket
│   │   │   ├── pembayaran.ts    # Pembayaran
│   │   │   ├── sewaAlat.ts      # Sewa alat outdoor
│   │   │   ├── feedback.ts      # Feedback & rating
│   │   │   ├── contacts.ts      # Pesan kontak
│   │   │   ├── users.ts         # Manajemen user
│   │   │   └── stats.ts         # Dashboard statistik
│   │   └── utils/               # Helper functions
│   └── uploads/                 # File upload storage
│       ├── articles/
│       ├── artikel/
│       ├── galeri/
│       ├── profil/
│       └── wisata/
│
├── 📁 frontend/                 # 🎨 Client App (React + Vite)
│   ├── Dockerfile               # Container image frontend
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html               # SPA entry point
│   ├── public/                  # Static assets
│   │   └── img/
│   └── src/
│       ├── main.tsx             # React app bootstrap
│       ├── App.tsx              # Root component & routing
│       ├── api/
│       │   └── client.ts        # HTTP API client (fetch wrapper)
│       ├── context/
│       │   ├── AuthContext.tsx   # Authentication state
│       │   └── ThemeContext.tsx  # Dark/Light mode state
│       ├── hooks/
│       │   └── useFetch.ts      # Custom data fetching hook
│       ├── components/
│       │   ├── ErrorBoundary.tsx     # Error boundary global
│       │   ├── layout/
│       │   │   ├── Navbar.tsx       # Navbar publik (theme-aware)
│       │   │   ├── Footer.tsx       # Footer dengan links
│       │   │   └── AdminLayout.tsx  # Sidebar admin panel
│       │   ├── sections/
│       │   │   ├── HeroVideo.tsx    # Hero section dengan video
│       │   │   ├── Destinations.tsx # Destinasi populer
│       │   │   ├── Features.tsx     # Fitur unggulan
│       │   │   ├── Articles.tsx     # Artikel terbaru
│       │   │   └── Testimonials.tsx # Testimonial pengunjung
│       │   └── ui/
│       │       ├── Alert.tsx        # Alert notification
│       │       ├── Button.tsx       # Reusable button
│       │       ├── Card.tsx         # Reusable card
│       │       ├── Input.tsx        # Form input
│       │       ├── ThemeToggle.css  # Animasi tombol tema
│       │       └── ThemeToggleButton.tsx # Tombol dark/light mode
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── Login.tsx        # Halaman login
│       │   │   ├── Register.tsx     # Halaman registrasi
│       │   │   ├── Logout.tsx       # Proses logout
│       │   │   └── GoogleCallback.tsx # Google OAuth callback
│       │   ├── public/
│       │   │   ├── Home.tsx             # Beranda
│       │   │   ├── AllDestinations.tsx  # Semua destinasi
│       │   │   ├── DestinationDetail.tsx # Detail destinasi
│       │   │   ├── ArticleList.tsx      # Daftar artikel
│       │   │   ├── ArticleDetail.tsx    # Detail artikel
│       │   │   ├── Gallery.tsx          # Galeri foto
│       │   │   └── Contact.tsx          # Halaman kontak
│       │   ├── user/
│       │   │   ├── UserDashboard.tsx     # Dashboard user
│       │   │   ├── Booking.tsx          # Form pemesanan tiket
│       │   │   ├── History.tsx          # Riwayat pemesanan
│       │   │   └── Profile.tsx          # Profil pengguna
│       │   └── admin/
│       │       ├── AdminDashboard.tsx    # Dashboard admin
│       │       ├── wisata/              # CRUD wisata
│       │       ├── articles/            # CRUD artikel
│       │       ├── tickets/             # Kelola tiket
│       │       └── users/               # Kelola user
│       ├── types/                   # TypeScript type definitions
│       └── assets/
│           └── css/
│               └── style.css        # Stylesheet utama + dark mode
│
├── 📁 legacy_php/               # 📜 Kode PHP lama (referensi)
│   ├── admin/                   # Panel admin PHP
│   ├── controllers/             # PHP controllers
│   ├── models/                  # PHP models
│   ├── config/                  # Konfigurasi database PHP
│   └── database/                # SQL dump asli
│
└── 📁 database/                 # Database scripts
```

---

## 🚀 Instalasi & Setup

### Prasyarat

Pastikan software berikut sudah terinstal di komputer Anda:

| Software | Versi Minimum | Link Download |
|----------|---------------|---------------|
| **Git** | 2.x | [git-scm.com](https://git-scm.com/) |
| **Docker** | 20.x | [docker.com](https://www.docker.com/get-started) |
| **Docker Compose** | 2.x | (Sudah termasuk di Docker Desktop) |

> **💡 Tips:** Jika Anda menggunakan Docker Desktop (Windows/Mac), Docker Compose sudah otomatis terinstal.

---

### Langkah 1: Clone Repository

```bash
# Clone project dari GitHub
git clone https://github.com/MuhammadRizalNurfirdaus/Cilengkrang-Web-Wisata.git

# Masuk ke direktori project
cd Cilengkrang-Web-Wisata
```

---

### Langkah 2: Konfigurasi Environment

```bash
# Salin file environment template
cp .env.example .env
```

Buka file `.env` dan sesuaikan konfigurasi:

```env
# ============================
# DATABASE
# ============================
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=cilengkrang_web_wisata_ts
MYSQL_USER=user
MYSQL_PASSWORD=password

# ============================
# BACKEND
# ============================
DATABASE_URL=mysql://user:password@db:3306/cilengkrang_web_wisata_ts
JWT_SECRET=ganti-dengan-secret-key-anda-yang-kuat
PORT=3001

# ============================
# GOOGLE OAUTH (Opsional)
# ============================
# Dapatkan credentials di: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5174/auth/google/callback
FRONTEND_URL=http://localhost:5174

# ============================
# FRONTEND
# ============================
VITE_API_URL=http://localhost:3002/api
```

> **⚠️ Penting:**
> - Ganti `JWT_SECRET` dengan string acak yang kuat untuk keamanan.
> - Google OAuth bersifat opsional. Login email/password tetap berfungsi tanpa konfigurasi Google.
> - `DATABASE_URL` harus menggunakan hostname `db` (bukan `localhost`) karena berjalan di dalam Docker network.

---

### Langkah 3: Jalankan dengan Docker

```bash
# Build dan jalankan semua containers (database, backend, frontend, adminer)
docker compose up -d --build

# Tunggu semua container ready (±30 detik)
docker compose ps
```

Output yang diharapkan:

```
NAME                   STATUS              PORTS
cilengkrang_db         running (healthy)   0.0.0.0:3307->3306/tcp
cilengkrang_backend    running             0.0.0.0:3002->3001/tcp
cilengkrang_frontend   running             0.0.0.0:5174->5173/tcp
cilengkrang_adminer    running             0.0.0.0:8080->8080/tcp
```

---

### Langkah 4: Setup Database (Push Schema & Seed)

```bash
# Masuk ke container backend
docker exec -it cilengkrang_backend sh

# Di dalam container, push Prisma schema ke database
bun prisma db push

# (Opsional) Isi data awal (destinasi, tiket, user demo)
bun prisma db seed

# Keluar dari container
exit
```

> **📌 Catatan:** Perintah `bun prisma db seed` akan membuat akun demo berikut:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin12345@gmail.com` | `password123` |
| **Kasir** | `kasir12345@gmail.com` | `password123` |
| **Owner** | `owner@cilengkrang.com` | `password123` |
| **User** | `user@cilengkrang.com` | `password123` |

---

### Langkah 5: Akses Aplikasi! 🎉

| Service | URL | Keterangan |
|---------|-----|------------|
| 🌐 **Frontend** | [http://localhost:5174](http://localhost:5174) | Website utama |
| ⚙️ **Backend API** | [http://localhost:3002/api](http://localhost:3002/api) | REST API |
| 🏥 **Health Check** | [http://localhost:3002/api/health](http://localhost:3002/api/health) | Status server |
| 🗄️ **Adminer** | [http://localhost:8080](http://localhost:8080) | Database admin UI |

**Login Adminer:**
- System: `MySQL`
- Server: `db`
- Username: `user`
- Password: `password`
- Database: `cilengkrang_web_wisata_ts`

---

## 💻 Development (Tanpa Docker)

Jika ingin menjalankan tanpa Docker, pastikan terinstal:
- [Bun](https://bun.sh/) v1.0+ (backend)
- [Node.js](https://nodejs.org/) v20+ (frontend)
- [MariaDB](https://mariadb.org/) atau [MySQL](https://www.mysql.com/) 8.0+ (database)

```bash
# 1. Setup database — Buat database MySQL/MariaDB bernama 'cilengkrang_web_wisata_ts'

# 2. Update DATABASE_URL di .env ke koneksi lokal:
#    DATABASE_URL=mysql://root:password@localhost:3306/cilengkrang_web_wisata_ts

# 3. Setup Backend
cd backend
bun install
bun prisma generate
bun prisma db push
bun prisma db seed     # Opsional: data demo
cd ..

# 4. Setup Frontend
cd frontend
npm install
cd ..

# 5. Jalankan (dari root directory)
npm install            # Install concurrently
npm run dev:all        # Jalankan backend + frontend bersamaan
```

Akses di:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001/api`

---

## 📡 API Endpoints

### 🔓 Public (Tanpa Login)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/health` | Health check status server |
| `GET` | `/api/wisata` | Daftar semua destinasi wisata |
| `GET` | `/api/wisata/:id` | Detail destinasi by ID |
| `GET` | `/api/wisata/slug/:slug` | Detail destinasi by slug |
| `GET` | `/api/artikel` | Daftar artikel/berita |
| `GET` | `/api/artikel/:id` | Detail artikel by ID |
| `GET` | `/api/artikel/slug/:slug` | Detail artikel by slug |
| `GET` | `/api/galeri` | Galeri foto (dengan pagination) |
| `GET` | `/api/feedback` | Daftar feedback/testimonial |
| `GET` | `/api/jenis-tiket` | Daftar jenis tiket & harga |
| `POST` | `/api/contacts` | Kirim pesan kontak |

### 🔑 Autentikasi

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/auth/register` | Registrasi akun baru |
| `POST` | `/api/auth/login` | Login (email + password) |
| `GET` | `/api/auth/me` | Profil user yang sedang login |
| `GET` | `/api/auth/google` | Redirect ke Google OAuth |
| `GET` | `/api/auth/google/callback` | Callback Google OAuth |

### 👤 User (Login Required)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `PUT` | `/api/users/:id` | Update profil user |
| `PUT` | `/api/users/:id/password` | Ubah password |
| `POST` | `/api/users/:id/foto` | Upload foto profil |
| `GET` | `/api/pemesanan` | Riwayat pemesanan user |
| `POST` | `/api/pemesanan` | Buat pemesanan tiket baru |
| `PUT` | `/api/pemesanan/:id/cancel` | Batalkan pemesanan |
| `GET` | `/api/stats/user/:userId` | Statistik dashboard user |
| `POST` | `/api/feedback` | Kirim feedback/rating |

### 🛡️ Admin / Kasir / Owner

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/stats/admin` | Statistik dashboard admin |
| `POST` | `/api/wisata` | Tambah destinasi baru |
| `PUT` | `/api/wisata/:id` | Update destinasi |
| `DELETE` | `/api/wisata/:id` | Hapus destinasi |
| `POST` | `/api/artikel` | Tambah artikel baru |
| `PUT` | `/api/artikel/:id` | Update artikel |
| `DELETE` | `/api/artikel/:id` | Hapus artikel |
| `POST` | `/api/galeri` | Upload foto galeri |
| `DELETE` | `/api/galeri/:id` | Hapus foto galeri |
| `GET` | `/api/users` | Daftar semua user |
| `PUT` | `/api/users/:id/role` | Ubah role user |
| `DELETE` | `/api/users/:id` | Hapus user |
| `POST` | `/api/jenis-tiket` | Tambah jenis tiket |
| `PUT` | `/api/jenis-tiket/:id` | Update jenis tiket |
| `DELETE` | `/api/jenis-tiket/:id` | Hapus jenis tiket |
| `GET` | `/api/jadwal` | Daftar jadwal ketersediaan |
| `POST` | `/api/jadwal` | Buat jadwal ketersediaan |
| `GET` | `/api/pembayaran` | Daftar pembayaran |
| `PUT` | `/api/pembayaran/:id` | Update status pembayaran |
| `GET` | `/api/sewa-alat` | Daftar alat sewa |
| `POST` | `/api/sewa-alat` | Tambah alat sewa |

---

## 🗃️ Database Schema

### Model & Relasi

```
┌──────────────┐    ┌─────────────────┐    ┌────────────────────┐
│     User     │───▶│ PemesananTiket  │───▶│DetailPemesananTiket│
│              │    │                 │    │                    │
│ - nama       │    │ - kodePemesanan │    │ - jumlah           │
│ - email      │    │ - tanggalKunj.  │    │ - hargaSatuan      │
│ - password   │    │ - totalHarga    │    │ - subtotalItem     │
│ - role       │    │ - status        │    └────────────────────┘
│ - fotoProfil │    └─────┬───────────┘              │
└──────────────┘          │                          ▼
       │            ┌─────┴──────┐          ┌──────────────┐
       │            │ Pembayaran │          │  JenisTiket  │
       ▼            │            │          │              │
┌──────────────┐    │ - metode   │          │ - namaDisplay│
│   Feedback   │    │ - jumlah   │          │ - tipeHari   │
│              │    │ - status   │          │ - harga      │
│ - rating     │    │ - bukti    │          └──────────────┘
│ - komentar   │    └────────────┘                 │
└──────────────┘                                   ▼
                    ┌──────────────────────────────────────┐
┌──────────────┐    │     JadwalKetersediaanTiket          │
│    Wisata    │    │                                      │
│              │    │ - tanggal                             │
│ - nama       │    │ - jumlahTotalTersedia                │
│ - deskripsi  │    │ - jumlahSaatIniTersedia              │
│ - gambar     │    └──────────────────────────────────────┘
│ - lokasi     │
│ - fasilitas  │    ┌──────────────┐    ┌───────────────────┐
│ - jamOperasi │    │   SewaAlat   │───▶│ PemesananSewaAlat │
└──────────────┘    │              │    │                   │
       │            │ - namaItem   │    │ - jumlah          │
       ▼            │ - hargaSewa  │    │ - tanggalMulai    │
┌──────────────┐    │ - stok       │    │ - totalHarga      │
│    Galeri    │    │ - kondisi    │    │ - statusSewa      │
│              │    └──────────────┘    └───────────────────┘
│ - namaFile   │
│ - keterangan │    ┌──────────────┐    ┌───────────────────┐
└──────────────┘    │   Article    │    │  PengaturanSitus  │
                    │              │    │                   │
┌──────────────┐    │ - judul      │    │ - key             │
│   Contact    │    │ - isi        │    │ - value           │
│              │    │ - ringkasan  │    └───────────────────┘
│ - nama       │    │ - gambar     │
│ - email      │    │ - published  │    ┌───────────────────┐
│ - subjek     │    └──────────────┘    │    Aktivitas      │
│ - pesan      │                        │                   │
└──────────────┘                        │ - aksi            │
                                        │ - detail          │
                                        │ - ipAddress       │
                                        └───────────────────┘
```

### Enum (Status)

| Enum | Values |
|------|--------|
| `StatusPemesanan` | PENDING, WAITING_PAYMENT, PAID, CONFIRMED, COMPLETED, CANCELLED, EXPIRED |
| `StatusPembayaran` | PENDING, SUCCESS, FAILED, EXPIRED, REFUNDED, AWAITING_CONFIRMATION |
| `TipeHari` | HARI_KERJA, HARI_LIBUR, SEMUA_HARI |
| `SatuanDurasi` | JAM, HARI, PEMINJAMAN |
| `KondisiAlat` | BAIK, RUSAK_RINGAN, PERLU_PERBAIKAN, HILANG |
| `StatusItemSewa` | DIPESAN, DIAMBIL, DIKEMBALIKAN, HILANG, RUSAK, DIBATALKAN |

---

## 🎨 Fitur Dark Mode

Aplikasi mendukung **tema gelap dan terang** yang dapat ditoggle dengan tombol mengambang di pojok kanan bawah.

- **Persistent** — Preferensi tema disimpan di `localStorage`
- **System-aware** — Otomatis mengikuti preferensi sistem operasi saat pertama kali
- **Smooth transition** — Animasi halus saat berganti tema
- **Full coverage** — Semua komponen (navbar, card, form, tabel, modal, sidebar admin) sudah di-support
- **Animated button** — Tombol FAB dengan ikon matahari/bulan animasi SVG

---

## 📸 Halaman Aplikasi

| Halaman | Route | Deskripsi |
|---------|-------|-----------|
| Beranda | `/` | Hero video, destinasi populer, fitur, artikel, testimonial |
| Destinasi | `/destinations` | Semua destinasi wisata dengan pagination |
| Detail Destinasi | `/destinations/:id` | Detail destinasi, tiket, galeri, peta |
| Artikel | `/articles` | Daftar semua artikel |
| Detail Artikel | `/articles/:id` | Detail artikel dengan share social media |
| Galeri | `/gallery` | Galeri foto wisata |
| Kontak | `/contact` | Form kontak dan info lokasi |
| Login | `/login` | Login (email/password + Google OAuth) |
| Registrasi | `/register` | Registrasi akun baru |
| Google Callback | `/auth/google/callback` | Callback Google OAuth |
| Dashboard User | `/user/dashboard` | Statistik, menu navigasi cepat |
| Pemesanan | `/booking` | Form pemesanan tiket wisata |
| Riwayat | `/user/history` | Riwayat pemesanan + cancel |
| Profil User | `/user/profile` | Edit profil, foto, password |
| Dashboard Admin | `/admin/dashboard` | 10 metrik, pesanan terkini, quick menu |
| Kelola Wisata | `/admin/wisata` | CRUD destinasi wisata |
| Tambah Wisata | `/admin/wisata/create` | Form tambah destinasi |
| Edit Wisata | `/admin/wisata/edit/:id` | Form edit destinasi |
| Kelola Artikel | `/admin/articles` | CRUD artikel |
| Tambah Artikel | `/admin/articles/create` | Form tambah artikel |
| Edit Artikel | `/admin/articles/edit/:id` | Form edit artikel |
| Kelola Tiket | `/admin/tickets` | Kelola jenis tiket |
| Kelola User | `/admin/users` | Kelola user & role |
| Kelola Galeri | `/admin/galeri` | Manajemen galeri foto |
| Kelola Feedback | `/admin/feedback` | Manajemen feedback |
| Profil Admin | `/admin/profile` | Edit profil admin |
| Dashboard Kasir | `/kasir/dashboard` | Dashboard kasir |
| Pemesanan Kasir | `/kasir/pemesanan` | Kelola pemesanan tiket |
| Pembayaran Kasir | `/kasir/pembayaran` | Kelola pembayaran |
| Profil Kasir | `/kasir/profile` | Edit profil kasir |
| Dashboard Owner | `/owner/dashboard` | Dashboard owner |
| Laporan Owner | `/owner/laporan` | Laporan & analytics |
| Profil Owner | `/owner/profile` | Edit profil owner |

---

## 🔐 Sistem Role & Akses

| Fitur | User | Kasir | Admin | Owner |
|-------|:----:|:-----:|:-----:|:-----:|
| Lihat destinasi & artikel | ✅ | ✅ | ✅ | ✅ |
| Pesan tiket | ✅ | ✅ | ✅ | ✅ |
| Dashboard user | ✅ | ✅ | ✅ | ✅ |
| Edit profil | ✅ | ✅ | ✅ | ✅ |
| Dashboard kasir | ❌ | ✅ | ❌ | ❌ |
| Kelola pemesanan & pembayaran | ❌ | ✅ | ✅ | ✅ |
| Dashboard admin | ❌ | ❌ | ✅ | ✅ |
| Kelola wisata | ❌ | ❌ | ✅ | ✅ |
| Kelola artikel | ❌ | ❌ | ✅ | ✅ |
| Kelola tiket | ❌ | ✅ | ✅ | ✅ |
| Kelola user | ❌ | ❌ | ✅ | ✅ |
| Kelola galeri & feedback | ❌ | ❌ | ✅ | ✅ |
| Dashboard owner & laporan | ❌ | ❌ | ❌ | ✅ |

---

## 🔧 Perintah Berguna

### Docker

```bash
docker compose up -d --build   # Build & start semua containers
docker compose down            # Stop semua containers
docker compose ps              # Lihat status containers
docker compose logs -f         # Lihat logs semua services
docker compose logs backend    # Lihat logs backend saja
docker compose restart backend # Restart backend
```

### Prisma (di dalam container backend)

```bash
docker exec -it cilengkrang_backend sh   # Masuk ke container

bun prisma studio              # Buka Prisma Studio (GUI database)
bun prisma db push             # Sinkronisasi schema ke database
bun prisma generate            # Generate Prisma Client
bun prisma db seed             # Jalankan seed data
```

### Development

```bash
npm run dev:all                # Jalankan backend + frontend (tanpa Docker)
npm run dev:backend            # Jalankan backend saja
npm run dev:frontend           # Jalankan frontend saja
npm run build:frontend         # Build production frontend
```

---

## 🐛 Troubleshooting

### Container tidak mau start?

```bash
# Lihat error logs
docker compose logs backend --tail 50

# Restart semua
docker compose down && docker compose up -d --build
```

### Database error / tabel tidak ditemukan?

```bash
# Re-push schema
docker exec -it cilengkrang_backend sh -c "bun prisma db push"
```

### Port sudah digunakan?

```bash
# Cek port yang digunakan
lsof -i :3002   # Backend
lsof -i :5174   # Frontend
lsof -i :3307   # Database

# Atau ubah port mapping di docker-compose.yml
```

### Frontend blank putih / error?

```bash
# Cek console browser (F12)
# Pastikan VITE_API_URL di .env benar:
# VITE_API_URL=http://localhost:3002/api

# Rebuild frontend
docker compose up -d --build frontend
```

### Google OAuth tidak bekerja?

1. Pastikan credentials sudah dikonfigurasi di [Google Cloud Console](https://console.cloud.google.com/)
2. Tambahkan `http://localhost:5174` ke **Authorized JavaScript origins**
3. Tambahkan `http://localhost:3002/api/auth/google/callback` ke **Authorized redirect URIs**
4. Update `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` di `.env`

---

## 🤝 Kontribusi

Kontribusi selalu diterima! Berikut cara berkontribusi:

```bash
# 1. Fork repository ini

# 2. Clone fork Anda
git clone https://github.com/<username-anda>/Cilengkrang-Web-Wisata.git
cd Cilengkrang-Web-Wisata

# 3. Buat branch baru
git checkout -b feature/fitur-baru

# 4. Lakukan perubahan & commit
git add .
git commit -m "feat: tambah fitur baru"

# 5. Push ke fork Anda
git push origin feature/fitur-baru

# 6. Buat Pull Request di GitHub
```

### Konvensi Commit

```
feat:     fitur baru
fix:      perbaikan bug
docs:     perubahan dokumentasi
style:    format kode (tanpa perubahan logic)
refactor: refactoring kode
test:     menambah/memperbaiki test
chore:    maintenance (update deps, config, dll)
```

---

## 📄 Lisensi

Didistribusikan di bawah **MIT License**. Lihat file `LICENSE` untuk informasi lebih lanjut.

---

## 👨‍💻 Pengembang

**Muhammad Rizal Nurfirdaus**

*Proyek ini merupakan modernisasi dari aplikasi PHP legacy ke TypeScript fullstack sebagai bagian dari pembelajaran dan pengembangan web modern.*

---

<div align="center">

**⭐ Jika project ini bermanfaat, berikan bintang di GitHub! ⭐**

</div>
