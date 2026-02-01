# Cilengkrang Web Wisata (Modernized)

Aplikasi Web Wisata Cilengkrang yang telah dimodernisasi dari PHP Native ke Tech Stack modern berbasis TypeScript. Aplikasi ini mencakup fitur pemesanan tiket, informasi destinasi, galeri, dan artikel wisata.

> **⚠️ STATUS: TAHAP PENGEMBANGAN (UNDER DEVELOPMENT)**
> 
> Aplikasi ini masih dalam tahap migrasi dan debugging aktif. Beberapa fitur mungkin belum stabil atau dinonaktifkan sementara untuk perbaikan.
> - **Frontend**: Berjalan (Home, Destinasi, Kontak). Fitur Admin & User Dashboard sedang dalam perbaikan.
> - **Backend**: Berjalan (API + Auth).

## 🛠️ Teknologi yang Digunakan

**Backend:**
- **Runtime**: [Bun](https://bun.sh/) (Cepat & Modern)
- **Framework**: [ElysiaJS](https://elysiajs.com/)
- **Database**: MariaDB / MySQL
- **ORM**: [Prisma](https://www.prisma.io/) (v6.x Stabil)
- **Auth**: JWT (JSON Web Token)

**Frontend:**
- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: Bootstrap 5 + Custom CSS

## 📂 Struktur Project

```
/backend      -> Kode API server (Elysia + Prisma)
/frontend     -> Kode client-side (React + Vite)
/legacy_php   -> Backup kode lama (PHP) sebagai referensi
```

## 🚀 Cara Menjalankan Project

Pastikan Anda sudah menginstall [Bun](https://bun.sh/) dan [Node.js](https://nodejs.org/).

1.  **Install Dependencies** (Jalankan di root project):
    ```bash
    npm install
    cd backend && bun install
    cd ../frontend && npm install
    ```

2.  **Setup Database**:
    - Pastikan file `backend/.env` sudah sesuai dengan kredensial database Anda (`DATABASE_URL`).
    - Generate Prisma Client:
      ```bash
      cd backend && bun prisma generate
      ```
    - Push schema ke database (Hati-hati, ini mereset data jika db sudah ada):
      ```bash
      cd backend && bun prisma db push
      ```

3.  **Jalankan Server (Dev Mode)**:
    Kembali ke root project dan jalankan:
    ```bash
    npm run dev:all
    ```
    Perintah ini akan menjalankan Backend (port 3001) dan Frontend (port 5173) secara bersamaan.

## 📝 Catatan Penting
- Jika mengalami layar putih/error saat membuka web, coba refresh atau buka console browser (F12) untuk melihat detail error.
- Backend menggunakan Prisma v6 (karena v7 masih unstable di project ini). Jangan update ke v7 tanpa penyesuaian config.

---
*Created by [Your Name/Team]*