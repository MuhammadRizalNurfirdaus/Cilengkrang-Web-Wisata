<?php
// File: C:\xampp\htdocs\Cilengkrang-Web-Wisata\admin\pembayaran\kelola_pembayaran.php

// LANGKAH 1: Sertakan config.php
if (!require_once __DIR__ . '/../../config/config.php') {
    http_response_code(503);
    exit("KRITIS: File konfigurasi utama tidak ditemukan.");
}

// LANGKAH 2: Otentikasi Admin
require_admin();

// LANGKAH 3: Set judul halaman
$pageTitle = "Kelola Pembayaran";

// LANGKAH 4: Sertakan header admin
require_once ROOT_PATH . '/template/header_admin.php';

// LANGKAH 5: Pengambilan dan Pemfilteran Data
$semuaPembayaran = [];
$data_pembayaran_awal = [];
$filter_status_pembayaran_url = isset($_GET['status_pembayaran']) ? trim(strtolower($_GET['status_pembayaran'])) : null;
$search_term = isset($_GET['search']) ? trim($_GET['search']) : null;
$pesan_error_data_pembayaran = null;

if (!class_exists('PembayaranController') || !method_exists('PembayaranController', 'getAllPembayaranForAdmin')) {
    $pesan_error_data_pembayaran = "Komponen sistem pembayaran tidak ditemukan atau tidak lengkap.";
} else {
    try {
        // Panggil controller dengan parameter pencarian
        $data_pembayaran_awal = PembayaranController::getAllPembayaranForAdmin($search_term, 'p.created_at DESC');

        if (!is_array($data_pembayaran_awal)) {
            $data_pembayaran_awal = [];
            $pesan_error_data_pembayaran = "Format data pembayaran tidak sesuai.";
        }

        if ($filter_status_pembayaran_url && !empty($data_pembayaran_awal)) {
            $semuaPembayaran = array_filter($data_pembayaran_awal, function ($p) use ($filter_status_pembayaran_url) {
                return isset($p['status_pembayaran']) && strtolower(trim((string)$p['status_pembayaran'])) === $filter_status_pembayaran_url;
            });
        } else {
            $semuaPembayaran = $data_pembayaran_awal;
        }
    } catch (Throwable $e) {
        $pesan_error_data_pembayaran = "Gagal memuat data pembayaran: " . $e->getMessage();
    }
}

if ($pesan_error_data_pembayaran) set_flash_message('danger', $pesan_error_data_pembayaran);

$unique_statuses = [];
if (!empty($data_pembayaran_awal)) {
    $unique_statuses = array_values(array_unique(array_column($data_pembayaran_awal, 'status_pembayaran')));
    sort($unique_statuses);
}
?>

<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= e(ADMIN_URL) ?>dashboard.php"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
        <li class="breadcrumb-item active" aria-current="page"><i class="fas fa-credit-card"></i> Kelola Pembayaran</li>
    </ol>
</nav>

<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Manajemen Pembayaran
        <small class="text-muted fs-6">
            <?php if ($filter_status_pembayaran_url) echo "(Filter: " . e(ucfirst(str_replace('_', ' ', $filter_status_pembayaran_url))) . ")"; ?>
            <?php if ($search_term) echo "(Pencarian: '" . e($search_term) . "')"; ?>
        </small>
    </h1>
    <!-- Tombol Filter Status -->
</div>

<?php display_flash_message(); ?>

<!-- === FORM PENCARIAN DAN FILTER BARU === -->
<div class="card shadow-sm mb-4">
    <div class="card-body">
        <form action="<?= e(ADMIN_URL . 'pembayaran/kelola_pembayaran.php') ?>" method="GET" class="row g-3 align-items-center">
            <div class="col-md-6">
                <div class="input-group">
                    <span class="input-group-text bg-light"><i class="fas fa-search"></i></span>
                    <input type="text" name="search" class="form-control" placeholder="Cari Kode Pesanan, Pemesan, Metode..." value="<?= e($search_term ?? '') ?>">
                </div>
            </div>
            <div class="col-md-4">
                <div class="input-group">
                    <label class="input-group-text bg-light" for="status_pembayaran"><i class="fas fa-filter"></i></label>
                    <select class="form-select" id="status_pembayaran" name="status_pembayaran" onchange="this.form.submit()">
                        <option value="">Semua Status</option>
                        <?php foreach ($unique_statuses as $status_opt): if (!empty(trim((string)$status_opt))): ?>
                                <option value="<?= e(strtolower(trim((string)$status_opt))) ?>" <?= ($filter_status_pembayaran_url === strtolower(trim((string)$status_opt))) ? 'selected' : '' ?>>
                                    <?= e(ucfirst(str_replace(['_', '-'], ' ', trim((string)$status_opt)))) ?>
                                </option>
                        <?php endif;
                        endforeach; ?>
                    </select>
                </div>
            </div>
            <div class="col-md-2 d-flex">
                <button type="submit" class="btn btn-primary w-100">Cari</button>
                <?php if ($search_term || $filter_status_pembayaran_url): ?>
                    <a href="<?= e(ADMIN_URL . 'pembayaran/kelola_pembayaran.php') ?>" class="btn btn-outline-secondary ms-2" title="Reset Filter & Pencarian">
                        <i class="fas fa-times"></i>
                    </a>
                <?php endif; ?>
            </div>
        </form>
    </div>
</div>
<!-- === AKHIR FORM === -->


<div class="card shadow mb-4">
    <div class="card-header bg-light py-3 d-flex flex-row align-items-center justify-content-between">
        <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-list me-2"></i>Daftar Transaksi Pembayaran</h6>
        <small class="text-muted">Total Ditemukan: <?= is_array($semuaPembayaran) ? count($semuaPembayaran) : 0 ?> data</small>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-bordered table-hover table-striped align-middle" id="dataTablePembayaran" width="100%" cellspacing="0">
                <thead class="table-dark">
                    <tr>
                        <th class="text-center">No.</th>
                        <th class="text-center">ID Bayar</th>
                        <th>Kode Pesanan & Pemesan</th>
                        <th>Metode</th>
                        <th class="text-end">Jumlah</th>
                        <th class="text-center">Status</th>
                        <th>Waktu Bayar</th>
                        <th class="text-center">Bukti</th>
                        <th>Tgl. Dibuat</th>
                        <th class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($pesan_error_data_pembayaran) && !empty($semuaPembayaran)): ?>
                        <?php $nomor_urut = 1; ?>
                        <?php foreach ($semuaPembayaran as $pembayaran): ?>
                            <?php
                            $status_pembayaran_raw = $pembayaran['status_pembayaran'] ?? 'unknown';
                            $status_badge_html = getStatusBadgeClassHTML($status_pembayaran_raw);
                            ?>
                            <tr>
                                <td class="text-center"><?= $nomor_urut++ ?></td>
                                <td class="text-center"><strong><?= e($pembayaran['id'] ?? '') ?></strong></td>
                                <td>
                                    <?php $kode_display = $pembayaran['kode_pemesanan_tiket'] ?? $pembayaran['kode_pemesanan'] ?? null; ?>
                                    <?php if ($kode_display && isset($pembayaran['pemesanan_tiket_id'])): ?>
                                        <a href="<?= e(ADMIN_URL . 'pemesanan_tiket/detail_pemesanan.php?id=' . $pembayaran['pemesanan_tiket_id']) ?>" title="Lihat Detail Pemesanan"><strong><?= e($kode_display) ?></strong></a>
                                    <?php else: echo e($kode_display ?? '-');
                                    endif; ?>
                                    <br><small class="text-muted">Oleh: <?= e($pembayaran['user_nama_pemesan'] ?? 'Tamu') ?></small>
                                </td>
                                <td><?= e($pembayaran['metode_pembayaran'] ?? '-') ?></td>
                                <td class="text-end fw-bold"><?= formatRupiah($pembayaran['jumlah_dibayar'] ?? 0) ?></td>
                                <td class="text-center"><?= $status_badge_html ?></td>
                                <td><?= !empty($pembayaran['waktu_pembayaran']) ? e(formatTanggalIndonesia($pembayaran['waktu_pembayaran'], true)) : '-' ?></td>
                                <td class="text-center">
                                    <?php if (!empty($pembayaran['bukti_pembayaran'])): ?>
                                        <?php
                                        $bukti_file_on_disk = UPLOADS_BUKTI_PEMBAYARAN_PATH . $pembayaran['bukti_pembayaran'];
                                        $bukti_url_web = UPLOADS_BUKTI_PEMBAYARAN_URL . rawurlencode($pembayaran['bukti_pembayaran']);
                                        ?>
                                        <?php if (file_exists($bukti_file_on_disk)): ?>
                                            <a href="<?= e($bukti_url_web) ?>" target="_blank" class="btn btn-sm btn-outline-info py-1 px-2" title="Lihat Bukti"><i class="fas fa-receipt"></i></a>
                                        <?php else: ?>
                                            <span class="text-muted" title="File bukti tidak ditemukan"><i class="fas fa-times-circle text-danger"></i></span>
                                        <?php endif; ?>
                                    <?php else: echo '-';
                                    endif; ?>
                                </td>
                                <td><?= e(formatTanggalIndonesia($pembayaran['created_at'], true)) ?></td>
                                <td class="text-center">
                                    <div class="btn-group" role="group">
                                        <a href="<?= e(ADMIN_URL) ?>pembayaran/detail_pembayaran.php?id=<?= e($pembayaran['id'] ?? '') ?>" class="btn btn-primary btn-sm py-1 px-2" title="Detail & Kelola"><i class="fas fa-eye"></i></a>
                                        <button type="button" class="btn btn-danger btn-sm py-1 px-2" data-bs-toggle="modal" data-bs-target="#hapusPembayaranModal" data-pembayaran-id="<?= e($pembayaran['id'] ?? '') ?>" data-kode-pesanan="<?= e($kode_display ?? 'N/A') ?>" title="Hapus"><i class="fas fa-trash-alt"></i></button>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="10" class="text-center py-5">
                                <?php if ($pesan_error_data_pembayaran): ?>
                                    <p class="mb-0 text-danger"><i class="fas fa-exclamation-triangle me-2"></i><?= e($pesan_error_data_pembayaran) ?></p>
                                <?php elseif ($search_term): ?>
                                    <p class="mb-0">Tidak ada data pembayaran yang cocok dengan "<strong><?= e($search_term) ?></strong>".</p>
                                <?php elseif ($filter_status_pembayaran_url): ?>
                                    <p class="mb-0">Tidak ada data pembayaran dengan status "<?= e(ucfirst(str_replace('_', ' ', $filter_status_pembayaran_url))) ?>".</p>
                                <?php else: ?>
                                    <p class="mb-0">Belum ada data transaksi pembayaran.</p>
                                <?php endif; ?>
                                <?php if ($search_term || $filter_status_pembayaran_url): ?>
                                    <a href="<?= e(ADMIN_URL) ?>pembayaran/kelola_pembayaran.php" class="btn btn-sm btn-link mt-2">Tampilkan Semua</a>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal Konfirmasi Hapus Pembayaran (tidak berubah) -->
<div class="modal fade" id="hapusPembayaranModal" tabindex="-1" aria-labelledby="hapusPembayaranModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="hapusPembayaranModalLabel"><i class="fas fa-exclamation-triangle me-2"></i>Konfirmasi Penghapusan</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Anda yakin ingin menghapus data pembayaran untuk pesanan <strong id="kodePesananDiModal"></strong> (ID Bayar: <strong id="pembayaranIdDiModal"></strong>)?</p>
                <p class="text-danger">Tindakan ini tidak dapat diurungkan.</p>
            </div>
            <div class="modal-footer">
                <form id="formHapusPembayaran" action="<?= e(ADMIN_URL) ?>pembayaran/hapus_pembayaran.php" method="POST">
                    <?= generate_csrf_token_input() ?>
                    <input type="hidden" name="pembayaran_id_to_delete" id="pembayaranIdToDelete">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" name="confirm_delete_pembayaran" class="btn btn-danger">Ya, Hapus</button>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        var hapusModal = document.getElementById('hapusPembayaranModal');
        if (hapusModal) {
            hapusModal.addEventListener('show.bs.modal', function(event) {
                var button = event.relatedTarget;
                var pembayaranId = button.getAttribute('data-pembayaran-id');
                var kodePesanan = button.getAttribute('data-kode-pesanan');
                hapusModal.querySelector('#pembayaranIdDiModal').textContent = pembayaranId;
                hapusModal.querySelector('#kodePesananDiModal').textContent = kodePesanan;
                hapusModal.querySelector('#pembayaranIdToDelete').value = pembayaranId;
            });
        }
    });
</script>

<?php require_once ROOT_PATH . '/template/footer_admin.php'; ?>