import { Link } from "react-router-dom";

export default function HeroVideo() {
    return (
        <header className="hero-section position-relative vh-100 d-flex align-items-center justify-content-center text-center overflow-hidden">
            {/* Video Background */}
            <div className="position-absolute top-0 start-0 w-100 h-100 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="object-fit-cover w-100 h-100"
                    poster="/img/hero-poster.jpg"
                >
                    <source src="/img/video-bg.mp4" type="video/mp4" />
                </video>
                {/* Overlay */}
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
            </div>

            {/* Content */}
            <div className="container position-relative z-1 text-white" data-aos="fade-up">
                <h1 className="display-3 fw-bold mb-3 tracking-tight">
                    Lembah Cilengkrang
                </h1>
                <p className="lead fs-4 mb-5 text-white-75 mx-auto" style={{ maxWidth: "700px" }}>
                    Nikmati keindahan alam yang asri, sejuk, dan menenangkan.
                    Destinasi wisata alam terbaik di Cirebon Timur.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                    <Link to="/destinations" className="btn btn-success btn-lg rounded-pill px-5 shadow-lg">
                        Jelajahi Sekarang
                    </Link>
                    <Link to="/contact" className="btn btn-outline-light btn-lg rounded-pill px-5">
                        Kontak Kami
                    </Link>
                </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 text-white animate-bounce">
                <i className="fas fa-chevron-down fa-2x"></i>
            </div>
        </header>
    );
}
