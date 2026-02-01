import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { Wisata } from "../../types";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function AllDestinations() {
    const [page, setPage] = useState(1);
    const { data: result, loading } = useFetch<{
        data: Wisata[];
        pagination: { totalPages: number };
    }>(`/wisata?page=${page}&limit=9`);

    const destinations = result?.data || [];
    const totalPages = result?.pagination?.totalPages || 1;

    return (
        <div className="bg-light min-vh-100 py-5 mt-5">
            <div className="container py-4">
                <div className="text-center mb-5">
                    <h1 className="fw-bold text-success display-5">Semua Destinasi</h1>
                    <p className="text-muted lead">Temukan tempat wisata menarik di Lembah Cilengkrang</p>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : destinations.length > 0 ? (
                    <>
                        <div className="row g-4 mb-5">
                            {destinations.map((wisata) => (
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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center gap-2">
                                <Button
                                    variant="outline-success"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <i className="fas fa-chevron-left me-1"></i> Prev
                                </Button>
                                <span className="btn btn-light disabled border">
                                    Halaman {page} dari {totalPages}
                                </span>
                                <Button
                                    variant="outline-success"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    Next <i className="fas fa-chevron-right ms-1"></i>
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-5 text-muted">
                        <i className="fas fa-map-signs fa-4x mb-3 text-black-50"></i>
                        <h3>Belum ada destinasi</h3>
                        <p>Silakan coba lagi nanti.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
