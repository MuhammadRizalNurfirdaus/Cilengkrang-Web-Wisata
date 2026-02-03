export interface User {
    id: number;
    nama: string;
    email: string;
    role: string;
    noHp?: string | null;
    alamat?: string | null;
    fotoProfil?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    data?: {
        token: string;
        user: User;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface Article {
    id: number;
    judul: string;
    slug: string;
    isi: string;
    ringkasan?: string | null;
    gambar?: string | null;
    penulis?: string | null;
    published: boolean;
    createdAt: string;
    updatedAt?: string;
    feedback?: Feedback[];
}

export interface Wisata {
    id: number;
    nama: string;
    slug: string;
    deskripsi?: string | null;
    gambar?: string | null;
    lokasi?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    fasilitas?: string | null;
    jamOperasi?: string | null;
    aktif: boolean;
    createdAt: string;
    updatedAt?: string;
    jenisTiket?: JenisTiket[];
    galeri?: Galeri[];
    feedback?: Feedback[];
}

export interface JenisTiket {
    id: number;
    namaLayananDisplay: string;
    tipeHari: "Hari Kerja" | "Hari Libur" | "Semua Hari";
    harga: number;
    deskripsi?: string | null;
    aktif: boolean;
    wisataId?: number | null;
    wisata?: Wisata;
}

export interface Galeri {
    id: number;
    namaFile: string;
    judul?: string | null;
    keterangan?: string | null;
    kategori?: string | null;
    wisataId?: number | null;
    uploadedAt: string;
    wisata?: Wisata;
}

export interface Feedback {
    id: number;
    userId?: number | null;
    artikelId?: number | null;
    wisataId?: number | null;
    komentar: string;
    rating?: number | null;
    createdAt: string;
    user?: User;
    artikel?: Article;
    wisata?: Wisata;
}

export interface Contact {
    id: number;
    nama: string;
    email: string;
    subjek?: string | null;
    pesan: string;
    dibaca: boolean;
    createdAt: string;
}

export interface PemesananTiket {
    id: number;
    userId?: number | null;
    namaPemesanTamu?: string | null;
    emailPemesanTamu?: string | null;
    nohpPemesanTamu?: string | null;
    kodePemesanan: string;
    tanggalKunjungan: string;
    totalHargaAkhir: number;
    status: "PENDING" | "WAITING_PAYMENT" | "PAID" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "EXPIRED";
    catatanUmumPemesanan?: string | null;
    createdAt: string;
    user?: User;
    detailPemesanan?: DetailPemesananTiket[];
    pembayaran?: Pembayaran | null;
}

export interface DetailPemesananTiket {
    id: number;
    pemesananTiketId: number;
    jenisTiketId: number;
    jumlah: number;
    hargaSatuanSaatPesan: number;
    subtotalItem: number;
    jenisTiket?: JenisTiket;
}

export interface Pembayaran {
    id: number;
    pemesananTiketId: number;
    metodePembayaran: string;
    jumlahDibayar: number;
    waktuPembayaran?: string | null;
    statusPembayaran: "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED" | "REFUNDED" | "AWAITING_CONFIRMATION";
    buktiPembayaran?: string | null;
    idTransaksiGateway?: string | null;
    nomorVirtualAccount?: string | null;
    createdAt: string;
}

export interface SewaAlat {
    id: number;
    namaItem: string;
    kategoriAlat?: string | null;
    deskripsi?: string | null;
    hargaSewa: number;
    durasiHargaSewa: number;
    satuanDurasiHarga: "Jam" | "Hari" | "Peminjaman";
    stokTersedia: number;
    gambarAlat?: string | null;
    kondisiAlat: "Baik" | "Rusak Ringan" | "Perlu Perbaikan" | "Hilang";
}
