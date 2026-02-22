import { useAuth } from "../../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";

interface UserStats {
    totalPemesanan: number;
    pemesananPending: number;
    totalBelanja: number;
    recentOrders: {
        id: number;
        kodePemesanan: string;
        status: string;
        totalHargaAkhir: number;
        tanggalKunjungan: string;
        createdAt: string;
        detailPemesanan: { jumlah: number; jenisTiket?: { namaLayananDisplay: string } }[];
    }[];
}

export default function UserDashboard() {
    const { user } = useAuth();
    const { data: stats, loading } = useFetch<UserStats>(
        user ? `/stats/user/${user.id}` : null
    );

    if (!user) {
        return <Navigate to="/login" />;
    }

    const menuItems = [
        {
            title: "Riwayat Tiket",
            icon: "fa-history",
            desc: "Lihat riwayat pemesanan tiket Anda",
            link: "/user/history",
            color: "primary"
        },
        {
            title: "Profil Saya",
            icon: "fa-user-circle",
            desc: "Kelola informasi profil akun Anda",
            link: "/user/profile",
            color: "info"
        },
        {
            title: "Pesan Tiket",
            icon: "fa-ticket-alt",
            desc: "Cari destinasi dan pesan tiket baru",
            link: "/destinations",
            color: "success"
        }
    ];

    const statusLabel = (s: string) => {
        const map: Record<string, { badge: string; text: string }> = {
            PENDING: { badge: "bg-warning text-dark", text: "Menunggu" },
            PAID: { badge: "bg-success", text: "Dibayar" },
            CONFIRMED: { badge: "bg-primary", text: "Dikonfirmasi" },
            COMPLETED: { badge: "bg-info", text: "Selesai" },
            CANCELLED: { badge: "bg-danger", text: "Dibatalkan" },
        };
        return map[s] || { badge: "bg-secondary", text: s };
    };

    return (
        <div className="container py-5 mt-5">
            {/* Hero Banner */}
            <div className="row mb-5">
                <div className="col-lg-12">
                    <div
                        className="card border-0 shadow-sm overflow-hidden position-relative"
                        style={{
                            background: "linear-gradient(135deg, #198754 0%, #0f5132 100%)",
                            minHeight: "180px",
                        }}
                    >
                        <div className="card-body p-5 position-relative z-1">
                            <h2 className="fw-bold display-6 text-white mb-2">
                                Halo, {user.nama}!
                            </h2>
                            <p className="lead mb-0 text-white" style={{ opacity: 0.85 }}>
                                Selamat datang di Dashboard Pengunjung.
                            </p>
                        </div>
                        <div className="position-absolute end-0 bottom-0 p-4" style={{ opacity: 0.15 }}>
                            <i className="fas fa-leaf fa-10x text-white"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="row g-3 mb-5">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body d-flex align-items-center gap-3 p-4">
                            <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "52px", height: "52px", minWidth: "52px" }}>
                                <i className="fas fa-ticket-alt fa-lg text-primary"></i>
                            </div>
                            <div>
                                <div className="text-muted small">Total Pesanan</div>
                                <h4 className="fw-bold mb-0">{loading ? "..." : stats?.totalPemesanan ?? 0}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body d-flex align-items-center gap-3 p-4">
                            <div className="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "52px", height: "52px", minWidth: "52px" }}>
                                <i className="fas fa-clock fa-lg text-warning"></i>
                            </div>
                            <div>
                                <div className="text-muted small">Menunggu Bayar</div>
                                <h4 className="fw-bold mb-0">{loading ? "..." : stats?.pemesananPending ?? 0}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body d-flex align-items-center gap-3 p-4">
                            <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "52px", height: "52px", minWidth: "52px" }}>
                                <i className="fas fa-wallet fa-lg text-success"></i>
                            </div>
                            <div>
                                <div className="text-muted small">Total Belanja</div>
                                <h4 className="fw-bold mb-0">Rp {loading ? "..." : (stats?.totalBelanja ?? 0).toLocaleString("id-ID")}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Utama */}
            <h4 className="fw-bold mb-4">Menu Utama</h4>
            <div className="row g-4">
                {menuItems.map((item, idx) => (
                    <div key={idx} className="col-md-4">
                        <Link to={item.link} className="text-decoration-none">
                            <div className="card border-0 shadow-sm h-100 transition-all"
                                 style={{ transition: "transform .2s, box-shadow .2s" }}
                                 onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 .5rem 1rem rgba(0,0,0,.25)"; }}
                                 onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ""; }}
                            >
                                <div className="card-body text-center py-4">
                                    <div
                                        className={`d-inline-flex align-items-center justify-content-center rounded-circle bg-${item.color} bg-opacity-10 mb-3`}
                                        style={{ width: "64px", height: "64px" }}
                                    >
                                        <i className={`fas ${item.icon} fa-xl text-${item.color}`}></i>
                                    </div>
                                    <h5 className="fw-bold mb-1">{item.title}</h5>
                                    <p className="text-muted small mb-0">{item.desc}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Aktivitas Terakhir */}
            <div className="mt-5">
                <h4 className="fw-bold mb-4">Aktivitas Terakhir</h4>
                {loading ? (
                    <div className="text-center py-4"><div className="spinner-border text-success spinner-border-sm"></div></div>
                ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
                    <div className="row g-3">
                        {stats.recentOrders.map((order) => {
                            const sl = statusLabel(order.status);
                            return (
                                <div key={order.id} className="col-12">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body d-flex justify-content-between align-items-center p-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "44px", height: "44px", minWidth: "44px" }}>
                                                    <i className="fas fa-ticket-alt text-success"></i>
                                                </div>
                                                <div>
                                                    <div className="fw-semibold small">#{order.kodePemesanan}</div>
                                                    <div className="text-muted" style={{ fontSize: "12px" }}>
                                                        {new Date(order.tanggalKunjungan).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                                        {order.detailPemesanan?.map((d, i) => (
                                                            <span key={i}> &middot; {d.jenisTiket?.namaLayananDisplay} x{d.jumlah}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <div className="fw-bold small text-success">Rp {order.totalHargaAkhir.toLocaleString("id-ID")}</div>
                                                <span className={`badge ${sl.badge} rounded-pill mt-1`} style={{ fontSize: "10px" }}>{sl.text}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="col-12 text-center">
                            <Link to="/user/history" className="btn btn-outline-success btn-sm rounded-pill px-4 mt-2">
                                Lihat Semua Riwayat <i className="fas fa-arrow-right ms-1"></i>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="card border-0 shadow-sm p-5 text-center text-muted">
                        <i className="fas fa-clipboard-list fa-3x mb-3 opacity-50"></i>
                        <p className="mb-0">Belum ada aktivitas pemesanan tiket.</p>
                        <Link to="/destinations" className="btn btn-outline-success btn-sm mt-3 rounded-pill px-4">
                            Mulai Jelajahi
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
