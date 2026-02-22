import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";

interface AdminStats {
    totalWisata: number;
    totalArtikel: number;
    totalUser: number;
    totalPemesanan: number;
    totalPendapatan: number;
    pemesananPending: number;
    pesananHariIni: number;
    contactBelumDibaca: number;
    feedbackCount: number;
    galeriCount: number;
    recentOrders: {
        id: number;
        kodePemesanan: string;
        status: string;
        totalHargaAkhir: number;
        createdAt: string;
        user: { nama: string; email: string } | null;
    }[];
}

export default function AdminDashboard() {
    const { data: stats, loading } = useFetch<AdminStats>("/stats/admin");

    const statCards = [
        { title: "Total Wisata", value: stats?.totalWisata ?? 0, icon: "fa-map-location-dot", color: "success", link: "/admin/wisata" },
        { title: "Total Artikel", value: stats?.totalArtikel ?? 0, icon: "fa-newspaper", color: "info", link: "/admin/articles" },
        { title: "Total User", value: stats?.totalUser ?? 0, icon: "fa-users", color: "primary", link: "/admin/users" },
        { title: "Pemesanan", value: stats?.totalPemesanan ?? 0, icon: "fa-ticket", color: "warning", link: "/admin/tickets" },
        { title: "Pending", value: stats?.pemesananPending ?? 0, icon: "fa-clock", color: "danger", link: "/admin/tickets" },
        { title: "Hari Ini", value: stats?.pesananHariIni ?? 0, icon: "fa-calendar-day", color: "dark", link: "/admin/tickets" },
    ];

    const quickMenu = [
        { title: "Kelola Wisata", icon: "fa-map-location-dot", link: "/admin/wisata", color: "success" },
        { title: "Kelola Artikel", icon: "fa-newspaper", link: "/admin/articles", color: "info" },
        { title: "Kelola Tiket", icon: "fa-ticket", link: "/admin/tickets", color: "warning" },
        { title: "Kelola User", icon: "fa-users", link: "/admin/users", color: "primary" },
        { title: "Galeri", icon: "fa-images", link: "/admin/galeri", color: "secondary" },
        { title: "Feedback", icon: "fa-comments", link: "/admin/feedback", color: "dark" },
    ];

    const statusBadge = (status: string) => {
        const map: Record<string, string> = {
            PENDING: "bg-warning text-dark",
            PAID: "bg-success",
            CONFIRMED: "bg-primary",
            COMPLETED: "bg-info",
            CANCELLED: "bg-danger",
            EXPIRED: "bg-secondary",
        };
        return map[status] || "bg-secondary";
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                <div className="spinner-border text-success" role="status" />
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Dashboard Admin</h2>
                    <p className="text-muted mb-0">Panel kontrol pengelolaan sistem wisata</p>
                </div>
                <span className="badge bg-success rounded-pill px-3 py-2">
                    <i className="fas fa-check-circle me-1"></i> System Online
                </span>
            </div>

            {/* Stats Cards */}
            <div className="row g-3 mb-4">
                {statCards.map((card, idx) => (
                    <div key={idx} className="col-6 col-md-4 col-lg-2">
                        <Link to={card.link} className="text-decoration-none">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body text-center py-3">
                                    <div className={`d-inline-flex align-items-center justify-content-center bg-${card.color} bg-opacity-10 rounded-circle mb-2`} style={{ width: "44px", height: "44px" }}>
                                        <i className={`fas ${card.icon} text-${card.color}`}></i>
                                    </div>
                                    <h3 className={`fw-bold mb-0 text-${card.color}`}>{card.value}</h3>
                                    <small className="text-muted">{card.title}</small>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Revenue Card */}
            <div className="card border-0 shadow-sm mb-4" style={{ background: "linear-gradient(135deg, #198754 0%, #0f5132 100%)" }}>
                <div className="card-body p-4 text-white d-flex justify-content-between align-items-center">
                    <div>
                        <p className="mb-1 opacity-75 small">Total Pendapatan</p>
                        <h2 className="fw-bold mb-0">Rp {(stats?.totalPendapatan ?? 0).toLocaleString("id-ID")}</h2>
                    </div>
                    <i className="fas fa-money-bill-wave fa-3x opacity-25"></i>
                </div>
            </div>

            <div className="row g-4 mb-4">
                {/* Recent Orders */}
                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                            <h6 className="fw-bold mb-0">Pemesanan Terbaru</h6>
                            <Link to="/admin/tickets" className="btn btn-sm btn-outline-success rounded-pill">Lihat Semua</Link>
                        </div>
                        <div className="card-body p-0">
                            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="border-0 small text-muted">Kode</th>
                                                <th className="border-0 small text-muted">Pemesan</th>
                                                <th className="border-0 small text-muted">Total</th>
                                                <th className="border-0 small text-muted">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.recentOrders.map((order) => (
                                                <tr key={order.id}>
                                                    <td className="small fw-semibold">#{order.kodePemesanan}</td>
                                                    <td className="small">{order.user?.nama || "Tamu"}</td>
                                                    <td className="small">Rp {order.totalHargaAkhir.toLocaleString("id-ID")}</td>
                                                    <td><span className={`badge ${statusBadge(order.status)} rounded-pill`}>{order.status}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center text-muted py-5">
                                    <i className="fas fa-inbox fa-2x mb-2 opacity-50"></i>
                                    <p className="mb-0 small">Belum ada pemesanan.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Menu */}
                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 py-3">
                            <h6 className="fw-bold mb-0">Menu Cepat</h6>
                        </div>
                        <div className="card-body">
                            <div className="row g-2">
                                {quickMenu.map((item, idx) => (
                                    <div key={idx} className="col-6">
                                        <Link to={item.link} className="text-decoration-none">
                                            <div className="border rounded p-3 text-center h-100 quick-menu-item"
                                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
                                            >
                                                <i className={`fas ${item.icon} fa-lg text-${item.color} mb-2`}></i>
                                                <div className="small fw-semibold">{item.title}</div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Info */}
            <div className="row g-3">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body d-flex align-items-center gap-3">
                            <div className="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px", minWidth: "48px" }}>
                                <i className="fas fa-envelope text-warning"></i>
                            </div>
                            <div>
                                <div className="small text-muted">Pesan Belum Dibaca</div>
                                <h5 className="fw-bold mb-0">{stats?.contactBelumDibaca ?? 0}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body d-flex align-items-center gap-3">
                            <div className="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px", minWidth: "48px" }}>
                                <i className="fas fa-comments text-info"></i>
                            </div>
                            <div>
                                <div className="small text-muted">Total Feedback</div>
                                <h5 className="fw-bold mb-0">{stats?.feedbackCount ?? 0}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body d-flex align-items-center gap-3">
                            <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px", minWidth: "48px" }}>
                                <i className="fas fa-images text-primary"></i>
                            </div>
                            <div>
                                <div className="small text-muted">Foto Galeri</div>
                                <h5 className="fw-bold mb-0">{stats?.galeriCount ?? 0}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
