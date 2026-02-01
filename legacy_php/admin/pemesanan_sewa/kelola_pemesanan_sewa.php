<?php
// File: C:\xampp\htdocs\Cilengkrang-Web-Wisata\admin\pemesanan_sewa\kelola_pemesanan_sewa.php

// LANGKAH 1: Pastikan config.php dimuat
if (!require_once __DIR__ . '/../../config/config.php') {
    http_response_code(503);
    exit("FATAL ERROR: Tidak dapat memuat file konfigurasi utama.");
}

// LANGKAH 2: Panggil Otentikasi Admin
require_admin();

// LANGKAH 3: Sertakan Controller
if (!class_exists('PemesananSewaAlatController')) {
    require_once __DIR__ . '/../../controllers/PemesananSewaAlatController.php';
}

// LANGKAH 4: Set judul halaman dan sertakan header
$pageTitle = "Manajemen Pemesanan Sewa Alat";
require_once ROOT_PATH . '/template/header_admin.php';

// === PENANGANAN FILTER & PENCARIAN ===
$search_term = isset($_GET['search']) ? trim($_GET['search']) : null;
$filter_status_sewa_url = isset($_GET['status']) ? trim(strtolower($_GET['status'])) : null;
$page_subtitle = '';

if ($search_term) $page_subtitle .= " (Pencarian: '" . e($search_term) . "')";
if ($filter_status_sewa_url) $page_subtitle .= " (Filter Status: " . e(ucfirst($filter_status_sewa_url)) . ")";
// === AKHIR PENANGANAN ===
?>

<!-- Konten Utama Dimulai -->
<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= e(ADMIN_URL) ?>/dashboard.php"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
        <li class="breadcrumb-item active" aria-current="page"><i class="fas fa-boxes-stacked"></i> Kelola Pemesanan Sewa</li>
    </ol>
</nav>

<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Manajemen Pemesanan Sewa Alat
        <small class="text-muted fs-6"><?= e($page_subtitle) ?></small>
    </h1>
</div>

<?php display_flash_message(); ?>

<?php
// Pengambilan Data
$daftarPemesananSewa = [];
$pesan_error_saat_ambil_data = null;

if (class_exists('PemesananSewaAlatController') && method_exists('PemesananSewaAlatController', 'getAllPemesananSewaForAdmin')) {
    try {
        // Panggil controller dengan parameter pencarian
        $semua_data_pemesanan_sewa = PemesananSewaAlatController::getAllPemesananSewaForAdmin($search_term);

        if ($filter_status_sewa_url && is_array($semua_data_pemesanan_sewa) && !empty($semua_data_pemesanan_sewa)) {
            $daftarPemesananSewa = array_filter($semua_data_pemesanan_sewa, function ($ps) use ($filter_status_sewa_url) {
                return isset($ps['status_item_sewa']) && strtolower(trim((string)$ps['status_item_sewa'])) === $filter_status_sewa_url;
            });
        } else {
            $daftarPemesananSewa = $semua_data_pemesanan_sewa;
        }
    } catch (Throwable $e) {
        $pesan_error_saat_ambil_data = "Terjadi kesalahan saat mengambil data pemesanan: " . $e->getMessage();
        error_log("ERROR getAllPemesananSewaForAdmin: " . $e->getMessage());
    }
} else {
    $pesan_error_saat_ambil_data = "Komponen untuk mengambil data pemesanan tidak tersedia.";
}

if ($pesan_error_saat_ambil_data) {
    echo '<div class="alert alert-danger" role="alert">' . e($pesan_error_saat_ambil_data) . '</div>';
}
?>

<!-- === FORM PENCARIAN BARU === -->
<div class="card shadow-sm mb-4">
    <div class="card-body">
        <form action="<?= e(ADMIN_URL . 'pemesanan_sewa/kelola_pemesanan_sewa.php') ?>" method="GET" class="row g-3 align-items-center">
            <div class="col">
                <div class="input-group">
                    <span class="input-group-text bg-light"><i class="fas fa-search"></i></span>
                    <input type="text" name="search" class="form-control" placeholder="Cari Nama Pemesan, Kode Tiket, atau Nama Alat..." value="<?= e($search_term ?? '') ?>">
                </div>
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-primary">Cari</button>
            </div>
            <?php if ($search_term || $filter_status_sewa_url): ?>
                <div class="col-auto">
                    <a href="<?= e(ADMIN_URL . 'pemesanan_sewa/kelola_pemesanan_sewa.php') ?>" class="btn btn-outline-secondary">Reset</a>
                </div>
            <?php endif; ?>
        </form>
    </div>
</div>
<!-- === AKHIR FORM PENCARIAN === -->


<div class="card shadow mb-4">
    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
        <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-list me-2"></i>Daftar Pemesanan Sewa Alat</h6>
        <span class="badge bg-info rounded-pill"><?= is_array($daftarPemesananSewa) ? count($daftarPemesananSewa) : 0 ?> Item</span>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-bordered table-hover table-striped align-middle" id="dataTablePemesananSewa" style="width:100%;">
                <thead class="table-dark">
                    <tr>
                        <th class="text-center" style="width:3%;">No.</th>
                        <th class="text-center" style="width:5%;">ID Sewa</th>
                        <th style="width:18%;">Pemesan (Info Tiket)</th>
                        <th style="width:15%;">Alat Disewa</th>
                        <th class="text-center" style="width:5%;">Jml</th>
                        <th style="width:17%;">Periode Sewa</th>
                        <th class="text-end" style="width:8%;">Total</th>
                        <th class="text-center" style="width:10%;">Status</th>
                        <th style="width:9%;">Tgl. Pesan</th>
                        <th class="text-center" style="width:10%;">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($pesan_error_saat_ambil_data) && !empty($daftarPemesananSewa)): ?>
                        <?php $nomor_urut_visual = 1; ?>
                        <?php foreach ($daftarPemesananSewa as $pesanan): ?>
                            <?php
                            $status_item_display = strtolower(trim($pesanan['status_item_sewa'] ?? 'tidak diketahui'));
                            $rowClass = '';
                            if (in_array($status_item_display, ['hilang', 'rusak', 'dibatalkan'])) $rowClass = 'table-danger';
                            elseif ($status_item_display == 'dikembalikan') $rowClass = 'table-success';
                            elseif ($status_item_display == 'diambil') $rowClass = 'table-info';
                            $pesanan_id_safe = e($pesanan['id'] ?? '');
                            ?>
                            <tr class="<?= e($rowClass) ?>">
                                <td class="text-center"><?= $nomor_urut_visual++ ?></td>
                                <td class="text-center"><strong><?= e($pesanan['id'] ?? '-') ?></strong></td>
                                <td>
                                    <?php
                                    $nama_pemesan_tiket_display = $pesanan['nama_pemesan'] ?? 'N/A';
                                    $id_user_pemesan_tiket_display = $pesanan['id_user_pemesan_tiket'] ?? null;
                                    echo ($id_user_pemesan_tiket_display) ? '<i class="fas fa-user-check text-success me-1" title="Pengguna Terdaftar"></i> ' : '<i class="fas fa-user-alt-slash text-muted me-1" title="Tamu"></i> ';
                                    echo e($nama_pemesan_tiket_display);
                                    if ($id_user_pemesan_tiket_display) echo ' <small class="text-muted d-block">(User ID: ' . e($id_user_pemesan_tiket_display) . ')</small>';
                                    if (!empty($pesanan['kode_pemesanan_tiket'])) echo '<small class="text-muted d-block">Tiket: <a href="' . e(ADMIN_URL) . '/pemesanan_tiket/detail_pemesanan.php?id=' . e($pesanan['pemesanan_tiket_id']) . '">' . e($pesanan['kode_pemesanan_tiket']) . '</a></small>';
                                    ?>
                                </td>
                                <td><?= e($pesanan['nama_alat'] ?? 'N/A') ?> <br><small class="text-muted">(Alat ID: <?= e($pesanan['sewa_alat_id'] ?? '-') ?>)</small></td>
                                <td class="text-center"><?= e($pesanan['jumlah'] ?? '0') ?></td>
                                <td>
                                    <small>Mulai: <?= e(formatTanggalIndonesia($pesanan['tanggal_mulai_sewa'] ?? null, true)) ?></small><br>
                                    <small>Akhir: <?= e(formatTanggalIndonesia($pesanan['tanggal_akhir_sewa_rencana'] ?? null, true)) ?></small>
                                </td>
                                <td class="text-end fw-bold"><?= formatRupiah($pesanan['total_harga_item'] ?? 0) ?></td>
                                <td class="text-center">
                                    <?php if (function_exists('getSewaStatusBadgeClass')): ?>
                                        <span class="badge rounded-pill bg-<?php echo getSewaStatusBadgeClass($status_item_display); ?>"><?= e(ucfirst($status_item_display)) ?></span>
                                    <?php else: echo e(ucfirst($status_item_display));
                                    endif; ?>
                                </td>
                                <td><?= e(formatTanggalIndonesia($pesanan['created_at'] ?? null, false)) ?></td>
                                <td class="text-center">
                                    <div class="btn-group" role="group">
                                        <a href="<?= e(ADMIN_URL) ?>/pemesanan_sewa/detail_pemesanan_sewa.php?id=<?= $pesanan_id_safe ?>" class="btn btn-info btn-sm" title="Detail & Edit Catatan/Denda"><i class="fas fa-eye"></i></a>
                                        <button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" title="Ubah Status"><i class="fas fa-sync-alt"></i></button>
                                        <ul class="dropdown-menu dropdown-menu-end">
                                            <?php foreach (['Dipesan', 'Diambil', 'Dikembalikan', 'Hilang', 'Rusak', 'Dibatalkan'] as $status_option): ?>
                                                <?php if (strtolower($status_option) !== $status_item_display): ?>
                                                    <li>
                                                        <form action="<?= e(ADMIN_URL) ?>/pemesanan_sewa/proses_update_status_sewa.php" method="POST" class="d-inline m-0"><input type="hidden" name="pemesanan_id" value="<?= $pesanan_id_safe ?>"><input type="hidden" name="new_status" value="<?= e($status_option) ?>"><button type="submit" name="update_status_sewa_submit" class="dropdown-item" onclick="return confirm('Ubah status pemesanan #<?= $pesanan_id_safe ?> menjadi <?= e($status_option) ?>?')">Tandai <?= e($status_option) ?></button></form>
                                                    </li>
                                                <?php endif; ?>
                                            <?php endforeach; ?>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="10" class="text-center py-4">
                                <i class="fas fa-info-circle me-2"></i>
                                <?php if ($search_term): ?>
                                    Tidak ada data yang cocok dengan pencarian "<strong><?= e($search_term) ?></strong>".
                                <?php elseif ($filter_status_sewa_url): ?>
                                    Tidak ada data dengan status "<?= e(ucfirst($filter_status_sewa_url)) ?>".
                                <?php else: ?>
                                    Belum ada data pemesanan sewa yang tersedia.
                                <?php endif; ?>
                                <a href="<?= e(ADMIN_URL) ?>/pemesanan_sewa/kelola_pemesanan_sewa.php" class="d-block mt-2">Lihat semua status</a>.
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once ROOT_PATH . '/template/footer_admin.php'; ?>