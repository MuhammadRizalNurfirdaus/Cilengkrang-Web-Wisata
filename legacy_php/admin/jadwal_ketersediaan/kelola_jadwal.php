<?php
// File: C:\xampp\htdocs\Cilengkrang-Web-Wisata\admin\jadwal_ketersediaan\kelola_jadwal.php

require_once __DIR__ . '/../../config/config.php';
// Controller akan dimuat oleh autoloader atau config.php
if (!class_exists('JadwalKetersediaanTiketController')) {
    require_once __DIR__ . '/../../controllers/JadwalKetersediaanTiketController.php';
}

require_admin(); // Pastikan diaktifkan

$page_title = "Kelola Jadwal Ketersediaan Tiket";
include_once __DIR__ . '/../../template/header_admin.php';

// === PENANGANAN PENCARIAN ===
$search_term = isset($_GET['search']) ? trim($_GET['search']) : null;
// === AKHIR PENANGANAN ===

// Panggil controller dengan parameter pencarian
$daftar_jadwal = JadwalKetersediaanTiketController::getAllForAdmin($search_term);
?>

<!-- Breadcrumb -->
<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= e(ADMIN_URL . 'dashboard.php') ?>"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
        <li class="breadcrumb-item active" aria-current="page"><i class="fas fa-calendar-alt"></i> Kelola Jadwal Ketersediaan Tiket</li>
    </ol>
</nav>

<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Daftar Jadwal Ketersediaan Tiket</h1>
    <a href="<?= e(ADMIN_URL . 'jadwal_ketersediaan/tambah_jadwal.php') ?>" class="btn btn-sm btn-success shadow-sm">
        <i class="fas fa-plus fa-sm text-white-50"></i> Tambah Jadwal Baru
    </a>
</div>

<?php display_flash_message(); ?>

<!-- === FORM PENCARIAN BARU === -->
<div class="card shadow-sm mb-4">
    <div class="card-body">
        <form action="<?= e(ADMIN_URL . 'jadwal_ketersediaan/kelola_jadwal.php') ?>" method="GET" class="row g-3 align-items-center">
            <div class="col">
                <div class="input-group">
                    <span class="input-group-text bg-light"><i class="fas fa-search"></i></span>
                    <input type="text" name="search" class="form-control" placeholder="Cari Nama Tiket atau Tanggal (YYYY-MM-DD)..." value="<?= e($search_term ?? '') ?>">
                </div>
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-primary">Cari</button>
            </div>
            <?php if ($search_term): ?>
                <div class="col-auto">
                    <a href="<?= e(ADMIN_URL . 'jadwal_ketersediaan/kelola_jadwal.php') ?>" class="btn btn-outline-secondary">Reset</a>
                </div>
            <?php endif; ?>
        </form>
    </div>
</div>
<!-- === AKHIR FORM PENCARIAN === -->


<div class="card shadow-sm">
    <div class="card-header bg-light d-flex flex-row align-items-center justify-content-between">
        <h5 class="mb-0">
            <i class="fas fa-list me-2"></i>
            <?php if ($search_term): ?>
                Hasil Pencarian untuk "<?= e($search_term) ?>"
            <?php else: ?>
                Jadwal Ketersediaan Tiket
            <?php endif; ?>
        </h5>
        <span class="badge bg-info rounded-pill"><?= is_array($daftar_jadwal) ? count($daftar_jadwal) : 0 ?> Jadwal</span>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-bordered table-hover table-striped">
                <thead class="table-dark">
                    <tr>
                        <th scope="col" style="width: 3%;">No.</th>
                        <th scope="col" style="width: 5%;">ID Jadwal</th>
                        <th scope="col" style="width: 22%;">Jenis Tiket</th>
                        <th scope="col" style="width: 12%;">Tanggal</th>
                        <th scope="col" class="text-center" style="width: 10%;">Total Kuota</th>
                        <th scope="col" class="text-center" style="width: 10%;">Sisa Kuota</th>
                        <th scope="col" class="text-center" style="width: 10%;">Status Jadwal</th>
                        <th scope="col" style="width: 10%;">Dibuat</th>
                        <th scope="col" style="width: 15%;" class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (!empty($daftar_jadwal)): ?>
                        <?php $nomor_urut_visual = 1; ?>
                        <?php foreach ($daftar_jadwal as $jadwal): ?>
                            <tr class="<?= ($jadwal['aktif'] == 0) ? 'table-secondary text-muted' : '' ?><?= (strtotime($jadwal['tanggal']) < strtotime(date('Y-m-d')) && $jadwal['aktif'] == 1) ? ' table-warning' : '' ?>">
                                <td class="text-center"><?= $nomor_urut_visual++ ?></td>
                                <th scope="row"><?= e($jadwal['id']) ?></th>
                                <td>
                                    <?= e($jadwal['nama_layanan_display'] ?? 'N/A') ?> (<?= e($jadwal['tipe_hari'] ?? 'N/A') ?>)
                                    <br><small class="text-muted">ID Jenis Tiket: <?= e($jadwal['jenis_tiket_id']) ?></small>
                                </td>
                                <td><?= e(formatTanggalIndonesia($jadwal['tanggal'])) ?></td>
                                <td class="text-center"><?= e($jadwal['jumlah_total_tersedia']) ?></td>
                                <td class="text-center fw-bold <?= ($jadwal['jumlah_saat_ini_tersedia'] == 0 && $jadwal['aktif'] == 1) ? 'text-danger' : (($jadwal['jumlah_saat_ini_tersedia'] > 0) ? 'text-success' : '') ?>">
                                    <?= e($jadwal['jumlah_saat_ini_tersedia']) ?>
                                </td>
                                <td class="text-center">
                                    <?php if ($jadwal['aktif'] == 1): ?>
                                        <span class="badge bg-success">Aktif</span>
                                        <?php if (strtotime($jadwal['tanggal']) < strtotime(date('Y-m-d'))): ?>
                                            <span class="badge bg-warning text-dark ms-1">Lampau</span>
                                        <?php endif; ?>
                                    <?php else: ?>
                                        <span class="badge bg-danger">Tidak Aktif</span>
                                    <?php endif; ?>
                                </td>
                                <td><?= e(formatTanggalIndonesia($jadwal['created_at'], false, true)) ?></td>
                                <td class="text-center">
                                    <div class="btn-group btn-group-sm">
                                        <a href="<?= e(ADMIN_URL . 'jadwal_ketersediaan/edit_jadwal.php?id=' . $jadwal['id']) ?>" class="btn btn-warning" title="Edit Jadwal">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <!-- Add delete button if needed -->
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="9" class="text-center py-4">
                                <?php if ($search_term): ?>
                                    <p class="mb-2 lead">Tidak ditemukan jadwal yang cocok dengan "<strong><?= e($search_term) ?></strong>".</p>
                                    <a href="<?= e(ADMIN_URL . 'jadwal_ketersediaan/kelola_jadwal.php') ?>" class="btn btn-primary btn-sm">Tampilkan Semua Jadwal</a>
                                <?php else: ?>
                                    <p class="mb-2 lead">Belum ada jadwal ketersediaan tiket yang dibuat.</p>
                                    <a href="<?= e(ADMIN_URL . 'jadwal_ketersediaan/tambah_jadwal.php') ?>" class="btn btn-primary btn-sm">
                                        <i class="fas fa-plus"></i> Buat Jadwal Pertama
                                    </a>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php
include_once __DIR__ . '/../../template/footer_admin.php';
?>