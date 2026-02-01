import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { Galeri } from "../../types";
import { getImageUrl } from "../../api/client";
import Button from "../../components/ui/Button";

export default function Gallery() {
    const [page, setPage] = useState(1);
    const { data: result, loading } = useFetch<{
        data: Galeri[];
        pagination: { totalPages: number };
    }>(`/galeri?page=${page}&limit=12`);

    const galleryItems = result?.data || [];
    const totalPages = result?.pagination?.totalPages || 1;

    return (
        <div className="bg-light min-vh-100 py-5 mt-5">
            <div className="container py-4">
                <div className="text-center mb-5">
                    <h1 className="fw-bold text-success display-5">Galeri Foto</h1>
                    <p className="text-muted lead">Dokumentasi keindahan Lembah Cilengkrang</p>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : galleryItems.length > 0 ? (
                    <>
                        <div className="row g-4 mb-5" data-masonry='{"percentPosition": true }'>
                            {galleryItems.map((item) => (
                                <div key={item.id} className="col-md-4 col-lg-3">
                                    <div className="card border-0 shadow-sm overflow-hidden h-100">
                                        <img
                                            src={getImageUrl(item.namaFile)}
                                            alt={item.keterangan || "Galeri"}
                                            className="card-img-top object-fit-cover hover-zoom"
                                            style={{ height: "250px", transition: "transform 0.3s ease" }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                                        />
                                        {item.keterangan && (
                                            <div className="card-body p-2 text-center small text-muted bg-white border-top">
                                                {item.keterangan}
                                            </div>
                                        )}
                                    </div>
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
                        <i className="fas fa-images fa-4x mb-3 text-black-50"></i>
                        <h3>Belum ada foto galeri</h3>
                    </div>
                )}
            </div>
        </div>
    );
}
