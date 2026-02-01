<?php
// File: C:\xampp\htdocs\Cilengkrang-Web-Wisata\admin\pemesanan_tiket\kelola_pemesanan.php

// 1. Sertakan config.php
if (!require_once __DIR__ . '/../../config/config.php') {
    http_response_code(503);
    error_log("FATAL: Gagal memuat config.php dari admin/pemesanan_tiket/kelola_pemesanan.php");
    exit("Kesalahan konfigurasi server. Tidak dapat memuat file penting.");
}

// 2. Panggil fungsi otentikasi admin
require_admin();

// 3. Sertakan Controller PemesananTiket
if (!class_exists('PemesananTiketController')) {
    http_response_code(500);
    error_log("FATAL: Gagal memuat controllers/PemesananTiketController.php");
    set_flash_message('danger', 'Kesalahan sistem: Komponen Pemesanan Tiket tidak dapat dimuat.');
    redirect(ADMIN_URL . '/dashboard.php');
    exit;
}

// 4. Set judul halaman dan sertakan header admin
$pageTitle = "Kelola Pemesanan Tiket";
require_once ROOT_PATH . '/template/header_admin.php';

// === PENANGANAN FILTER & PENCARIAN ===
$search_term = isset($_GET['search']) ? trim($_GET['search']) : null;
$filter_status_url = isset($_GET['status']) ? trim(strtolower($_GET['status'])) : null;
$page_subtitle = '';
// === AKHIR PENANGANAN ===


// 5. Ambil data pemesanan tiket
$daftar_pemesanan = [];
$pesan_error_data = null;

if (isset($conn) && $conn instanceof mysqli && !$conn->connect_error) {
    if (method_exists('PemesananTiketController', 'getAllForAdmin')) {
        try {
            // Panggil metode statis dari Controller dengan parameter pencarian
            $semua_pemesanan = PemesananTiketController::getAllForAdmin($search_term);

            // Filter berdasarkan status SETELAH data diambil (jika ada filter status)
            if ($filter_status_url && is_array($semua_pemesanan) && !empty($semua_pemesanan)) {
                $daftar_pemesanan = array_filter($semua_pemesanan, function ($p) use ($filter_status_url) {
                    return isset($p['status_pemesanan']) && strtolower($p['status_pemesanan']) === $filter_status_url;
                });
                $page_subtitle .= "(Filter Status: " . e(ucfirst(str_replace('_', ' ', $filter_status_url))) . ")";
            } else {
                $daftar_pemesanan = $semua_pemesanan;
            }

            // Tambahkan subjudul jika ada pencarian
            if ($search_term) {
                $page_subtitle .= " (Pencarian: '" . e($search_term) . "')";
            }

            if ($semua_pemesanan === false) {
                $pesan_error_data = 'Gagal mengambil data pemesanan dari controller.';
                error_log("Error dari PemesananTiketController::getAllForAdmin(): " . $pesan_error_data);
                $daftar_pemesanan = [];
                if (!isset($_SESSION['flash_message'])) set_flash_message('danger', $pesan_error_data);
            }
        } catch (Throwable $e) {
            error_log("Error ambil daftar pemesanan tiket: " . $e->getMessage() . "\n" . $e->getTraceAsString());
            $pesan_error_data = 'Gagal memuat daftar pemesanan tiket karena kesalahan server.';
            if (!isset($_SESSION['flash_message'])) set_flash_message('danger', $pesan_error_data);
        }
    } else {
        $pesan_error_data = 'Kesalahan sistem: Metode getAllForAdmin tidak ditemukan di Controller.';
        error_log($pesan_error_data);
        if (!isset($_SESSION['flash_message'])) set_flash_message('danger', $pesan_error_data);
    }
} else {
    $pesan_error_data = 'Koneksi database tidak tersedia.';
    error_log("Koneksi database tidak tersedia di kelola_pemesanan.php.");
    if (!isset($_SESSION['flash_message'])) set_flash_message('danger', $pesan_error_data);
}
?>

<!-- Breadcrumb -->
<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= e(ADMIN_URL) ?>/dashboard.php"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
        <li class="breadcrumb-item active" aria-current="page"><i class="fas fa-ticket-alt"></i> Kelola Pemesanan Tiket</li>
    </ol>
</nav>

<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Daftar Pemesanan Tiket <small class="text-muted fs-6"><?= e($page_subtitle) ?></small></h1>
</div>

<?php display_flash_message(); ?>

<!-- === FORM PENCARIAN BARU === -->
<div class="card shadow-sm mb-4">
    <div class="card-body">
        <form action="<?= e(ADMIN_URL . '/pemesanan_tiket/kelola_pemesanan.php') ?>" method="GET" class="row g-3 align-items-center">
            <div class="col">
                <div class="input-group">
                    <span class="input-group-text bg-light"><i class="fas fa-search"></i></span>
                    <input type="text" name="search" class="form-control" placeholder="Cari Kode Pesan, Nama, atau Email Pemesan..." value="<?= e($search_term ?? '') ?>">
                </div>
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-primary">Cari</button>
            </div>
            <?php if ($search_term || $filter_status_url): ?>
                <div class="col-auto">
                    <a href="<?= e(ADMIN_URL . '/pemesanan_tiket/kelola_pemesanan.php') ?>" class="btn btn-outline-secondary">Reset</a>
                </div>
            <?php endif; ?>
        </form>
    </div>
</div>
<!-- === AKHIR FORM PENCARIAN === -->

<div class="card shadow-sm">
    <div class="card-header bg-light d-flex flex-row align-items-center justify-content-between">
        <h5 class="mb-0"><i class="fas fa-list me-2"></i>Data Pemesanan Tiket</h5>
        <span class="badge bg-info rounded-pill"><?= is_array($daftar_pemesanan) ? count($daftar_pemesanan) : 0 ?> Item</span>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-bordered table-hover table-striped align-middle" id="dataTablePemesananTiket">
                <thead class="table-dark">
                    <tr>
                        <th scope="col" style="width: 3%;" class="text-center">No.</th>
                        <th scope="col" style="width: 5%;" class="text-center">ID</th>
                        <th scope="col" style="width: 12%;">Kode Pesan</th>
                        <th scope="col" style="width: 18%;">Nama Pemesan</th>
                        <th scope="col" style="width: 10%;">Tgl. Kunjungan</th>
                        <th scope="col" class="text-end" style="width: 10%;">Total Harga</th>
                        <th scope="col" class="text-center" style="width: 10%;">Status</th>
                        <th scope="col" style="width: 12%;">Tgl. Dibuat</th>
                        <th scope="col" style="width: 15%;" class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($pesan_error_data) && !empty($daftar_pemesanan) && is_array($daftar_pemesanan)): ?>
                        <?php $nomor_urut_visual = 1; ?>
                        <?php foreach ($daftar_pemesanan as $pemesanan): ?>
                            <tr>
                                <td class="text-center"><?= $nomor_urut_visual++ ?></td>
                                <td class="text-center"><strong><?= e($pemesanan['id'] ?? '-') ?></strong></td>
                                <td><strong><?= e($pemesanan['kode_pemesanan'] ?? '-') ?></strong></td>
                                <td>
                                    <?php
                                    $nama_display = $pemesanan['user_nama'] ?? ($pemesanan['nama_pemesan_tamu'] ?? 'N/A');
                                    $is_user_terdaftar = !empty($pemesanan['user_id']);

                                    if ($is_user_terdaftar) {
                                        echo '<i class="fas fa-user-check text-success me-1" title="Pengguna Terdaftar"></i>';
                                    } else {
                                        echo '<i class="fas fa-user-alt-slash text-muted me-1" title="Tamu"></i>';
                                    }
                                    echo e($nama_display);

                                    $email_display = $pemesanan['user_email'] ?? ($pemesanan['email_pemesan_tamu'] ?? null);
                                    if ($email_display) {
                                        echo '<br><small class="text-muted" title="' . e($email_display) . '"><i class="fas fa-envelope fa-fw"></i> ' . e(mb_strimwidth($email_display, 0, 20, "...")) . '</small>';
                                    }
                                    if (!$is_user_terdaftar && !empty($pemesanan['nohp_pemesan_tamu'])) {
                                        echo '<br><small class="text-muted" title="' . e($pemesanan['nohp_pemesan_tamu']) . '"><i class="fas fa-phone fa-fw"></i> ' . e($pemesanan['nohp_pemesan_tamu']) . '</small>';
                                    }
                                    ?>
                                </td>
                                <td><?= e(formatTanggalIndonesia($pemesanan['tanggal_kunjungan'] ?? '', false)) ?></td>
                                <td class="text-end fw-bold"><?= formatRupiah($pemesanan['total_harga_akhir'] ?? 0) ?></td>
                                <td class="text-center">
                                    <?php
                                    $status_pesan_raw = $pemesanan['status_pemesanan'] ?? 'unknown';
                                    $status_pesan = strtolower($status_pesan_raw);
                                    $status_class = 'bg-secondary';
                                    if ($status_pesan == 'pending') $status_class = 'bg-warning text-dark';
                                    elseif ($status_pesan == 'waiting_payment') $status_class = 'bg-info text-dark';
                                    elseif ($status_pesan == 'paid') $status_class = 'bg-primary';
                                    elseif ($status_pesan == 'confirmed') $status_class = 'bg-success';
                                    elseif ($status_pesan == 'completed') $status_class = 'bg-dark';
                                    elseif ($status_pesan == 'cancelled') $status_class = 'bg-danger';
                                    elseif ($status_pesan == 'expired') $status_class = 'bg-light text-dark border';
                                    ?>
                                    <span class="badge rounded-pill <?= $status_class ?>"><?= e(ucfirst(str_replace('_', ' ', $status_pesan_raw))) ?></span>
                                </td>
                                <td><?= e(formatTanggalIndonesia($pemesanan['created_at'] ?? '', true)) ?></td>
                                <td class="text-center">
                                    <div class="btn-group btn-group-sm" role="group">
                                        <a href="<?= e(ADMIN_URL) ?>/pemesanan_tiket/detail_pemesanan.php?id=<?= e($pemesanan['id'] ?? '') ?>" class="btn btn-primary" title="Lihat Detail & Kelola Status">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                        <a href="<?= e(ADMIN_URL) ?>/pemesanan_tiket/cetak_pesanan_tiket.php?id=<?= e($pemesanan['id'] ?? '') ?>" class="btn btn-secondary" title="Cetak Bukti Pesanan" target="_blank">
                                            <i class="fas fa-print"></i>
                                        </a>
                                        <form action="<?= e(ADMIN_URL) ?>/pemesanan_tiket/hapus_pemesanan.php" method="POST" class="d-inline">
                                            <input type="hidden" name="id_pemesanan" value="<?= e($pemesanan['id'] ?? '') ?>">
                                            <button type="submit" name="hapus_pemesanan_submit" class="btn btn-danger" title="Hapus Pemesanan"
                                                onclick="return confirm('PERHATIAN: Menghapus pemesanan (<?= e(addslashes($pemesanan['kode_pemesanan'] ?? '')) ?>) juga akan menghapus semua data terkait. Yakin?');">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="9" class="text-center py-4">
                                <?php if ($pesan_error_data): ?>
                                    <p class="mb-2 lead text-danger"><i class="fas fa-exclamation-triangle"></i> <?= e($pesan_error_data) ?></p>
                                <?php elseif ($search_term): ?>
                                    <p class="mb-2 lead">Tidak ada pemesanan yang cocok dengan "<strong><?= e($search_term) ?></strong>".</p>
                                <?php elseif ($filter_status_url): ?>
                                    <p class="mb-2 lead">Tidak ada pemesanan dengan status "<?= e(ucfirst($filter_status_url)) ?>".</p>
                                <?php else: ?>
                                    <p class="mb-2 lead">Belum ada data pemesanan tiket.</p>
                                <?php endif; ?>
                                <a href="<?= e(ADMIN_URL) ?>/pemesanan_tiket/kelola_pemesanan.php" class="btn btn-primary btn-sm">Tampilkan Semua Pemesanan</a>
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php
include_once ROOT_PATH . '/template/footer_admin.php';
?>