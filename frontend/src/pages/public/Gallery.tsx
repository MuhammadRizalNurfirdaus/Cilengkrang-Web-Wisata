import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { Galeri } from "../../types";
import { getImageUrl } from "../../api/client";
import Button from "../../components/ui/Button";
import { fallbackGalleryItems } from "../../utils/destinationMedia";

export default function Gallery() {
    const instagramUrl = "https://www.instagram.com/pesona.lembahcilengkrang/";
    const [page, setPage] = useState(1);
    const { data: galleryItems, loading, pagination } = useFetch<Galeri[]>(`/galeri?page=${page}&limit=12`);

    const items = galleryItems && galleryItems.length > 0 ? galleryItems : fallbackGalleryItems;
    const totalPages = pagination?.totalPages || 1;

    return (
        <div className="bg-light min-vh-100 py-5 mt-5">
            <div className="container py-4">
                <div className="text-center mb-5">
                    <h1 className="fw-bold text-success display-5">Galeri Foto</h1>
                    <p className="text-muted lead">Dokumentasi keindahan Lembah Cilengkrang</p>
                    <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-success rounded-pill px-4 mt-2"
                    >
                        <i className="fab fa-instagram me-2"></i>Lihat Instagram Resmi
                    </a>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : items.length > 0 ? (
                    <>
                        <div className="row g-4 mb-5" data-masonry='{"percentPosition": true }'>
                            {items.map((item) => (
                                <div key={item.id} className="col-md-4 col-lg-3">
                                    <div className="media-showcase-card">
                                        <div className="media-showcase-image-wrap">
                                            <img
                                                src={getImageUrl(item.namaFile)}
                                                alt={item.keterangan || "Galeri"}
                                                className="media-showcase-image"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </div>
                                        {item.keterangan && (
                                            <div className="media-showcase-caption">
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
                                <span className="d-flex align-items-center small text-muted px-3">
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
                        <i className="fas fa-images fa-4x mb-3 opacity-50"></i>
                        <h3>Belum ada foto galeri</h3>
                    </div>
                )}
            </div>
        </div>
    );
}
