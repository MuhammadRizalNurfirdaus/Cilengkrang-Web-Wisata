import { useAuth } from "../../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import Card from "../../components/ui/Card";

export default function UserDashboard() {
    const { user } = useAuth();

    // Protect route (basic check, ideally handled by a ProtectedRoute wrapper)
    if (!user) {
        return <Navigate to="/login" />;
    }

    const menuItems = [
        {
            title: "Riwayat Tiket",
            icon: "fa-history",
            desc: "Lihat riwayat pemesanan tiket Anda",
            link: "/user/history",
            color: "bg-primary"
        },
        {
            title: "Profil Saya",
            icon: "fa-user-circle",
            desc: "Update informasi profil akun Anda",
            link: "/user/profile",
            color: "bg-info"
        },
        {
            title: "Pesan Tiket",
            icon: "fa-ticket-alt",
            desc: "Cari destinasi dan pesan tiket baru",
            link: "/destinations",
            color: "bg-success"
        }
    ];

    return (
        <div className="container py-5 mt-5">
            <div className="row mb-5">
                <div className="col-lg-12">
                    <div className="card border-0 shadow-sm bg-success text-white overflow-hidden position-relative">
                        <div className="card-body p-5 position-relative z-1">
                            <h2 className="fw-bold display-6">Halo, {user.nama}!</h2>
                            <p className="lead mb-0 opacity-75">Selamat datang di Dashboard Pengunjung.</p>
                        </div>
                        <div className="position-absolute end-0 bottom-0 p-4 opacity-25">
                            <i className="fas fa-leaf fa-10x"></i>
                        </div>
                    </div>
                </div>
            </div>

            <h4 className="fw-bold text-muted mb-4">Menu Utama</h4>
            <div className="row g-4">
                {menuItems.map((item, idx) => (
                    <div key={idx} className="col-md-4">
                        <Link to={item.link} className="text-decoration-none">
                            <div className="card border-0 shadow-sm hover-shadow h-100">
                                <div className="card-body d-flex align-items-center p-4">
                                    <div className={`rounded-circle ${item.color} bg-opacity-10 text-white d-flex align-items-center justify-content-center me-3 p-3 shadow-sm`} style={{ width: "60px", height: "60px" }}>
                                        <i className={`fas ${item.icon} fa-lg ${item.color.replace('bg-', 'text-')}`}></i>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-1 text-dark">{item.title}</h5>
                                        <p className="text-muted small mb-0">{item.desc}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Recent Activity Placeholder */}
            <div className="mt-5">
                <h4 className="fw-bold text-muted mb-4">Aktivitas Terakhir</h4>
                <div className="card border-0 shadow-sm p-5 text-center text-muted">
                    <i className="fas fa-clipboard-list fa-3x mb-3 opacity-50"></i>
                    <p className="mb-0">Belum ada aktivitas pemesanan tiket.</p>
                    <Link to="/destinations" className="btn btn-outline-success btn-sm mt-3 rounded-pill">
                        Mulai Jelajahi
                    </Link>
                </div>
            </div>
        </div>
    );
}
