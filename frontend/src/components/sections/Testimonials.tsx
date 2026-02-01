import { useFetch } from "../../hooks/useFetch";
import { Feedback } from "../../types";
import { getImageUrl } from "../../api/client";

export default function Testimonials() {
    const { data: feedbackList, loading } = useFetch<Feedback[]>("/feedback?limit=5");

    if (!loading && (!feedbackList || feedbackList.length === 0)) return null;

    return (
        <section className="py-5 bg-light">
            <div className="container py-4">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-success display-6">Kata Pengunjung</h2>
                    <p className="text-muted lead">Pengalaman mereka berwisata di Lembah Cilengkrang</p>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        {/* Simple Carousel or just a grid for now */}
                        <div className="row g-4">
                            {feedbackList?.slice(0, 3).map((feedback) => (
                                <div key={feedback.id} className="col-md-4">
                                    <div className="card h-100 border-0 shadow-sm p-3">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <i
                                                        key={i}
                                                        className={`fas fa-star ${i < (feedback.rating || 5) ? "text-warning" : "text-muted opacity-25"}`}
                                                    ></i>
                                                ))}
                                            </div>
                                            <p className="card-text fst-italic text-muted">"{feedback.komentar}"</p>
                                            <div className="d-flex align-items-center mt-4">
                                                <img
                                                    src={getImageUrl(feedback.user?.fotoProfil)}
                                                    alt={feedback.user?.nama || "User"}
                                                    className="rounded-circle me-3"
                                                    width="40"
                                                    height="40"
                                                    style={{ objectFit: "cover" }}
                                                />
                                                <div>
                                                    <h6 className="fw-bold mb-0 text-dark small">{feedback.user?.nama || "Pengunjung"}</h6>
                                                    <small className="text-black-50" style={{ fontSize: "0.75rem" }}>
                                                        {new Date(feedback.createdAt).toLocaleDateString()}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
