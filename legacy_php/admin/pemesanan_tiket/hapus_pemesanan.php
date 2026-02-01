<?php
// File: C:\xampp\htdocs\Cilengkrang-Web-Wisata\admin\pemesanan_tiket\hapus_pemesanan.php

// 1. Muat Konfigurasi Utama dan Pemeriksaan Dasar
if (!require_once __DIR__ . '/../../config/config.php') {
    http_response_code(503);
    error_log("FATAL ERROR di hapus_pemesanan.php: Gagal memuat config.php.");
    exit("Kesalahan konfigurasi server. Aplikasi tidak dapat melanjutkan.");
}

// 2. Otentikasi Admin - SANGAT PENTING!
try {
    require_admin();
} catch (Exception $e) {
    error_log("ERROR saat otentikasi admin di hapus_pemesanan.php: " . $e->getMessage());
    set_flash_message('danger', 'Akses ditolak. Anda harus login sebagai admin.');
    redirect(AUTH_URL . '/login.php');
    exit;
}

// 3. Muat Controller PemesananTiket
if (!class_exists('PemesananTiketController')) {
    error_log("FATAL ERROR di hapus_pemesanan.php: Class PemesananTiketController tidak ditemukan setelah config.php dimuat.");
    set_flash_message('danger', 'Kesalahan sistem: Komponen Pemesanan Tiket tidak ditemukan.');
    redirect(ADMIN_URL . '/pemesanan_tiket/kelola_pemesanan.php');
    exit;
}

// 4. Validasi Metode Request dan ID
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    set_flash_message('warning', 'Aksi hapus harus melalui metode POST yang aman.');
    redirect(ADMIN_URL . '/pemesanan_tiket/kelola_pemesanan.php');
    exit;
}

$id_pemesanan = null;
if (isset($_POST['id_pemesanan']) && isset($_POST['hapus_pemesanan_submit'])) {
    $id_pemesanan = filter_var($_POST['id_pemesanan'], FILTER_VALIDATE_INT);
}

if (!$id_pemesanan || $id_pemesanan <= 0) {
    set_flash_message('danger', 'ID Pemesanan tidak valid atau tidak ditemukan untuk dihapus.');
    redirect(ADMIN_URL . '/pemesanan_tiket/kelola_pemesanan.php');
    exit;
}

// 5. Panggil Metode Delete dari Controller
$deleteBerhasil = false;
if (method_exists('PemesananTiketController', 'deletePemesananById')) {
    try {
        $deleteBerhasil = PemesananTiketController::deletePemesananById($id_pemesanan);

        if ($deleteBerhasil) {
            $admin_user_id = $_SESSION['user_id'] ?? 'UNKNOWN_ADMIN';
            error_log("ADMIN ACTION: Pemesanan tiket ID {$id_pemesanan} dihapus oleh admin ID {$admin_user_id}");
        } else {
            // Jika controller mengembalikan false, flash message kemungkinan sudah di-set dari dalam controller.
            if (!isset($_SESSION['flash_message'])) {
                set_flash_message('danger', 'Gagal menghapus pemesanan tiket (ID: ' . e($id_pemesanan) . '). Operasi di controller tidak berhasil.');
            }
        }
    } catch (Exception $e) {
        error_log("EXCEPTION saat menghapus pemesanan (ID: {$id_pemesanan}): " . $e->getMessage());
        set_flash_message('danger', 'Terjadi kesalahan teknis saat menghapus pemesanan: ' . e($e->getMessage()));
    }
} else {
    set_flash_message('danger', 'Kesalahan sistem: Fungsi untuk menghapus pemesanan tidak tersedia.');
    error_log("FATAL ERROR di hapus_pemesanan.php: Method 'deletePemesananById' tidak ditemukan di PemesananTiketController.");
}

// 6. Redirect kembali ke halaman kelola pemesanan tiket
redirect(ADMIN_URL . '/pemesanan_tiket/kelola_pemesanan.php');
exit;
