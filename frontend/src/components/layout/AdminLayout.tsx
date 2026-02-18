import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getImageUrl } from "../../api/client";
import { useState } from "react";

interface SidebarItem {
    label: string;
    icon: string;
    path: string;
}

interface AdminLayoutProps {
    role: "admin" | "kasir" | "owner";
}

const sidebarMenus: Record<string, SidebarItem[]> = {
    admin: [
        { label: "Dashboard", icon: "fa-gauge-high", path: "/admin/dashboard" },
        { label: "Kelola Wisata", icon: "fa-map-location-dot", path: "/admin/wisata" },
        { label: "Kelola Artikel", icon: "fa-newspaper", path: "/admin/articles" },
        { label: "Kelola Tiket", icon: "fa-ticket", path: "/admin/tickets" },
        { label: "Kelola User", icon: "fa-users", path: "/admin/users" },
        { label: "Galeri", icon: "fa-images", path: "/admin/galeri" },
        { label: "Feedback", icon: "fa-comments", path: "/admin/feedback" },
    ],
    kasir: [
        { label: "Dashboard", icon: "fa-gauge-high", path: "/kasir/dashboard" },
        { label: "Pemesanan Tiket", icon: "fa-ticket-alt", path: "/kasir/pemesanan" },
        { label: "Konfirmasi Bayar", icon: "fa-credit-card", path: "/kasir/pembayaran" },
    ],
    owner: [
        { label: "Dashboard", icon: "fa-gauge-high", path: "/owner/dashboard" },
        { label: "Laporan", icon: "fa-chart-line", path: "/owner/laporan" },
    ],
};

const roleLabels: Record<string, string> = {
    admin: "Administrator",
    kasir: "Kasir",
    owner: "Owner",
};

const roleColors: Record<string, string> = {
    admin: "#dc3545",
    kasir: "#0dcaf0",
    owner: "#6f42c1",
};

export default function AdminLayout({ role }: AdminLayoutProps) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const menu = sidebarMenus[role] || [];
    const accentColor = roleColors[role] || "#198754";

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const avatarUrl = user?.fotoProfil
        ? user.fotoProfil.startsWith("http")
            ? user.fotoProfil
            : getImageUrl(user.fotoProfil)
        : null;

    return (
        <div className="d-flex min-vh-100">
            {/* Sidebar */}
            <aside
                className="d-flex flex-column text-white position-fixed h-100"
                style={{
                    width: sidebarCollapsed ? "70px" : "260px",
                    background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                    transition: "width 0.3s ease",
                    zIndex: 1040,
                    overflowX: "hidden",
                }}
            >
                {/* Sidebar Header */}
                <div className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom border-secondary border-opacity-25">
                    {!sidebarCollapsed && (
                        <div className="d-flex align-items-center gap-2">
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: "36px", height: "36px", background: accentColor, minWidth: "36px" }}
                            >
                                <i className="fas fa-shield-halved text-white" style={{ fontSize: "16px" }}></i>
                            </div>
                            <div style={{ lineHeight: 1.2 }}>
                                <div className="fw-bold small text-white">Panel {roleLabels[role]}</div>
                                <div className="text-white-50" style={{ fontSize: "11px" }}>Lembah Cilengkrang</div>
                            </div>
                        </div>
                    )}
                    <button
                        className="btn btn-sm text-white-50 border-0 p-1"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        title={sidebarCollapsed ? "Expand" : "Collapse"}
                    >
                        <i className={`fas ${sidebarCollapsed ? "fa-angles-right" : "fa-angles-left"}`}></i>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-grow-1 py-3 overflow-auto">
                    <ul className="nav flex-column gap-1 px-2">
                        {menu.map((item, idx) => {
                            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
                            return (
                                <li key={idx} className="nav-item">
                                    <Link
                                        to={item.path}
                                        className={`nav-link d-flex align-items-center gap-3 rounded-3 px-3 py-2 ${isActive ? "text-white" : "text-white-50"}`}
                                        style={{
                                            background: isActive ? accentColor : "transparent",
                                            transition: "all 0.2s",
                                            fontSize: "14px",
                                            whiteSpace: "nowrap",
                                        }}
                                        title={sidebarCollapsed ? item.label : undefined}
                                    >
                                        <i className={`fas ${item.icon}`} style={{ width: "20px", textAlign: "center" }}></i>
                                        {!sidebarCollapsed && <span>{item.label}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Divider + Extra links */}
                    <hr className="border-secondary border-opacity-25 mx-3 my-3" />
                    <ul className="nav flex-column gap-1 px-2">
                        <li className="nav-item">
                            <Link
                                to="/"
                                className="nav-link d-flex align-items-center gap-3 rounded-3 px-3 py-2 text-white-50"
                                style={{ fontSize: "14px", whiteSpace: "nowrap" }}
                                title={sidebarCollapsed ? "Halaman Utama" : undefined}
                            >
                                <i className="fas fa-home" style={{ width: "20px", textAlign: "center" }}></i>
                                {!sidebarCollapsed && <span>Halaman Utama</span>}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to={`/${role}/profile`}
                                className={`nav-link d-flex align-items-center gap-3 rounded-3 px-3 py-2 ${location.pathname.includes("/profile") ? "text-white" : "text-white-50"}`}
                                style={{
                                    background: location.pathname.includes("/profile") ? accentColor : "transparent",
                                    fontSize: "14px",
                                    whiteSpace: "nowrap",
                                }}
                                title={sidebarCollapsed ? "Edit Profil" : undefined}
                            >
                                <i className="fas fa-user-cog" style={{ width: "20px", textAlign: "center" }}></i>
                                {!sidebarCollapsed && <span>Edit Profil</span>}
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* User Info at Bottom */}
                <div className="border-top border-secondary border-opacity-25 p-3">
                    <div className="d-flex align-items-center gap-2">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                className="rounded-circle"
                                style={{ width: "36px", height: "36px", objectFit: "cover", minWidth: "36px" }}
                                alt={user?.nama}
                            />
                        ) : (
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                style={{ width: "36px", height: "36px", minWidth: "36px", background: accentColor, fontSize: "14px" }}
                            >
                                {user?.nama?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}
                        {!sidebarCollapsed && (
                            <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                <div className="text-white small fw-semibold text-truncate">{user?.nama}</div>
                                <div className="text-white-50" style={{ fontSize: "11px" }}>{user?.email}</div>
                            </div>
                        )}
                        <button
                            className="btn btn-sm text-white-50 border-0 p-1"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className="flex-grow-1 bg-light admin-main-content"
                style={{
                    marginLeft: sidebarCollapsed ? "70px" : "260px",
                    transition: "margin-left 0.3s ease",
                    minHeight: "100vh",
                }}
            >
                {/* Top bar */}
                <div
                    className="bg-white shadow-sm d-flex align-items-center justify-content-between px-4 admin-topbar"
                    style={{ height: "60px", position: "sticky", top: 0, zIndex: 1030 }}
                >
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge rounded-pill" style={{ background: accentColor, fontSize: "12px" }}>
                            {roleLabels[role]}
                        </span>
                        <span className="text-muted small d-none d-md-inline">
                            {location.pathname.split("/").filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" / ")}
                        </span>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <Link to="/" className="btn btn-sm btn-outline-secondary rounded-pill px-3" title="Ke Halaman Publik">
                            <i className="fas fa-external-link-alt me-1"></i>
                            <span className="d-none d-md-inline">Lihat Situs</span>
                        </Link>
                        <div className="dropdown">
                            <button className="btn btn-sm d-flex align-items-center gap-2 border-0" data-bs-toggle="dropdown">
                                {avatarUrl ? (
                                    <img src={avatarUrl} className="rounded-circle" style={{ width: "32px", height: "32px", objectFit: "cover" }} alt="" />
                                ) : (
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                        style={{ width: "32px", height: "32px", background: accentColor, fontSize: "13px" }}
                                    >
                                        {user?.nama?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                )}
                                <span className="small fw-medium d-none d-md-inline">{user?.nama?.split(" ")[0]}</span>
                                <i className="fas fa-chevron-down" style={{ fontSize: "10px" }}></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                                <li><h6 className="dropdown-header">{user?.nama}</h6></li>
                                <li><span className="dropdown-header text-muted small">{user?.email}</span></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <Link className="dropdown-item" to={`/${role}/profile`}>
                                        <i className="fas fa-user-cog me-2 text-muted"></i>Edit Profil
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/">
                                        <i className="fas fa-home me-2 text-muted"></i>Halaman Utama
                                    </Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
