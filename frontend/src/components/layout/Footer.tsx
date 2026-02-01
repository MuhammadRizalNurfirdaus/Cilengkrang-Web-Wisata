export default function Footer() {
    const currentYear = new Date().getFullYear();
    const siteName = "Lembah Cilengkrang";

    return (
        <footer className="bg-dark text-light pt-5 pb-3 mt-auto">
            <div className="container">
                <div className="row g-4 justify-content-between">
                    <div className="col-md-4">
                        <h5 className="text-white mb-3 fw-bold">{siteName}</h5>
                        <p className="text-white-50 small">
                            Nikmati keindahan alam yang asri dan sejuk di Lembah Cilengkrang.
                            Destinasi wisata terbaik untuk keluarga dan teman.
                        </p>
                        <div className="d-flex gap-3">
                            <a href="#" className="text-white-50 hover-text-white"><i className="fab fa-facebook fa-lg"></i></a>
                            <a href="#" className="text-white-50 hover-text-white"><i className="fab fa-instagram fa-lg"></i></a>
                            <a href="#" className="text-white-50 hover-text-white"><i className="fab fa-whatsapp fa-lg"></i></a>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <h6 className="text-white mb-3 fw-bold">Navigasi</h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2"><a href="/" className="text-white-50 text-decoration-none hover-text-white">Beranda</a></li>
                            <li className="mb-2"><a href="/destinations" className="text-white-50 text-decoration-none hover-text-white">Destinasi</a></li>
                            <li className="mb-2"><a href="/gallery" className="text-white-50 text-decoration-none hover-text-white">Galeri</a></li>
                            <li className="mb-2"><a href="/contact" className="text-white-50 text-decoration-none hover-text-white">Kontak</a></li>
                        </ul>
                    </div>

                    <div className="col-md-3">
                        <h6 className="text-white mb-3 fw-bold">Hubungi Kami</h6>
                        <ul className="list-unstyled small text-white-50">
                            <li className="mb-2"><i className="fas fa-map-marker-alt me-2"></i> Desa Cilengkrang, Kec. Pasaleman, Kab. Cirebon</li>
                            <li className="mb-2"><i className="fas fa-phone me-2"></i> +62 812-3456-7890</li>
                            <li className="mb-2"><i className="fas fa-envelope me-2"></i> info@lembahcilengkrang.com</li>
                        </ul>
                    </div>
                </div>

                <hr className="my-4 border-secondary opacity-50" />

                <div className="text-center text-white-50 small">
                    &copy; {currentYear} {siteName}. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
