import { useAuth } from "../../context/AuthContext";
import { Link, Navigate } from "react-router-dom";

export default function AdminDashboard() {
    const { user } = useAuth();

    if (!user || user.role !== "admin") {
        // Redirect non-admins
        return <Navigate to="/user/dashboard" />;
    }

    const adminMenu = [
        { title: "Kelola Wisata", icon: "fa-map-location-dot", link: "/admin/wisata", color: "success" },
        { title: "Kelola Artikel", icon: "fa-newspaper", link: "/admin/articles", color: "info" },
        { title: "Kelola Tiket", icon: "fa-ticket", link: "/admin/tickets", color: "warning" },
        { title: "Kelola User", icon: "fa-users", link: "/admin/users", color: "primary" },
        { title: "Verifikasi Pembayaran", icon: "fa-file-invoice-dollar", link: "/admin/payments", color: "danger" },
        { title: "Laporan", icon: "fa-chart-line", link: "/admin/reports", color: "dark" },
    ];

    return (
        <div className="container py-5 mt-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold text-success">Dashboard Admin</h2>
                    <p className="text-muted mb-0">Panel kontrol pengelolaan sistem wisata</p>
                </div>
                <div className="text-end">
                    <span className="badge bg-success rounded-pill px-3 py-2">
                        <i className="fas fa-check-circle me-1"></i> System Online
                    </span>
                </div>
            </div>

            <div className="row g-4 mb-5">
                {adminMenu.map((item, idx) => (
                    <div key={idx} className="col-md-4 col-lg-3">
                        <Link to={item.link} className="text-decoration-none">
                            <div className="card shadow-sm border-0 bg-white hover-shadow h-100 text-center py-4">
                                <div className="card-body">
                                    <div className={`d-inline-flex align-items-center justify-content-center bg-${item.color} bg-opacity-10 rounded-circle mb-3`} style={{ width: "70px", height: "70px" }}>
                                        <i className={`fas ${item.icon} fa-2x text-${item.color}`}></i>
                                    </div>
                                    <h6 className="fw-bold text-dark mb-0">{item.title}</h6>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="fw-bold mb-0">Statistik Kunjungan (Dummy)</h5>
                        </div>
                        <div className="card-body d-flex align-items-center justify-content-center text-muted" style={{ minHeight: "300px" }}>
                            Chart akan ditampilkan disini
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="fw-bold mb-0">Notifikasi Terbaru</h5>
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush small">
                                <li className="list-group-item px-0 border-0">
                                    <i className="fas fa-circle text-primary fa-xs me-2"></i> Pendaftaran user baru
                                </li>
                                <li className="list-group-item px-0 border-0">
                                    <i className="fas fa-circle text-warning fa-xs me-2"></i> Pesanan #ORD-123 menunggu pembayaran
                                </li>
                                <li className="list-group-item px-0 border-0">
                                    <i className="fas fa-circle text-success fa-xs me-2"></i> Pembayaran #PAY-999 dikonfirmasi
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
