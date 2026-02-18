import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getImageUrl } from "../../api/client";
import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [scrolled, setScrolled] = useState(false);

    // Site settings mock (in real app, fetch from API or context)
    const siteName = "Lembah Cilengkrang";
    const logoUrl = "/img/logo.png"; // Default logo path

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (path: string) => {
        if (path === "/") return location.pathname === "/" ? "active" : "";
        return location.pathname.startsWith(path) ? "active" : "";
    };

    const isHome = location.pathname === "/";
    const isTransparent = isHome && !scrolled;
    const navbarClass = isTransparent
        ? "navbar-dark bg-transparent"
        : isDark
            ? "navbar-dark bg-dark shadow-sm"
            : "navbar-light bg-light shadow-sm";

    return (
        <nav className={`navbar navbar-expand-lg fixed-top transition-all ${navbarClass}`} style={{ transition: "all 0.3s ease" }}>
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img
                        src={logoUrl}
                        alt="Logo"
                        width="40"
                        height="40"
                        className="d-inline-block align-text-top me-2"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <span className={`fw-bold ${isTransparent ? "text-white" : isDark ? "text-light" : "text-success"}`}>
                        {siteName}
                    </span>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive("/")}`} to="/">
                                Beranda
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive("/destinations")}`} to="/destinations">
                                Destinasi
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive("/gallery")}`} to="/gallery">
                                Galeri
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive("/articles")}`} to="/articles">
                                Artikel
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive("/contact")}`} to="/contact">
                                Kontak
                            </Link>
                        </li>

                        {isAuthenticated && user ? (
                            <li className="nav-item dropdown ms-lg-3">
                                <a
                                    className="nav-link dropdown-toggle d-flex align-items-center"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                >
                                    {user.fotoProfil ? (
                                        <img
                                            src={user.fotoProfil.startsWith("http") ? user.fotoProfil : getImageUrl(user.fotoProfil)}
                                            className="rounded-circle me-2 border"
                                            width="30"
                                            height="30"
                                            alt={user.nama}
                                            style={{ objectFit: "cover" }}
                                            onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextElementSibling?.classList.remove("d-none"); }}
                                        />
                                    ) : null}
                                    <span
                                        className={`rounded-circle d-flex align-items-center justify-content-center me-2 text-white fw-bold ${user.fotoProfil ? "d-none" : ""}`}
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            minWidth: "30px",
                                            fontSize: "13px",
                                            background: user.role === "admin" ? "#dc3545" : user.role === "kasir" ? "#0dcaf0" : user.role === "owner" ? "#6f42c1" : "#198754",
                                        }}
                                    >
                                        {user.nama.charAt(0).toUpperCase()}
                                    </span>
                                    <span>{user.nama.split(" ")[0]}</span>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end shadow">
                                    <li>
                                        <h6 className="dropdown-header">Halo, {user.nama}</h6>
                                        <small className="dropdown-header text-muted text-capitalize">{user.role}</small>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    
                                    {/* Admin - go to admin panel */}
                                    {user.role === "admin" && (
                                        <li>
                                            <Link className="dropdown-item" to="/admin/dashboard">
                                                <i className="fas fa-gauge-high me-2 text-danger"></i>Panel Admin
                                            </Link>
                                        </li>
                                    )}
                                    
                                    {/* Kasir - go to kasir panel */}
                                    {user.role === "kasir" && (
                                        <li>
                                            <Link className="dropdown-item" to="/kasir/dashboard">
                                                <i className="fas fa-cash-register me-2 text-info"></i>Panel Kasir
                                            </Link>
                                        </li>
                                    )}
                                    
                                    {/* Owner - go to owner panel */}
                                    {user.role === "owner" && (
                                        <li>
                                            <Link className="dropdown-item" to="/owner/dashboard">
                                                <i className="fas fa-chart-line me-2 text-purple"></i>Panel Owner
                                            </Link>
                                        </li>
                                    )}
                                    
                                    {/* Regular user menu */}
                                    {user.role === "user" && (
                                        <>
                                            <li>
                                                <Link className="dropdown-item" to="/user/dashboard">
                                                    <i className="fas fa-gauge-high me-2 text-success"></i>Dashboard Saya
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/user/profile">
                                                    <i className="fas fa-user-cog me-2 text-muted"></i>Edit Profil
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/user/history">
                                                    <i className="fas fa-history me-2 text-muted"></i>Riwayat Tiket
                                                </Link>
                                            </li>
                                        </>
                                    )}

                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item text-danger" onClick={() => { logout(); navigate("/login"); }}>
                                            <i className="fas fa-sign-out-alt me-2"></i>Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item ms-lg-3">
                                <Link className="btn btn-outline-success btn-sm me-2 rounded-pill px-3" to="/login">
                                    Masuk
                                </Link>
                                <Link className="btn btn-success btn-sm rounded-pill px-3" to="/register">
                                    Daftar
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
