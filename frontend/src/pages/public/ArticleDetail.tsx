import { useParams, Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { Article } from "../../types";
import { getImageUrl } from "../../api/client";

export default function ArticleDetail() {
    const { id } = useParams<{ id: string }>();
    const { data: article, loading } = useFetch<Article>(`/articles/${id}`);

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center">
                <i className="fas fa-search fa-4x mb-3 text-muted"></i>
                <h2>Artikel Tidak Ditemukan</h2>
                <Link to="/articles" className="btn btn-success mt-3">
                    Kembali ke Daftar Artikel
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-vh-100 pt-5 mt-4">
            {/* Hero/Header */}
            <div className="bg-light py-5">
                <div className="container">
                    <h1 className="fw-bold display-5 mb-3">{article.judul}</h1>
                    <div className="d-flex align-items-center text-muted">
                        <i className="fas fa-calendar-alt me-2"></i>
                        {new Date(article.createdAt).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        })}
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        {article.gambar && (
                            <img
                                src={getImageUrl(article.gambar)}
                                alt={article.judul}
                                className="w-100 rounded-4 shadow-sm mb-5 object-fit-cover"
                                style={{ maxHeight: "500px" }}
                            />
                        )}

                        <div className="prose fs-5 text-dark" style={{ lineHeight: "1.8" }}>
                            {/* Minimal implementation of rendering paragraphs if it's plain text or html */}
                            {article.isi.split('\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-4">{paragraph}</p>
                            ))}
                        </div>

                        <div className="mt-5 border-top pt-4">
                            <h5 className="fw-bold mb-3">Bagikan Artikel</h5>
                            <div className="d-flex gap-2">
                                <button className="btn btn-outline-primary rounded-circle"><i className="fab fa-facebook-f"></i></button>
                                <button className="btn btn-outline-info rounded-circle"><i className="fab fa-twitter"></i></button>
                                <button className="btn btn-outline-success rounded-circle"><i className="fab fa-whatsapp"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
