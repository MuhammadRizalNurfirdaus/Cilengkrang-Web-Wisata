import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { Wisata } from "../../types";
import Card from "../ui/Card";

export default function Destinations() {
    const { data: wisataList, loading } = useFetch<Wisata[]>("/wisata/popular?limit=3");

    return (
        <section className="py-5 bg-light">
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h2 className="fw-bold text-success display-6">Destinasi Populer</h2>
                        <p className="text-muted mb-0">Tempat favorit pengunjung kami</p>
                    </div>
                    <Link to="/destinations" className="btn btn-outline-success rounded-pill px-4">
                        Lihat Semua <i className="fas fa-arrow-right ms-2"></i>
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : wisataList && wisataList.length > 0 ? (
                    <div className="row g-4">
                        {wisataList.map((wisata) => (
                            <div key={wisata.id} className="col-md-4">
                                <Card
                                    image={wisata.gambar}
                                    title={wisata.nama}
                                    description={wisata.deskripsi || ""}
                                    linkTo={`/destinations/${wisata.id}`}
                                    className="border-0 shadow-sm"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5 text-muted">
                        <i className="fas fa-map-marked-alt fa-3x mb-3 text-black-50"></i>
                        <p>Belum ada destinasi yang ditambahkan.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
