<?php
// File: C:\xampp\htdocs\Cilengkrang-Web-Wisata\admin\jenis_tiket\kelola_jenis_tiket.php

// 1. Sertakan config.php pertama kali
if (!require_once __DIR__ . '/../../config/config.php') {
    http_response_code(503);
    error_log("FATAL ERROR di kelola_jenis_tiket.php: Gagal memuat config.php.");
    exit("Kesalahan konfigurasi server.");
}

// 2. Pastikan hanya admin yang bisa akses
require_admin();

// 3. Sertakan JenisTiketController
if (!class_exists('JenisTiketController')) {
    $controllerPath = CONTROLLERS_PATH . '/JenisTiketController.php';
    if (file_exists($controllerPath)) require_once $controllerPath;
    else {
        error_log("FATAL ERROR: File JenisTiketController.php tidak ditemukan.");
        set_flash_message('danger', 'Kesalahan sistem: Komponen inti tidak dapat dimuat.');
        redirect(ADMIN_URL . '/dashboard.php');
        exit;
    }
}

// 4. Set judul halaman
$pageTitle = "Kelola Jenis Tiket";

// 5. Sertakan header admin
require_once ROOT_PATH . '/template/header_admin.php';

// === PENANGANAN PENCARIAN ===
$search_term = isset($_GET['search']) ? trim($_GET['search']) : null;
// === AKHIR PENANGANAN ===

// 6. Ambil semua data jenis tiket melalui Controller
$daftar_jenis_tiket = [];
$error_jenis_tiket = null;

if (!method_exists('JenisTiketController', 'getAllForAdmin')) {
    $error_jenis_tiket = 'Kesalahan sistem: Fungsi untuk mengambil data jenis tiket tidak tersedia.';
} else {
    try {
        // Panggil controller dengan parameter pencarian
        $daftar_jenis_tiket = JenisTiketController::getAllForAdmin($search_term);

        if ($daftar_jenis_tiket === false) {
            $daftar_jenis_tiket = [];
            $error_jenis_tiket = "Gagal mengambil data jenis tiket. " . (method_exists('JenisTiket', 'getLastError') ? JenisTiket::getLastError() : 'Periksa log server.');
        }
    } catch (Exception $e) {
        $error_jenis_tiket = "Terjadi exception: " . $e->getMessage();
        $daftar_jenis_tiket = [];
    }
}
?>

<!-- Breadcrumb -->
<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= e(ADMIN_URL . '/dashboard.php') ?>"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
        <li class="breadcrumb-item active" aria-current="page"><i class="fas fa-tags"></i> Kelola Jenis Tiket</li>
    </ol>
</nav>

<div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0" style="color: var(--admin-text-primary);">Daftar Jenis Tiket</h1>
    <a href="<?= e(ADMIN_URL . '/jenis_tiket/tambah_jenis_tiket.php') ?>" class="btn btn-success">
        <i class="fas fa-plus me-1"></i> Tambah Jenis Tiket Baru
    </a>
</div>

<?php display_flash_message(); ?>

<?php if ($error_jenis_tiket): ?>
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <i class="fas fa-exclamation-triangle me-2"></i><?= e($error_jenis_tiket) ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
<?php endif; ?>

<!-- === FORM PENCARIAN BARU === -->
<div class="card shadow-sm mb-4">
    <div class="card-body">
        <form action="<?= e(ADMIN_URL . 'jenis_tiket/kelola_jenis_tiket.php') ?>" method="GET" class="row g-3 align-items-center">
            <div class="col">
                <div class="input-group">
                    <span class="input-group-text bg-light"><i class="fas fa-search"></i></span>
                    <input type="text" name="search" class="form-control" placeholder="Cari Nama Layanan, Tipe Hari, atau Destinasi..." value="<?= e($search_term ?? '') ?>">
                </div>
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-primary">Cari</button>
            </div>
            <?php if ($search_term): ?>
                <div class="col-auto">
                    <a href="<?= e(ADMIN_URL . 'jenis_tiket/kelola_jenis_tiket.php') ?>" class="btn btn-outline-secondary">Reset</a>
                </div>
            <?php endif; ?>
        </form>
    </div>
</div>
<!-- === AKHIR FORM PENCARIAN === -->


<div class="card shadow mb-4">
    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
        <h6 class="m-0 fw-bold text-primary">
            <i class="fas fa-list me-2"></i>
            <?php if ($search_term): ?>
                Hasil Pencarian untuk "<?= e($search_term) ?>"
            <?php else: ?>
                Jenis Tiket Tersedia
            <?php endif; ?>
        </h6>
        <span class="badge bg-info rounded-pill"><?= is_array($daftar_jenis_tiket) ? count($daftar_jenis_tiket) : 0 ?> Item</span>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-bordered table-hover table-striped" id="dataTableJenisTiket" width="100%" cellspacing="0">
                <thead class="table-dark">
                    <tr>
                        <th style="width: 3%;">No.</th>
                        <th style="width: 5%;">ID</th>
                        <th style="width: 20%;">Nama Layanan</th>
                        <th style="width: 15%;">Tipe Hari</th>
                        <th scope="col" class="text-end" style="width: 12%;">Harga</th>
                        <th scope="col">Destinasi Terkait</th>
                        <th scope="col" class="text-center" style="width: 10%;">Status</th>
                        <th scope="col" style="width: 10%;">Dibuat</th>
                        <th scope="col" style="width: 15%;" class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (!empty($daftar_jenis_tiket)): ?>
                        <?php $nomor_urut_visual = 1; ?>
                        <?php foreach ($daftar_jenis_tiket as $jenis): ?>
                            <tr>
                                <td class="text-center"><?= $nomor_urut_visual++ ?></td>
                                <th scope="row"><?= e($jenis['id']) ?></th>
                                <td><?= e($jenis['nama_layanan_display']) ?></td>
                                <td><?= e($jenis['tipe_hari']) ?></td>
                                <td class="text-end"><?= e(formatRupiah($jenis['harga'])) ?></td>
                                <td><?= e($jenis['nama_wisata_terkait'] ?? 'Umum/Tidak Spesifik') ?></td>
                                <td class="text-center">
                                    <span class="badge bg-<?= ($jenis['aktif'] ?? 0) == 1 ? 'success' : 'danger' ?>">
                                        <?= ($jenis['aktif'] ?? 0) == 1 ? 'Aktif' : 'Tidak Aktif' ?>
                                    </span>
                                </td>
                                <td><?= e(formatTanggalIndonesia($jenis['created_at'] ?? null, false, true)) ?></td>
                                <td class="text-center">
                                    <div class="btn-group btn-group-sm">
                                        <a href="<?= e(ADMIN_URL . '/jenis_tiket/edit_jenis_tiket.php?id=' . $jenis['id']) ?>" class="btn btn-warning" title="Edit Jenis Tiket">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <a href="<?= e(ADMIN_URL . '/jenis_tiket/hapus_jenis_tiket.php?id=' . $jenis['id']) ?>&csrf_token=<?= e(generate_csrf_token()) ?>" class="btn btn-danger" title="Hapus Jenis Tiket"
                                            onclick="return confirm('PERHATIAN: Hapus jenis tiket ini? Pastikan tidak ada jadwal atau pemesanan yang masih menggunakannya. Yakin ingin hapus \'<?= e(addslashes($jenis['nama_layanan_display'] . ' - ' . $jenis['tipe_hari'])) ?>\'?')">
                                            <i class="fas fa-trash-alt"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="9" class="text-center py-4">
                                <?php if ($search_term): ?>
                                    <p class="mb-2 lead">Tidak ditemukan jenis tiket yang cocok dengan "<strong><?= e($search_term) ?></strong>".</p>
                                    <a href="<?= e(ADMIN_URL . 'jenis_tiket/kelola_jenis_tiket.php') ?>" class="btn btn-primary btn-sm">Tampilkan Semua</a>
                                <?php else: ?>
                                    <p class="mb-2 lead">Belum ada jenis tiket yang ditambahkan.</p>
                                    <a href="<?= e(ADMIN_URL . '/jenis_tiket/tambah_jenis_tiket.php') ?>" class="btn btn-primary btn-sm">
                                        <i class="fas fa-plus me-1"></i> Tambah Jenis Tiket Pertama
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
require_once ROOT_PATH . '/template/footer_admin.php';
?>