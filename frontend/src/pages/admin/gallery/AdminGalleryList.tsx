import { Link } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { Galeri } from "../../../types";
import { getImageUrl } from "../../../api/client";
import { fallbackGalleryItems } from "../../../utils/destinationMedia";
import { getAdminGalleryImage } from "../../../utils/adminMedia";

export default function AdminGalleryList() {
    const { data: galleryItems, loading, pagination } = useFetch<Galeri[]>("/galeri?page=1&limit=24");

    const items = galleryItems && galleryItems.length > 0 ? galleryItems : fallbackGalleryItems;
    const totalImages = pagination?.total || items.length;
    const uniqueCategoryCount = new Set(items.map((item) => item.kategori || "umum")).size;
    const latestUpload = items[0]?.uploadedAt || null;
    const heroItem = items[0];

    return (
        <div>
            <div className="d-flex flex-wrap gap-3 justify-content-between align-items-start mb-4">
                <div>
                    <h2 className="fw-bold mb-2">Kelola Galeri</h2>
                    <p className="text-muted mb-0">Koleksi visual destinasi, fasilitas, dan aktivitas terbaru.</p>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/gallery" className="btn btn-outline-secondary rounded-pill px-4">
                        <i className="fas fa-up-right-from-square me-2"></i>Lihat Galeri Publik
                    </Link>
                    <Link to="/admin/wisata" className="btn btn-success rounded-pill px-4 shadow-sm">
                        <i className="fas fa-images me-2"></i>Atur Konten Destinasi
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="card border-0 shadow-sm p-5 text-center">
                    <div className="spinner-border text-success mx-auto mb-3" role="status"></div>
                    <p className="text-muted mb-0">Memuat data galeri...</p>
                </div>
            ) : (
                <>
                    <div className="row g-3 mb-4">
                        <div className="col-lg-8">
                            <div className="admin-gallery-hero card border-0 shadow-sm overflow-hidden h-100">
                                {heroItem && (
                                    <img
                                        src={getImageUrl(getAdminGalleryImage(heroItem, 0))}
                                        alt={heroItem.judul || "Galeri wisata"}
                                        className="admin-gallery-hero-image"
                                    />
                                )}
                                <div className="admin-gallery-hero-overlay">
                                    <span className="badge rounded-pill text-bg-success mb-2">Foto Unggulan</span>
                                    <h5 className="fw-bold mb-1">{heroItem?.judul || "Lembah Cilengkrang"}</h5>
                                    <p className="mb-0 small text-white-75">
                                        {heroItem?.keterangan || "Dokumentasi panorama alam terbaru dari kawasan wisata."}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="admin-gallery-metrics card border-0 shadow-sm h-100">
                                <div className="card-body p-4">
                                    <div className="admin-metric-tile">
                                        <div className="admin-metric-label">Total Foto</div>
                                        <div className="admin-metric-value">{totalImages}</div>
                                    </div>
                                    <div className="admin-metric-tile">
                                        <div className="admin-metric-label">Kategori Aktif</div>
                                        <div className="admin-metric-value">{uniqueCategoryCount}</div>
                                    </div>
                                    <div className="admin-metric-tile mb-0">
                                        <div className="admin-metric-label">Upload Terakhir</div>
                                        <div className="admin-metric-value admin-metric-date">
                                            {latestUpload
                                                ? new Date(latestUpload).toLocaleDateString("id-ID", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                                : "-"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-3">
                        {items.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="col-md-4 col-xl-3">
                                <article className="admin-gallery-card card border-0 shadow-sm h-100 overflow-hidden">
                                    <img
                                        src={getImageUrl(getAdminGalleryImage(item, index))}
                                        alt={item.judul || item.keterangan || "Foto galeri"}
                                        className="admin-gallery-card-image"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="badge rounded-pill text-bg-dark text-uppercase">
                                                {item.kategori || "Umum"}
                                            </span>
                                            <small className="text-muted">
                                                {new Date(item.uploadedAt).toLocaleDateString("id-ID", {
                                                    day: "2-digit",
                                                    month: "short",
                                                })}
                                            </small>
                                        </div>
                                        <h6 className="fw-semibold mb-1 text-truncate">
                                            {item.judul || "Dokumentasi Wisata"}
                                        </h6>
                                        <p className="small text-muted mb-0 admin-gallery-caption">
                                            {item.keterangan || "Foto dokumentasi aktivitas dan fasilitas wisata."}
                                        </p>
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
