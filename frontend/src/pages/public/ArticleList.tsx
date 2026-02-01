import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { Article } from "../../types";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function ArticleList() {
    const [page, setPage] = useState(1);
    const { data: result, loading } = useFetch<{
        data: Article[];
        pagination: { totalPages: number };
    }>(`/articles?page=${page}&limit=6`);

    const articles = result?.data || [];
    const totalPages = result?.pagination?.totalPages || 1;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="bg-light min-vh-100 py-5 mt-5">
            <div className="container py-4">
                <div className="text-center mb-5">
                    <h1 className="fw-bold text-success display-5">Artikel & Berita</h1>
                    <p className="text-muted lead">Informasi terbaru seputar kegiatan dan wisata</p>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : articles.length > 0 ? (
                    <>
                        <div className="row g-4 mb-5">
                            {articles.map((article) => (
                                <div key={article.id} className="col-md-4">
                                    <Card
                                        image={article.gambar}
                                        title={article.judul}
                                        subtitle={formatDate(article.createdAt || "")}
                                        linkTo={`/articles/${article.id}`}
                                        linkText="Baca Selengkapnya"
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
                        <i className="fas fa-newspaper fa-4x mb-3 text-black-50"></i>
                        <h3>Belum ada artikel</h3>
                    </div>
                )}
            </div>
        </div>
    );
}
