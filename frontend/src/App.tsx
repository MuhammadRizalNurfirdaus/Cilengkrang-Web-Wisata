import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/layout/AdminLayout";
import ThemeToggleButton from "./components/ui/ThemeToggleButton";

import Home from "./pages/public/Home";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import GoogleCallback from "./pages/auth/GoogleCallback";

import AllDestinations from "./pages/public/AllDestinations";
import DestinationDetail from "./pages/public/DestinationDetail";

import UserDashboard from "./pages/user/UserDashboard";
import Booking from "./pages/user/Booking";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Contact from "./pages/public/Contact";

import Gallery from "./pages/public/Gallery";
import ArticleList from "./pages/public/ArticleList";
import ArticleDetail from "./pages/public/ArticleDetail";

import AdminWisataList from "./pages/admin/wisata/AdminWisataList";
import AdminWisataForm from "./pages/admin/wisata/AdminWisataForm";
import AdminArticleList from "./pages/admin/articles/AdminArticleList";
import AdminArticleForm from "./pages/admin/articles/AdminArticleForm";
import AdminTicketList from "./pages/admin/tickets/AdminTicketList";
import AdminUserList from "./pages/admin/users/AdminUserList";
import AdminGalleryList from "./pages/admin/gallery/AdminGalleryList";

import History from "./pages/user/History";
import Profile from "./pages/user/Profile";

const NotFound = () => (
  <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
    <div className="text-center">
      <h1 className="display-1 fw-bold text-success mb-0">404</h1>
      <h4 className="fw-bold mb-3">Halaman Tidak Ditemukan</h4>
      <p className="text-muted mb-4">Maaf, halaman yang Anda cari tidak tersedia.</p>
      <a href="/" className="btn btn-success rounded-pill px-4">
        <i className="fas fa-home me-2"></i>Kembali ke Beranda
      </a>
    </div>
  </div>
);

// Public Layout (Navbar + Footer)
const PublicLayout = () => (
  <div className="d-flex flex-column min-vh-100">
    <Navbar />
    <main className="flex-grow-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <>
    <ThemeToggleButton />
    <Routes>
      {/* ====== PUBLIC ROUTES (Navbar + Footer) ====== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />

        <Route path="/destinations" element={<AllDestinations />} />
        <Route path="/destinations/:id" element={<DestinationDetail />} />

        <Route path="/gallery" element={<Gallery />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
      </Route>

      {/* ====== USER ROUTES (Public layout - regular visitor) ====== */}
      <Route path="/user" element={<PublicLayout />}>
        <Route path="dashboard" element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <div className="container py-4 mt-5"><Profile /></div>
          </ProtectedRoute>
        } />
        <Route path="history" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } />
      </Route>

      {/* Booking Route (Public layout) */}
      <Route element={<PublicLayout />}>
        <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
      </Route>

      {/* ====== ADMIN ROUTES (Sidebar layout) ====== */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout role="admin" />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="wisata" element={<AdminWisataList />} />
        <Route path="wisata/create" element={<AdminWisataForm />} />
        <Route path="wisata/edit/:id" element={<AdminWisataForm />} />
        <Route path="articles" element={<AdminArticleList />} />
        <Route path="articles/create" element={<AdminArticleForm />} />
        <Route path="articles/edit/:id" element={<AdminArticleForm />} />
        <Route path="tickets" element={<AdminTicketList />} />
        <Route path="users" element={<AdminUserList />} />
        <Route path="galeri" element={<AdminGalleryList />} />
        <Route path="feedback" element={<AdminFeedbackPlaceholder />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* ====== KASIR ROUTES (Sidebar layout) ====== */}
      <Route path="/kasir" element={
        <ProtectedRoute allowedRoles={["kasir", "admin"]}>
          <AdminLayout role="kasir" />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<KasirDashboard />} />
        <Route path="pemesanan" element={<KasirPemesanan />} />
        <Route path="pembayaran" element={<KasirPembayaran />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* ====== OWNER ROUTES (Sidebar layout) ====== */}
      <Route path="/owner" element={
        <ProtectedRoute allowedRoles={["owner", "admin"]}>
          <AdminLayout role="owner" />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="laporan" element={<OwnerLaporan />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}

/* ================================
   PLACEHOLDER COMPONENTS
   ================================ */

// Admin placeholders
const AdminFeedbackPlaceholder = () => (
  <div>
    <h2 className="fw-bold mb-2">Feedback Pengunjung</h2>
    <p className="text-muted mb-4">Lihat ulasan dan rating dari pengunjung.</p>
    <div className="card border-0 shadow-sm p-5 text-center text-muted">
      <i className="fas fa-comments fa-3x mb-3 opacity-50"></i>
      <p>Fitur feedback sedang dalam pengembangan.</p>
    </div>
  </div>
);

// Kasir components
const KasirDashboard = () => (
  <div>
    <h2 className="fw-bold mb-4">Dashboard Kasir</h2>
    <div className="row g-4">
      <div className="col-md-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body d-flex align-items-center gap-3 p-4">
            <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: "56px", height: "56px" }}>
              <i className="fas fa-clock fa-xl text-primary"></i>
            </div>
            <div>
              <div className="text-muted small">Pemesanan Menunggu</div>
              <h3 className="fw-bold mb-0">0</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body d-flex align-items-center gap-3 p-4">
            <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: "56px", height: "56px" }}>
              <i className="fas fa-check-circle fa-xl text-success"></i>
            </div>
            <div>
              <div className="text-muted small">Dikonfirmasi Hari Ini</div>
              <h3 className="fw-bold mb-0">0</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body d-flex align-items-center gap-3 p-4">
            <div className="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: "56px", height: "56px" }}>
              <i className="fas fa-money-bill-wave fa-xl text-info"></i>
            </div>
            <div>
              <div className="text-muted small">Pendapatan Hari Ini</div>
              <h3 className="fw-bold mb-0">Rp 0</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="card border-0 shadow-sm mt-4">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-3">Pemesanan Terbaru</h5>
        <div className="text-center text-muted py-5">
          <i className="fas fa-inbox fa-3x mb-3 opacity-50"></i>
          <p>Belum ada pemesanan baru.</p>
        </div>
      </div>
    </div>
  </div>
);

const KasirPemesanan = () => (
  <div>
    <h2 className="fw-bold mb-2">Pemesanan Tiket</h2>
    <p className="text-muted mb-4">Kelola dan konfirmasi pemesanan tiket pengunjung.</p>
    <div className="card border-0 shadow-sm p-5 text-center text-muted">
      <i className="fas fa-ticket-alt fa-3x mb-3 opacity-50"></i>
      <p>Belum ada data pemesanan.</p>
    </div>
  </div>
);

const KasirPembayaran = () => (
  <div>
    <h2 className="fw-bold mb-2">Konfirmasi Pembayaran</h2>
    <p className="text-muted mb-4">Verifikasi dan konfirmasi pembayaran tiket.</p>
    <div className="card border-0 shadow-sm p-5 text-center text-muted">
      <i className="fas fa-credit-card fa-3x mb-3 opacity-50"></i>
      <p>Belum ada pembayaran yang perlu dikonfirmasi.</p>
    </div>
  </div>
);

// Owner components
const OwnerDashboard = () => (
  <div>
    <h2 className="fw-bold mb-4">Dashboard Owner</h2>
    <div className="row g-4">
      <div className="col-md-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center p-4">
            <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "56px", height: "56px" }}>
              <i className="fas fa-users fa-xl text-primary"></i>
            </div>
            <div className="text-muted small">Total Pengunjung</div>
            <h3 className="fw-bold mb-0 text-primary">0</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center p-4">
            <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "56px", height: "56px" }}>
              <i className="fas fa-money-bill-wave fa-xl text-success"></i>
            </div>
            <div className="text-muted small">Total Pendapatan</div>
            <h3 className="fw-bold mb-0 text-success">Rp 0</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center p-4">
            <div className="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "56px", height: "56px" }}>
              <i className="fas fa-ticket-alt fa-xl text-info"></i>
            </div>
            <div className="text-muted small">Tiket Terjual</div>
            <h3 className="fw-bold mb-0 text-info">0</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center p-4">
            <div className="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "56px", height: "56px" }}>
              <i className="fas fa-star fa-xl text-warning"></i>
            </div>
            <div className="text-muted small">Rating</div>
            <h3 className="fw-bold mb-0 text-warning">0.0</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const OwnerLaporan = () => (
  <div>
    <h2 className="fw-bold mb-2">Laporan Pendapatan</h2>
    <p className="text-muted mb-4">Statistik pendapatan dan kunjungan wisata.</p>
    <div className="card border-0 shadow-sm p-5 text-center text-muted">
      <i className="fas fa-chart-line fa-3x mb-3 opacity-50"></i>
      <p>Fitur laporan sedang dalam pengembangan.</p>
    </div>
  </div>
);

export default App;
