import { useParams, Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";
import { Wisata } from "../../types";
import { getImageUrl } from "../../api/client";

export default function DestinationDetail() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    
    // Check if id is a slug (contains letters) or numeric ID
    const isSlug = id && isNaN(Number(id));
    const endpoint = isSlug ? `/wisata/slug/${id}` : `/wisata/${id}`;
    const { data: wisata, loading } = useFetch<Wisata>(endpoint);

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!wisata) {
        return (
            <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center">
                <i className="fas fa-search fa-4x mb-3 text-muted"></i>
                <h2>Destinasi Tidak Ditemukan</h2>
                <Link to="/destinations" className="btn btn-success mt-3">
                    Kembali ke Daftar Destinasi
                </Link>
            </div>
        );
    }

    // Parse fasilitas if it's a JSON string or comma-separated
    const fasilitasList = wisata.fasilitas
        ? wisata.fasilitas.split(",").map(f => f.trim()).filter(Boolean)
        : [];

    return (
        <div className="bg-white min-vh-100 pt-5 mt-4">
            {/* Hero Image */}
            <div className="position-relative" style={{ height: "450px" }}>
                <img
                    src={getImageUrl(wisata.gambar)}
                    alt={wisata.nama}
                    className="w-100 h-100 object-fit-cover"
                />
                <div className="position-absolute bottom-0 start-0 w-100 p-5 text-white"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                    <div className="container">
                        <h1 className="display-4 fw-bold">{wisata.nama}</h1>
                        <p className="lead mb-0">
                            <i className="fas fa-map-marker-alt me-2 text-warning"></i> 
                            {wisata.lokasi || "Lokasi belum tersedia"}
                        </p>
                        {wisata.jamOperasi && (
                            <p className="mb-0 mt-2">
                                <i className="fas fa-clock me-2 text-info"></i>
                                {wisata.jamOperasi}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-8">
                        {/* Description */}
                        <h3 className="fw-bold text-success mb-4 border-bottom pb-2">
                            <i className="fas fa-info-circle me-2"></i>Deskripsi
                        </h3>
                        <div className="prose text-muted mb-5" style={{ whiteSpace: "pre-line", lineHeight: "1.8" }}>
                            {wisata.deskripsi || "Deskripsi belum tersedia."}
                        </div>

                        {/* Facilities */}
                        {fasilitasList.length > 0 && (
                            <div className="mb-5">
                                <h4 className="fw-bold mb-4">
                                    <i className="fas fa-concierge-bell me-2 text-success"></i>Fasilitas
                                </h4>
                                <div className="row g-3">
                                    {fasilitasList.map((fasilitas, index) => (
                                        <div key={index} className="col-6 col-md-4">
                                            <div className="d-flex align-items-center p-3 bg-light rounded-3">
                                                <i className="fas fa-check-circle text-success me-2"></i>
                                                <span>{fasilitas}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tickets */}
                        <div className="mb-5">
                            <h4 className="fw-bold mb-4">
                                <i className="fas fa-ticket-alt me-2 text-success"></i>Harga Tiket
                            </h4>
                            {wisata.jenisTiket && wisata.jenisTiket.length > 0 ? (
                                <div className="card shadow-sm border-0">
                                    <div className="card-body p-0">
                                        <div className="table-responsive">
                                            <table className="table table-hover mb-0">
                                                <thead className="table-success">
                                                    <tr>
                                                        <th className="py-3">Layanan / Tiket</th>
                                                        <th className="py-3">Kategori Hari</th>
                                                        <th className="py-3 text-end">Harga</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {wisata.jenisTiket.map(tiket => (
                                                        <tr key={tiket.id}>
                                                            <td className="py-3">
                                                                <strong>{tiket.namaLayananDisplay}</strong>
                                                                {tiket.deskripsi && (
                                                                    <small className="d-block text-muted">{tiket.deskripsi}</small>
                                                                )}
                                                            </td>
                                                            <td className="py-3">
                                                                <span className={`badge ${
                                                                    tiket.tipeHari === "Hari Libur" ? "bg-danger" : 
                                                                    tiket.tipeHari === "Hari Kerja" ? "bg-info" : "bg-primary"
                                                                }`}>
                                                                    {tiket.tipeHari}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 text-end fw-bold text-success fs-5">
                                                                Rp {tiket.harga.toLocaleString("id-ID")}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="alert alert-info">
                                    <i className="fas fa-info-circle me-2"></i>
                                    Informasi tiket belum tersedia untuk destinasi ini.
                                </div>
                            )}
                        </div>

                        {/* Gallery */}
                        {wisata.galeri && wisata.galeri.length > 0 && (
                            <div className="mb-5">
                                <h4 className="fw-bold mb-4">
                                    <i className="fas fa-images me-2 text-success"></i>Galeri Foto
                                </h4>
                                <div className="row g-3">
                                    {wisata.galeri.slice(0, 6).map((foto) => (
                                        <div key={foto.id} className="col-6 col-md-4">
                                            <div className="ratio ratio-1x1 rounded-3 overflow-hidden shadow-sm">
                                                <img
                                                    src={getImageUrl(foto.namaFile)}
                                                    alt={foto.keterangan || wisata.nama}
                                                    className="object-fit-cover w-100 h-100"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow-lg sticky-top" style={{ top: "100px" }}>
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4">
                                    <i className="fas fa-hiking me-2 text-success"></i>
                                    Tertarik Mengunjungi?
                                </h5>
                                <p className="text-muted small mb-4">
                                    Pesan tiket sekarang untuk memastikan kunjungan Anda nyaman dan menyenangkan.
                                </p>
                                <Link
                                    to={user ? `/booking?wisataId=${wisata.id}` : "/login"}
                                    className="btn btn-success w-100 rounded-pill py-3 mb-3 fw-bold shadow-sm"
                                >
                                    <i className="fas fa-ticket-alt me-2"></i> Pesan Tiket
                                </Link>
                                <Link to="/contact" className="btn btn-outline-dark w-100 rounded-pill py-2">
                                    <i className="fas fa-envelope me-2"></i> Hubungi Kami
                                </Link>

                                {/* Location Map Link */}
                                {wisata.latitude && wisata.longitude && (
                                    <a
                                        href={`https://www.google.com/maps?q=${wisata.latitude},${wisata.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-success w-100 rounded-pill py-2 mt-3"
                                    >
                                        <i className="fas fa-map-marked-alt me-2"></i> Lihat di Maps
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
