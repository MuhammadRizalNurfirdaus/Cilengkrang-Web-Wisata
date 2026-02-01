import { useParams, Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";
import { Wisata } from "../../types";
import { getImageUrl } from "../../api/client";

export default function DestinationDetail() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    // Include specific casting or logic if needed for params
    const { data: wisata, loading } = useFetch<Wisata>(`/wisata/${id}`);

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

    return (
        <div className="bg-white min-vh-100 pt-5 mt-4">
            {/* Hero Image */}
            <div className="position-relative" style={{ height: "400px" }}>
                <img
                    src={getImageUrl(wisata.gambar)}
                    alt={wisata.nama}
                    className="w-100 h-100 object-fit-cover"
                />
                <div className="position-absolute bottom-0 start-0 w-100 p-5 text-white"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                    <div className="container">
                        <h1 className="display-4 fw-bold">{wisata.nama}</h1>
                        <p className="lead mb-0"><i className="fas fa-map-marker-alt me-2 text-warning"></i> {wisata.lokasi || "Lokasi belum tersedia"}</p>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-8">
                        <h3 className="fw-bold text-success mb-4 border-bottom pb-2">Deskripsi</h3>
                        <div className="prose text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.8" }}>
                            {wisata.deskripsi}
                        </div>

                        <div className="mt-5">
                            <h4 className="fw-bold mb-3">Fasilitas & Tiket</h4>
                            {wisata.jenisTiket && wisata.jenisTiket.length > 0 ? (
                                <div className="card shadow-sm border-0 bg-light">
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-hover mb-0">
                                                <thead className="table-success">
                                                    <tr>
                                                        <th>Layanan / Tiket</th>
                                                        <th>Kategori Hari</th>
                                                        <th className="text-end">Harga</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {wisata.jenisTiket.map(tiket => (
                                                        <tr key={tiket.id}>
                                                            <td>{tiket.namaLayananDisplay}</td>
                                                            <td>
                                                                <span className={`badge ${tiket.tipeHari === "Hari Libur" ? "bg-danger" : tiket.tipeHari === "Hari Kerja" ? "bg-info" : "bg-primary"}`}>
                                                                    {tiket.tipeHari}
                                                                </span>
                                                            </td>
                                                            <td className="text-end fw-bold text-success">
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
                                <p className="text-muted fst-italic">Informasi tiket belum tersedia untuk destinasi ini.</p>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow-lg sticky-top" style={{ top: "100px" }}>
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4">Tertarik Mengunjungi?</h5>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
