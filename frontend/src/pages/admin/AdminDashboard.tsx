import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";

interface RevenuePoint {
    key: string;
    label: string;
    revenue: number;
    orders: number;
}

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
    financialSummary: {
        current30Revenue: number;
        previous30Revenue: number;
        revenueGrowthPercent: number;
        current30Orders: number;
        previous30Orders: number;
        orderGrowthPercent: number;
        averageOrderValue: number;
        paidOrderCount30: number;
    };
    monthlyRevenue: RevenuePoint[];
    dailyRevenue: RevenuePoint[];
    statusBreakdown: Array<{
        status: string;
        count: number;
    }>;
    topDestinations: Array<{
        wisataId: number;
        nama: string;
        revenue: number;
        totalItem: number;
    }>;
}

function formatCurrency(value: number) {
    return `Rp ${value.toLocaleString("id-ID")}`;
}

function statusBadge(status: string) {
    const map: Record<string, string> = {
        PENDING: "bg-warning text-dark",
        WAITING_PAYMENT: "bg-secondary",
        PAID: "bg-success",
        CONFIRMED: "bg-primary",
        COMPLETED: "bg-info text-dark",
        CANCELLED: "bg-danger",
        EXPIRED: "bg-dark",
    };

    return map[status] || "bg-secondary";
}

function growthTone(value: number) {
    if (value > 0) {
        return "text-success";
    }

    if (value < 0) {
        return "text-danger";
    }

    return "text-muted";
}

function growthIcon(value: number) {
    if (value > 0) {
        return "fa-arrow-trend-up";
    }

    if (value < 0) {
        return "fa-arrow-trend-down";
    }

    return "fa-minus";
}

function buildTrendPoints(series: RevenuePoint[]) {
    if (series.length === 0) {
        return "";
    }

    const max = Math.max(...series.map((item) => item.revenue), 1);
    const step = series.length === 1 ? 0 : 100 / (series.length - 1);

    return series
        .map((item, index) => {
            const x = index * step;
            const y = 100 - (item.revenue / max) * 100;
            return `${x},${y}`;
        })
        .join(" ");
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

    const monthlyRevenue = stats?.monthlyRevenue || [];
    const dailyRevenue = stats?.dailyRevenue || [];
    const financialSummary = stats?.financialSummary;
    const trendPoints = buildTrendPoints(monthlyRevenue);
    const maxDailyRevenue = Math.max(...dailyRevenue.map((item) => item.revenue), 1);
    const totalStatus = (stats?.statusBreakdown || []).reduce((sum, item) => sum + item.count, 0) || 1;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                <div className="spinner-border text-success" role="status" />
            </div>
        );
    }

    return (
        <div className="admin-dashboard-page">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Dashboard Admin</h2>
                    <p className="text-muted mb-0">Ringkasan operasional, keuangan, dan performa konten terbaru.</p>
                </div>
                <span className="badge bg-success rounded-pill px-3 py-2">
                    <i className="fas fa-check-circle me-1"></i> System Online
                </span>
            </div>

            <section className="admin-finance-hero card border-0 shadow-sm mb-4">
                <div className="card-body p-4 p-lg-5">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-7">
                            <p className="small text-uppercase mb-2 admin-finance-kicker">Laporan Keuangan 30 Hari</p>
                            <h3 className="fw-bold mb-2">{formatCurrency(financialSummary?.current30Revenue || 0)}</h3>
                            <p className="mb-3 text-white-75">
                                Pendapatan periode berjalan dari transaksi berhasil, termasuk tiket terkonfirmasi dan selesai.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                <div className={`admin-growth-chip ${growthTone(financialSummary?.revenueGrowthPercent || 0)}`}>
                                    <i className={`fas ${growthIcon(financialSummary?.revenueGrowthPercent || 0)}`}></i>
                                    <span>{financialSummary?.revenueGrowthPercent || 0}% vs 30 hari sebelumnya</span>
                                </div>
                                <div className={`admin-growth-chip ${growthTone(financialSummary?.orderGrowthPercent || 0)}`}>
                                    <i className={`fas ${growthIcon(financialSummary?.orderGrowthPercent || 0)}`}></i>
                                    <span>{financialSummary?.orderGrowthPercent || 0}% jumlah pesanan</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="admin-finance-metrics">
                                <div className="admin-finance-metric">
                                    <span>Pesanan Sukses (30 hari)</span>
                                    <strong>{financialSummary?.paidOrderCount30 || 0}</strong>
                                </div>
                                <div className="admin-finance-metric">
                                    <span>Rata-Rata Nilai Pesanan</span>
                                    <strong>{formatCurrency(financialSummary?.averageOrderValue || 0)}</strong>
                                </div>
                                <div className="admin-finance-metric">
                                    <span>Total Pendapatan Keseluruhan</span>
                                    <strong>{formatCurrency(stats?.totalPendapatan || 0)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="row g-3 mb-4">
                {statCards.map((card) => (
                    <div key={card.title} className="col-6 col-md-4 col-lg-2">
                        <Link to={card.link} className="text-decoration-none">
                            <div className="card border-0 shadow-sm h-100 admin-stat-card">
                                <div className="card-body text-center py-3">
                                    <div
                                        className={`d-inline-flex align-items-center justify-content-center bg-${card.color} bg-opacity-10 rounded-circle mb-2`}
                                        style={{ width: "44px", height: "44px" }}
                                    >
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

            <div className="row g-4 mb-4">
                <div className="col-xl-8">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 py-3">
                            <h6 className="fw-bold mb-0">Tren Pendapatan 6 Bulan</h6>
                        </div>
                        <div className="card-body">
                            <div className="admin-line-chart-wrap mb-3">
                                <svg viewBox="0 0 100 100" className="admin-line-chart" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="rgba(16,185,129,0.45)" />
                                            <stop offset="100%" stopColor="rgba(16,185,129,0)" />
                                        </linearGradient>
                                    </defs>
                                    {trendPoints && (
                                        <>
                                            <polyline
                                                fill="none"
                                                stroke="#22c55e"
                                                strokeWidth="2.2"
                                                points={trendPoints}
                                            />
                                            <polygon
                                                fill="url(#revenueGradient)"
                                                points={`${trendPoints} 100,100 0,100`}
                                            />
                                        </>
                                    )}
                                </svg>
                            </div>
                            <div className="row g-2">
                                {monthlyRevenue.map((point) => (
                                    <div key={point.key} className="col-6 col-md-4">
                                        <div className="admin-mini-stat">
                                            <div className="small text-muted">{point.label}</div>
                                            <div className="fw-semibold">{formatCurrency(point.revenue)}</div>
                                            <div className="small text-muted">{point.orders} pesanan</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 py-3">
                            <h6 className="fw-bold mb-0">Status Pemesanan</h6>
                        </div>
                        <div className="card-body">
                            {(stats?.statusBreakdown || []).map((item) => {
                                const percentage = Math.round((item.count / totalStatus) * 100);
                                return (
                                    <div key={item.status} className="mb-3">
                                        <div className="d-flex justify-content-between small mb-1">
                                            <span className="fw-semibold">{item.status}</span>
                                            <span className="text-muted">{item.count} ({percentage}%)</span>
                                        </div>
                                        <div className="admin-progress-track">
                                            <div
                                                className="admin-progress-fill"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-xl-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 py-3">
                            <h6 className="fw-bold mb-0">Performa 7 Hari Terakhir</h6>
                        </div>
                        <div className="card-body">
                            <div className="admin-daily-bars">
                                {dailyRevenue.map((item) => (
                                    <div key={item.key} className="admin-daily-bar-item">
                                        <div className="admin-daily-bar-track">
                                            <div
                                                className="admin-daily-bar-fill"
                                                style={{
                                                    height: `${Math.max((item.revenue / maxDailyRevenue) * 100, item.revenue > 0 ? 8 : 0)}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <div className="small fw-semibold mt-2">{item.label}</div>
                                        <div className="small text-muted">{item.orders} order</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 py-3">
                            <h6 className="fw-bold mb-0">Destinasi Terlaris (30 Hari)</h6>
                        </div>
                        <div className="card-body">
                            {stats?.topDestinations && stats.topDestinations.length > 0 ? (
                                <div className="d-grid gap-2">
                                    {stats.topDestinations.map((item, index) => (
                                        <div key={item.wisataId} className="admin-top-destination">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="fw-semibold">
                                                    <span className="admin-rank-badge">{index + 1}</span> {item.nama}
                                                </div>
                                                <div className="fw-bold text-success">{formatCurrency(item.revenue)}</div>
                                            </div>
                                            <small className="text-muted">{item.totalItem} tiket terjual</small>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-muted py-4">
                                    <i className="fas fa-chart-area fa-2x mb-2 opacity-50"></i>
                                    <p className="mb-0 small">Belum ada data penjualan 30 hari terakhir.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                            <h6 className="fw-bold mb-0">Pemesanan Terbaru</h6>
                            <Link to="/admin/tickets" className="btn btn-sm btn-outline-success rounded-pill">
                                Lihat Semua
                            </Link>
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
                                                    <td className="small">{formatCurrency(order.totalHargaAkhir)}</td>
                                                    <td>
                                                        <span className={`badge ${statusBadge(order.status)} rounded-pill`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
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
                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 py-3">
                            <h6 className="fw-bold mb-0">Menu Cepat</h6>
                        </div>
                        <div className="card-body">
                            <div className="row g-2">
                                {[
                                    { title: "Kelola Wisata", icon: "fa-map-location-dot", link: "/admin/wisata", color: "success" },
                                    { title: "Kelola Artikel", icon: "fa-newspaper", link: "/admin/articles", color: "info" },
                                    { title: "Kelola Tiket", icon: "fa-ticket", link: "/admin/tickets", color: "warning" },
                                    { title: "Kelola User", icon: "fa-users", link: "/admin/users", color: "primary" },
                                    { title: "Kelola Galeri", icon: "fa-images", link: "/admin/galeri", color: "secondary" },
                                    { title: "Feedback", icon: "fa-comments", link: "/admin/feedback", color: "dark" },
                                ].map((item) => (
                                    <div key={item.title} className="col-6">
                                        <Link to={item.link} className="text-decoration-none">
                                            <div className="border rounded p-3 text-center h-100 quick-menu-item">
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
