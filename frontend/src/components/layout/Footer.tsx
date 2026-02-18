import { Link } from "react-router-dom";

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
                            <a href="https://www.instagram.com/crawasy_zall" target="_blank" rel="noopener noreferrer" className="text-white-50"><i className="fab fa-instagram fa-lg"></i></a>
                            <a href="https://wa.me/6283101461069" target="_blank" rel="noopener noreferrer" className="text-white-50"><i className="fab fa-whatsapp fa-lg"></i></a>
                            <a href="mailto:muhammadrizalnurfirdaus@gmail.com" className="text-white-50"><i className="fas fa-envelope fa-lg"></i></a>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <h6 className="text-white mb-3 fw-bold">Navigasi</h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2"><Link to="/" className="text-white-50 text-decoration-none">Beranda</Link></li>
                            <li className="mb-2"><Link to="/destinations" className="text-white-50 text-decoration-none">Destinasi</Link></li>
                            <li className="mb-2"><Link to="/gallery" className="text-white-50 text-decoration-none">Galeri</Link></li>
                            <li className="mb-2"><Link to="/articles" className="text-white-50 text-decoration-none">Artikel</Link></li>
                            <li className="mb-2"><Link to="/contact" className="text-white-50 text-decoration-none">Kontak</Link></li>
                        </ul>
                    </div>

                    <div className="col-md-3">
                        <h6 className="text-white mb-3 fw-bold">Hubungi Kami</h6>
                        <ul className="list-unstyled small text-white-50">
                            <li className="mb-2">
                                <i className="fas fa-map-marker-alt me-2"></i>
                                <a href="https://maps.app.goo.gl/GucUR2sUx7HT5Prt9" target="_blank" rel="noopener noreferrer" className="text-white-50 text-decoration-none">
                                    Desa Pajambon, Kec. Kramatmulya, Kab. Kuningan, Jawa Barat 45553
                                </a>
                            </li>
                            <li className="mb-2"><i className="fas fa-phone me-2"></i> <a href="tel:+6283101461069" className="text-white-50 text-decoration-none">083-1014-61069</a></li>
                            <li className="mb-2"><i className="fas fa-envelope me-2"></i> <a href="mailto:muhammadrizalnurfirdaus@gmail.com" className="text-white-50 text-decoration-none">muhammadrizalnurfirdaus@gmail.com</a></li>
                            <li className="mb-2"><i className="fab fa-instagram me-2"></i> <a href="https://www.instagram.com/crawasy_zall" target="_blank" rel="noopener noreferrer" className="text-white-50 text-decoration-none">@crawasy_zall</a></li>
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
