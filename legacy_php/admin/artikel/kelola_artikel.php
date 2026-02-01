<?php
// File: C:\xampp\htdocs\Cilengkrang-Web-Wisata\admin\artikel\kelola_artikel.php

// 1. Sertakan config.php pertama kali
if (!require_once __DIR__ . '/../../config/config.php') {
    http_response_code(503);
    error_log("FATAL ERROR di kelola_artikel.php: Gagal memuat config.php.");
    exit("Kesalahan konfigurasi server.");
}

// 2. Pastikan hanya admin yang bisa akses
require_admin();

// 3. Pastikan Model Artikel ada
if (!class_exists('Artikel')) {
    error_log("FATAL ERROR di kelola_artikel.php: Kelas Model Artikel tidak ditemukan.");
    set_flash_message('danger', 'Kesalahan sistem: Komponen data artikel tidak dapat dimuat.');
    redirect(ADMIN_URL . '/dashboard.php');
    exit;
}

// 4. Set judul halaman
$pageTitle = "Kelola Artikel";

// 5. Sertakan header admin
require_once ROOT_PATH . '/template/header_admin.php';

// === PENANGANAN PENCARIAN ===
$search_term = isset($_GET['search']) ? trim($_GET['search']) : null;
// === AKHIR PENANGANAN PENCARIAN ===

// 6. Ambil semua data artikel
$artikel_list = [];
$error_artikel = null;

try {
    if (method_exists('Artikel', 'getAll')) {
        // Panggilan yang sudah benar, sesuai dengan definisi method baru
        $artikel_list = Artikel::getAll($search_term, 'created_at DESC');

        if ($artikel_list === false) {
            $artikel_list = [];
            $db_error_detail = method_exists('Artikel', 'getLastError') ? Artikel::getLastError() : 'Tidak ada detail error.';
            $error_artikel = "Gagal mengambil data artikel: " . ($db_error_detail ?: '');
            error_log("Error di kelola_artikel.php saat Artikel::getAll(): " . $error_artikel);
        }
    } else {
        $error_artikel = "Kesalahan sistem: Fungsi data artikel tidak tersedia.";
        error_log("FATAL ERROR di kelola_artikel.php: Metode Artikel::getAll() tidak ada.");
    }
} catch (Exception $e) {
    $error_artikel = "Terjadi kesalahan sistem (exception): " . $e->getMessage();
    error_log("Error di kelola_artikel.php (Exception): " . $e->getMessage() . "\nTrace: " . $e->getTraceAsString());
    $artikel_list = [];
}

?>

<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= e(ADMIN_URL . '/dashboard.php') ?>"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
        <li class="breadcrumb-item active" aria-current="page"><i class="fas fa-newspaper"></i> Kelola Daftar Artikel</li>
    </ol>
</nav>

<div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0" style="color: var(--admin-text-primary);">Kelola Daftar Artikel</h1>
    <a href="<?= e(ADMIN_URL . '/artikel/tambah_artikel.php') ?>" class="btn btn-success">
        <i class="fas fa-plus me-1"></i> Tambah Artikel Baru
    </a>
</div>

<?php display_flash_message(); ?>

<?php if ($error_artikel): ?>
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <i class="fas fa-exclamation-triangle me-2"></i><?= e($error_artikel) ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
<?php endif; ?>

<!-- === FORM PENCARIAN BARU === -->
<div class="card shadow-sm mb-4">
    <div class="card-body">
        <form action="<?= e(ADMIN_URL . '/artikel/kelola_artikel.php') ?>" method="GET" class="row g-3 align-items-center">
            <div class="col">
                <div class="input-group">
                    <span class="input-group-text bg-light"><i class="fas fa-search"></i></span>
                    <input type="text" name="search" class="form-control" placeholder="Cari berdasarkan Judul atau Isi Artikel..." value="<?= e($search_term ?? '') ?>">
                </div>
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-primary">Cari</button>
            </div>
            <?php if ($search_term): ?>
                <div class="col-auto">
                    <a href="<?= e(ADMIN_URL . '/artikel/kelola_artikel.php') ?>" class="btn btn-outline-secondary">Reset</a>
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
                Daftar Artikel Tersedia
            <?php endif; ?>
        </h6>
        <span class="badge bg-info rounded-pill"><?= is_array($artikel_list) ? count($artikel_list) : 0 ?> Artikel</span>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-bordered table-hover" id="dataTableArtikel" width="100%" cellspacing="0">
                <thead>
                    <tr>
                        <th style="width: 5%;">No.</th>
                        <th style="width: 10%;">ID</th>
                        <th>Judul</th>
                        <th>Isi (Ringkasan)</th>
                        <th style="width: 15%;">Gambar</th>
                        <th style="width: 15%;">Tanggal Publikasi</th>
                        <th style="width: 15%;" class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (!empty($artikel_list)): ?>
                        <?php $nomor = 1; ?>
                        <?php foreach ($artikel_list as $artikel): ?>
                            <tr>
                                <td><?= $nomor++ ?></td>
                                <td><?= e($artikel['id'] ?? 'N/A') ?></td>
                                <td><?= e($artikel['judul'] ?? 'Tanpa Judul') ?></td>
                                <td><?= e(function_exists('excerpt') ? excerpt($artikel['isi'] ?? '', 100) : mb_substr(strip_tags($artikel['isi'] ?? ''), 0, 100) . '...') ?></td>
                                <td>
                                    <?php if (!empty($artikel['gambar'])): ?>
                                        <?php
                                        $gambar_url = defined('UPLOADS_ARTIKEL_URL') ? UPLOADS_ARTIKEL_URL . $artikel['gambar'] : BASE_URL . 'public/uploads/artikel/' . $artikel['gambar'];
                                        ?>
                                        <img src="<?= e($gambar_url) ?>"
                                            alt="Gambar <?= e($artikel['judul'] ?? '') ?>"
                                            class="img-thumbnail"
                                            style="max-height: 70px; max-width: 100px; object-fit: cover; cursor: pointer;"
                                            onclick="showImageModal('<?= e($gambar_url) ?>', '<?= e(addslashes($artikel['judul'] ?? 'Gambar Artikel')) ?>')">
                                    <?php else: ?>
                                        <span class="text-muted fst-italic">Tidak ada gambar</span>
                                    <?php endif; ?>
                                </td>
                                <td><?= e(function_exists('formatTanggalIndonesia') ? formatTanggalIndonesia($artikel['created_at'] ?? null, true, true) : ($artikel['created_at'] ?? '-')) ?></td>
                                <td class="text-center">
                                    <div class="btn-group btn-group-sm">
                                        <a href="<?= e(ADMIN_URL . '/artikel/edit_artikel.php?id=' . ($artikel['id'] ?? '')) ?>" class="btn btn-warning" title="Edit Artikel">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        <a href="<?= e(ADMIN_URL . '/artikel/hapus_artikel.php?id=' . ($artikel['id'] ?? '')) ?>&csrf_token=<?= e(function_exists('generate_csrf_token') ? generate_csrf_token() : '') ?>"
                                            class="btn btn-danger" title="Hapus Artikel"
                                            onclick="return confirm('Apakah Anda yakin ingin menghapus artikel \" <?= e(addslashes($artikel['judul'] ?? 'ini')) ?>\"? Tindakan ini tidak dapat diurungkan.');">
                                            <i class="fas fa-trash"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="7" class="text-center py-4">
                                <?php if ($search_term): ?>
                                    <p class="mb-2 lead">Tidak ditemukan artikel yang cocok dengan "<strong><?= e($search_term) ?></strong>".</p>
                                    <a href="<?= e(ADMIN_URL . '/artikel/kelola_artikel.php') ?>" class="btn btn-primary btn-sm">Tampilkan Semua Artikel</a>
                                <?php elseif (!$error_artikel): ?>
                                    <p class="mb-2">Belum ada artikel yang ditambahkan.</p>
                                    <a href="<?= e(ADMIN_URL . '/artikel/tambah_artikel.php') ?>" class="btn btn-primary btn-sm">
                                        <i class="fas fa-plus me-1"></i> Buat Artikel Pertama
                                    </a>
                                <?php else: ?>
                                    <p class="mb-2 lead text-danger"><i class="fas fa-exclamation-triangle"></i> Gagal memuat data.</p>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal untuk menampilkan gambar lebih besar -->
<div class="modal fade" id="imagePreviewModal" tabindex="-1" aria-labelledby="imagePreviewModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="imagePreviewModalLabel">Pratinjau Gambar</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
                <img src="" id="imagePreviewSrc" class="img-fluid" alt="Pratinjau Gambar Artikel" style="max-height: 80vh;">
            </div>
        </div>
    </div>
</div>

<script>
    if (typeof showImageModal === 'undefined') {
        function showImageModal(src, title) {
            const modalEl = document.getElementById('imagePreviewModal');
            const modalTitleEl = document.getElementById('imagePreviewModalLabel');
            const modalImageEl = document.getElementById('imagePreviewSrc');

            if (modalEl && modalTitleEl && modalImageEl) {
                modalTitleEl.textContent = title || 'Pratinjau Gambar';
                modalImageEl.src = src;
                const bsModal = new bootstrap.Modal(modalEl);
                bsModal.show();
            }
        }
    }
</script>

<?php
require_once ROOT_PATH . '/template/footer_admin.php';
?>