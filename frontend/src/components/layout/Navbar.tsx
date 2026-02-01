import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getImageUrl } from "../../api/client";
import { useEffect, useState } from "react";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
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
        return location.pathname === path ? "active" : "";
    };

    const isHome = location.pathname === "/";
    const navbarClass = isHome && !scrolled ? "navbar-dark bg-transparent" : "navbar-light bg-light shadow-sm";

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
                    <span className={`fw-bold ${isHome && !scrolled ? "text-white" : "text-success"}`}>
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
                                    <img
                                        src={getImageUrl(user.fotoProfil)}
                                        className="rounded-circle me-1"
                                        width="30"
                                        height="30"
                                        alt={user.nama}
                                        style={{ objectFit: "cover" }}
                                    />
                                    <span>{user.nama.split(" ")[0]}</span>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <h6 className="dropdown-header">Halo, {user.nama}</h6>
                                    </li>
                                    {user.role === "admin" ? (
                                        <li>
                                            <Link className="dropdown-item" to="/admin/dashboard">
                                                <i className="fas fa-gauge-high me-2"></i> Dashboard Admin
                                            </Link>
                                        </li>
                                    ) : (
                                        <li>
                                            <Link className="dropdown-item" to="/user/dashboard">
                                                <i className="fas fa-gauge-high me-2"></i> Dashboard Saya
                                            </Link>
                                        </li>
                                    )}
                                    <li>
                                        <Link className="dropdown-item" to="/user/profile">
                                            <i className="fas fa-user-circle me-2"></i> Edit Profil
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/user/history">
                                            <i className="fas fa-history me-2"></i> Riwayat Tiket
                                        </Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item text-danger" onClick={logout}>
                                            <i className="fas fa-sign-out-alt me-2"></i> Logout
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
