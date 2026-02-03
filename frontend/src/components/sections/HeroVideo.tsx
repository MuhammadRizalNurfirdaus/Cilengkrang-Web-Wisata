import { Link } from "react-router-dom";

export default function HeroVideo() {
    return (
        <header 
            className="hero-section position-relative d-flex align-items-center justify-content-center text-center overflow-hidden"
            style={{ 
                minHeight: "100vh",
                background: "linear-gradient(135deg, #2E8B57 0%, #228B22 50%, #1a6b3a 100%)"
            }}
        >
            {/* Video Background - akan ditampilkan jika ada */}
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                    poster="/img/hero-poster.jpg"
                >
                    <source src="/img/video-bg.mp4" type="video/mp4" />
                </video>
                {/* Overlay */}
                <div 
                    className="position-absolute top-0 start-0 w-100 h-100" 
                    style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                ></div>
            </div>

            {/* Content */}
            <div className="container position-relative text-white" style={{ zIndex: 1 }}>
                <h1 className="display-2 fw-bold mb-4" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
                    🌿 Lembah Cilengkrang
                </h1>
                <p className="lead fs-4 mb-5 mx-auto" style={{ maxWidth: "700px", opacity: 0.9 }}>
                    Nikmati keindahan alam yang asri, sejuk, dan menenangkan.
                    Destinasi wisata alam terbaik di Kuningan, Jawa Barat.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Link to="/destinations" className="btn btn-light btn-lg rounded-pill px-5 shadow-lg text-success fw-bold">
                        <i className="fas fa-map-marked-alt me-2"></i>
                        Jelajahi Sekarang
                    </Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg rounded-pill px-5">
                        <i className="fas fa-ticket-alt me-2"></i>
                        Pesan Tiket
                    </Link>
                </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 text-white">
                <i className="fas fa-chevron-down fa-2x" style={{ animation: "bounce 2s infinite" }}></i>
            </div>
        </header>
    );
}
