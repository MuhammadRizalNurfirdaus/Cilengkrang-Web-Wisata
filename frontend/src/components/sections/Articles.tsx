import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { Article } from "../../types";
import Card from "../ui/Card";

export default function Articles() {
    const { data: articles, loading } = useFetch<Article[]>("/articles/latest?limit=3");

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <section className="py-5 bg-white">
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h2 className="fw-bold text-success display-6">Artikel Terbaru</h2>
                        <p className="text-muted mb-0">Informasi dan berita terkini</p>
                    </div>
                    <Link to="/articles" className="btn btn-outline-success rounded-pill px-4">
                        Lihat Semua <i className="fas fa-arrow-right ms-2"></i>
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : articles && articles.length > 0 ? (
                    <div className="row g-4">
                        {articles.map((article) => (
                            <div key={article.id} className="col-md-4">
                                <Card
                                    image={article.gambar}
                                    title={article.judul}
                                    subtitle={formatDate(article.createdAt || "")}
                                    // description={article.isi.replace(/<[^>]*>?/gm, "")} // Basic strip tags
                                    linkTo={`/articles/${article.id}`}
                                    linkText="Baca Selengkapnya"
                                    className="border-0 shadow-sm"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5 text-muted">
                        <i className="fas fa-newspaper fa-3x mb-3 text-black-50"></i>
                        <p>Belum ada artikel yang diterbitkan.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
