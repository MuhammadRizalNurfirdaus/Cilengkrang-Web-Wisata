import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/public/Home";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

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

import History from "./pages/user/History";

const NotFound = () => <div className="pt-5 mt-5 container text-center"><h1>404 Not Found</h1></div>;

// Layout Component
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
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/destinations" element={<AllDestinations />} />
        <Route path="/destinations/:id" element={<DestinationDetail />} />

        <Route path="/gallery" element={<Gallery />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
      </Route>

      {/* User Routes (Customer) */}
      <Route path="/user" element={<PublicLayout />}>
        <Route path="dashboard" element={
          <ProtectedRoute allowedRoles={["user", "admin", "kasir", "owner"]}>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <div className="pt-5 mt-5 container"><h1>Profil Saya</h1></div>
          </ProtectedRoute>
        } />
        <Route path="history" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } />
      </Route>

      {/* Booking Route */}
      <Route path="/booking" element={
        <ProtectedRoute>
          <Booking />
        </ProtectedRoute>
      } />
      <Route path="/booking/:wisataId" element={
        <ProtectedRoute>
          <Booking />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={<PublicLayout />}>
        <Route path="dashboard" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="wisata" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminWisataList />
          </ProtectedRoute>
        } />
        <Route path="wisata/create" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminWisataForm />
          </ProtectedRoute>
        } />
        <Route path="wisata/edit/:id" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminWisataForm />
          </ProtectedRoute>
        } />
        <Route path="articles" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminArticleList />
          </ProtectedRoute>
        } />
        <Route path="articles/create" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminArticleForm />
          </ProtectedRoute>
        } />
        <Route path="articles/edit/:id" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminArticleForm />
          </ProtectedRoute>
        } />
        <Route path="tickets" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminTicketList />
          </ProtectedRoute>
        } />
        <Route path="users" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUserList />
          </ProtectedRoute>
        } />
      </Route>

      {/* Kasir Routes */}
      <Route path="/kasir" element={<PublicLayout />}>
        <Route path="dashboard" element={
          <ProtectedRoute allowedRoles={["kasir", "admin"]}>
            <KasirDashboard />
          </ProtectedRoute>
        } />
        <Route path="pemesanan" element={
          <ProtectedRoute allowedRoles={["kasir", "admin"]}>
            <KasirPemesanan />
          </ProtectedRoute>
        } />
        <Route path="konfirmasi/:id" element={
          <ProtectedRoute allowedRoles={["kasir", "admin"]}>
            <KasirKonfirmasi />
          </ProtectedRoute>
        } />
      </Route>

      {/* Owner Routes */}
      <Route path="/owner" element={<PublicLayout />}>
        <Route path="dashboard" element={
          <ProtectedRoute allowedRoles={["owner", "admin"]}>
            <OwnerDashboard />
          </ProtectedRoute>
        } />
        <Route path="laporan" element={
          <ProtectedRoute allowedRoles={["owner", "admin"]}>
            <OwnerLaporan />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Placeholder components for Kasir
const KasirDashboard = () => (
  <div className="pt-5 mt-5 container">
    <h1 className="mb-4">Dashboard Kasir</h1>
    <div className="row g-4">
      <div className="col-md-4">
        <div className="card bg-primary text-white">
          <div className="card-body">
            <h5 className="card-title">Pemesanan Menunggu</h5>
            <h2 className="display-4">0</h2>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card bg-success text-white">
          <div className="card-body">
            <h5 className="card-title">Dikonfirmasi Hari Ini</h5>
            <h2 className="display-4">0</h2>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card bg-info text-white">
          <div className="card-body">
            <h5 className="card-title">Total Pendapatan Hari Ini</h5>
            <h2 className="display-4">Rp 0</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const KasirPemesanan = () => (
  <div className="pt-5 mt-5 container">
    <h1>Daftar Pemesanan</h1>
    <p className="text-muted">Kelola dan konfirmasi pemesanan tiket di sini.</p>
  </div>
);

const KasirKonfirmasi = () => (
  <div className="pt-5 mt-5 container">
    <h1>Konfirmasi Pembayaran</h1>
  </div>
);

// Placeholder components for Owner
const OwnerDashboard = () => (
  <div className="pt-5 mt-5 container">
    <h1 className="mb-4">Dashboard Owner</h1>
    <div className="row g-4">
      <div className="col-md-3">
        <div className="card border-primary">
          <div className="card-body text-center">
            <i className="fas fa-users fa-3x text-primary mb-3"></i>
            <h5>Total Pengunjung</h5>
            <h3 className="text-primary">0</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card border-success">
          <div className="card-body text-center">
            <i className="fas fa-money-bill-wave fa-3x text-success mb-3"></i>
            <h5>Total Pendapatan</h5>
            <h3 className="text-success">Rp 0</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card border-info">
          <div className="card-body text-center">
            <i className="fas fa-ticket-alt fa-3x text-info mb-3"></i>
            <h5>Tiket Terjual</h5>
            <h3 className="text-info">0</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card border-warning">
          <div className="card-body text-center">
            <i className="fas fa-star fa-3x text-warning mb-3"></i>
            <h5>Rating</h5>
            <h3 className="text-warning">0.0</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const OwnerLaporan = () => (
  <div className="pt-5 mt-5 container">
    <h1>Laporan</h1>
    <p className="text-muted">Lihat laporan pendapatan dan statistik pengunjung.</p>
  </div>
);

export default App;
