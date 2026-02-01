<?php
// File: C:\xampp\htdocs\Cilengkrang-Web-Wisata\admin\users\kelola_users.php

// 1. Sertakan config.php pertama kali
if (!@require_once __DIR__ . '/../../config/config.php') {
    http_response_code(503);
    error_log("FATAL ERROR di kelola_users.php: Gagal memuat config.php.");
    exit("Kesalahan konfigurasi server.");
}

// 2. Pastikan hanya admin yang bisa akses
require_admin();

// 3. Pastikan Model User dan metode yang dibutuhkan ada
if (!class_exists('User') || !method_exists('User', 'getAll')) {
    set_flash_message('danger', 'Kesalahan sistem: Komponen data pengguna tidak dapat dimuat.');
    redirect(ADMIN_URL . 'dashboard.php');
    exit;
}

// 4. Set judul halaman
$pageTitle = "Kelola Pengguna";

// 5. Sertakan header admin
require_once ROOT_PATH . '/template/header_admin.php';

// === PENANGANAN PENCARIAN ===
$search_term = isset($_GET['search']) ? trim($_GET['search']) : null;
// === AKHIR PENANGANAN ===

// 6. Ambil semua data pengguna
$users = [];
$error_message_fetch_users = null;

try {
    // Panggil model dengan parameter pencarian
    $users = User::getAll($search_term, 'id', 'ASC');

    if ($users === false) {
        $users = [];
        $modelError = User::getLastError();
        $error_message_fetch_users = "Gagal mengambil data pengguna: " . e($modelError);
    }
} catch (Exception $e) {
    $users = [];
    $error_message_fetch_users = "Terjadi kesalahan teknis: " . e($e->getMessage());
}

$current_user_logged_in_id = get_current_user_id();
?>

<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= e(ADMIN_URL . 'dashboard.php') ?>"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
        <li class="breadcrumb-item active" aria-current="page"><i class="fas fa-users-cog"></i> Kelola Pengguna</li>
    </ol>
</nav>

<div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0" style="color: var(--admin-text-primary);">Daftar Pengguna</h1>
    <a href="<?= e(ADMIN_URL . 'users/tambah_user.php') ?>" class="btn btn-success">
        <i class="fas fa-plus me-1"></i> Tambah Pengguna Baru
    </a>
</div>

<?php display_flash_message(); ?>

<?php if ($error_message_fetch_users): ?>
    <div class="alert alert-danger"><?= e($error_message_fetch_users) ?></div>
<?php endif; ?>

<!-- === FORM PENCARIAN BARU === -->
<div class="card shadow-sm mb-4">
    <div class="card-body">
        <form action="<?= e(ADMIN_URL . 'users/kelola_users.php') ?>" method="GET" class="row g-3 align-items-center">
            <div class="col">
                <div class="input-group">
                    <span class="input-group-text bg-light"><i class="fas fa-search"></i></span>
                    <input type="text" name="search" class="form-control" placeholder="Cari Nama Pengguna, Nama Lengkap, atau Email..." value="<?= e($search_term ?? '') ?>">
                </div>
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-primary">Cari</button>
            </div>
            <?php if ($search_term): ?>
                <div class="col-auto">
                    <a href="<?= e(ADMIN_URL . 'users/kelola_users.php') ?>" class="btn btn-outline-secondary">Reset</a>
                </div>
            <?php endif; ?>
        </form>
    </div>
</div>
<!-- === AKHIR FORM PENCARIAN === -->


<div class="card shadow mb-4">
    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
        <h6 class="m-0 fw-bold text-primary">
            <i class="fas fa-users me-2"></i>
            <?php if ($search_term): ?>
                Hasil Pencarian untuk "<?= e($search_term) ?>"
            <?php else: ?>
                Data Pengguna Terdaftar
            <?php endif; ?>
        </h6>
        <span class="badge bg-info rounded-pill"><?= count($users) ?> Pengguna</span>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-bordered table-hover" id="dataTableUsers" width="100%" cellspacing="0">
                <thead class="table-dark">
                    <tr>
                        <th class="text-center">ID</th>
                        <th>Username</th>
                        <th>Nama Lengkap</th>
                        <th>Email</th>
                        <th>No. HP</th>
                        <th>Role</th>
                        <th>Status Akun</th>
                        <th>Tanggal Daftar</th>
                        <th class="text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (!empty($users)): ?>
                        <?php $csrf_token_for_get_actions = generate_csrf_token(); ?>
                        <?php foreach ($users as $user): ?>
                            <tr>
                                <td class="text-center align-middle"><?= e($user['id']) ?></td>
                                <td class="align-middle"><?= e($user['nama'] ?? 'N/A') ?></td>
                                <td class="align-middle"><?= e($user['nama_lengkap'] ?? '-') ?></td>
                                <td class="align-middle"><?= e($user['email']) ?></td>
                                <td class="align-middle"><?= e($user['no_hp'] ?? '-') ?></td>
                                <td class="align-middle">
                                    <span class="badge rounded-pill bg-<?= strtolower($user['role'] ?? '') === 'admin' ? 'danger' : 'success' ?>">
                                        <?= e(ucfirst($user['role'] ?? 'N/A')) ?>
                                    </span>
                                </td>
                                <td class="align-middle"><?= getStatusBadgeClassHTML($user['status_akun'] ?? 'N/A', 'N/A') ?></td>
                                <td class="align-middle"><?= e(formatTanggalIndonesia($user['created_at'] ?? null)) ?></td>
                                <td class="text-center align-middle">
                                    <div class="btn-group btn-group-sm">
                                        <a href="<?= e(ADMIN_URL . 'users/edit_user.php?id=' . $user['id']) ?>" class="btn btn-warning" title="Edit"><i class="fas fa-edit"></i></a>
                                        <a href="<?= e(ADMIN_URL . 'users/reset_password_user.php?id=' . $user['id']) ?>&csrf_token=<?= e($csrf_token_for_get_actions) ?>" class="btn btn-info" title="Reset Password" onclick="return confirm('Reset password untuk \'<?= e(addslashes($user['nama'] ?? '')) ?>\'?');"><i class="fas fa-key"></i></a>
                                        <?php if ($current_user_logged_in_id != $user['id'] && $user['id'] != 1): ?>
                                            <a href="<?= e(ADMIN_URL . 'users/hapus_user.php?id=' . $user['id']) ?>&csrf_token=<?= e($csrf_token_for_get_actions) ?>" class="btn btn-danger" title="Hapus" onclick="return confirm('Hapus pengguna \'<?= e(addslashes($user['nama'] ?? '')) ?>\'?');"><i class="fas fa-trash"></i></a>
                                        <?php endif; ?>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="9" class="text-center py-4">
                                <?php if ($search_term): ?>
                                    <p class="mb-2 lead">Tidak ada pengguna yang cocok dengan "<strong><?= e($search_term) ?></strong>".</p>
                                    <a href="<?= e(ADMIN_URL . 'users/kelola_users.php') ?>" class="btn btn-primary btn-sm">Tampilkan Semua Pengguna</a>
                                <?php else: ?>
                                    <p>Belum ada data pengguna yang terdaftar.</p>
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