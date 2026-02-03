# Cilengkrang Web Wisata (Modernized)

Aplikasi Web Wisata Cilengkrang yang telah dimodernisasi dari PHP Native ke Tech Stack modern berbasis TypeScript. Aplikasi ini mencakup fitur pemesanan tiket, informasi destinasi, galeri, dan artikel wisata.

> **⚠️ STATUS: TAHAP PENGEMBANGAN (UNDER DEVELOPMENT)**
> 
> Aplikasi ini masih dalam tahap migrasi dan debugging aktif. Beberapa fitur mungkin belum stabil atau dinonaktifkan sementara untuk perbaikan.
> - **Frontend**: Berjalan (Home, Destinasi, Artikel, Galeri, Kontak). 
> - **Backend**: Berjalan (API + Auth + CRUD).
> - **Database**: PostgreSQL via Docker.

## 🛠️ Teknologi yang Digunakan

**Backend:**
- **Runtime**: [Bun](https://bun.sh/) (Cepat & Modern)
- **Framework**: [ElysiaJS](https://elysiajs.com/)
- **Database**: PostgreSQL 16 (via Docker)
- **ORM**: [Prisma](https://www.prisma.io/) (v6.x)
- **Auth**: JWT (JSON Web Token)

**Frontend:**
- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: Bootstrap 5 + Custom CSS

**DevOps:**
- **Container**: Docker & Docker Compose
- **Database Admin**: Adminer (Web UI)

## 📂 Struktur Project

```
/backend        -> Kode API server (Elysia + Prisma)
/frontend       -> Kode client-side (React + Vite)
/database       -> SQL initialization scripts
/legacy_php     -> Backup kode lama (PHP) sebagai referensi
docker-compose.yml -> Konfigurasi Docker untuk PostgreSQL
```

## 🐳 Setup dengan Docker (Recommended)

### Prerequisites
- [Docker](https://www.docker.com/get-started) & Docker Compose
- [Bun](https://bun.sh/) (untuk backend)
- [Node.js](https://nodejs.org/) v18+ (untuk frontend)

### 1. Clone & Setup Environment

```bash
# Clone repository
git clone https://github.com/MuhammadRizalNurfirdaus/Cilengkrang-Web-Wisata.git
cd Cilengkrang-Web-Wisata

# Copy environment file
cp .env.example .env
```

### 2. Jalankan Database (PostgreSQL)

```bash
# Start PostgreSQL container
docker-compose up -d

# Cek status container
docker-compose ps
```

Database akan berjalan di:
- **PostgreSQL**: `localhost:5432`
- **Adminer (DB Admin UI)**: `http://localhost:8080`

### 3. Setup Backend

```bash
cd backend

# Install dependencies
bun install

# Generate Prisma Client
bun prisma generate

# Push schema ke database (buat tabel)
bun prisma db push

# (Optional) Seed data awal
bun prisma db seed

# Kembali ke root
cd ..
```

### 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Kembali ke root
cd ..
```

### 5. Jalankan Aplikasi

```bash
# Dari root project, jalankan backend dan frontend bersamaan
npm run dev:all
```

Atau jalankan terpisah:

```bash
# Terminal 1 - Backend
cd backend && bun run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

**Akses Aplikasi:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health
- **Adminer (DB UI)**: http://localhost:8080

## 🔧 Konfigurasi Environment

### Backend (.env)

```env
# Database connection - PostgreSQL via Docker
DATABASE_URL="postgresql://cilengkrang_user:cilengkrang_password@localhost:5432/cilengkrang_web_wisata?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Server
PORT=3001
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001
```

## 📝 API Endpoints

### Public Endpoints
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/wisata` | Daftar destinasi wisata |
| GET | `/api/wisata/popular` | Destinasi populer |
| GET | `/api/wisata/:id` | Detail destinasi |
| GET | `/api/wisata/slug/:slug` | Detail destinasi by slug |
| GET | `/api/articles` | Daftar artikel |
| GET | `/api/articles/latest` | Artikel terbaru |
| GET | `/api/articles/:id` | Detail artikel |
| GET | `/api/galeri` | Galeri foto |
| POST | `/api/contacts` | Kirim pesan kontak |

### Auth Endpoints
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrasi user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Protected Endpoints (Require Auth)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/wisata` | Tambah destinasi (Admin) |
| PUT | `/api/wisata/:id` | Update destinasi (Admin) |
| DELETE | `/api/wisata/:id` | Hapus destinasi (Admin) |
| POST | `/api/articles` | Tambah artikel (Admin) |
| PUT | `/api/articles/:id` | Update artikel (Admin) |
| DELETE | `/api/articles/:id` | Hapus artikel (Admin) |
| GET | `/api/pemesanan` | Daftar pemesanan |
| POST | `/api/pemesanan` | Buat pemesanan |

## 🗃️ Database Schema

Model utama dalam aplikasi:
- **User** - Data pengguna (admin/user)
- **Wisata** - Destinasi wisata
- **Article** - Artikel/berita
- **JenisTiket** - Jenis tiket & harga
- **PemesananTiket** - Pemesanan tiket
- **Galeri** - Foto galeri
- **Feedback** - Ulasan & rating
- **Contact** - Pesan kontak
- **SewaAlat** - Alat sewa camping

## 🔄 Perintah Berguna

```bash
# Docker
docker-compose up -d          # Start containers
docker-compose down           # Stop containers
docker-compose logs -f        # View logs

# Prisma
bun prisma studio             # Open Prisma Studio (DB GUI)
bun prisma migrate dev        # Create migration
bun prisma db push            # Push schema to DB
bun prisma generate           # Generate client

# Development
npm run dev:all               # Run all (from root)
bun run dev                   # Run backend (from /backend)
npm run dev                   # Run frontend (from /frontend)

# Build
npm run build                 # Build frontend
```

## 📸 Screenshots

*(Coming soon)*

## 🤝 Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

---

**Dikembangkan oleh:** Muhammad Rizal Nurfirdaus

*Proyek ini merupakan modernisasi dari aplikasi PHP legacy untuk keperluan pembelajaran dan pengembangan.*