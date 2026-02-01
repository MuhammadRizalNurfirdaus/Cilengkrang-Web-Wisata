import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { PemesananTiket } from "../../types";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

export default function History() {
    const { user } = useAuth();
    const [page, setPage] = useState(1);

    const { data: result, loading } = useFetch<{
        data: PemesananTiket[];
        pagination: { totalPages: number };
    }>(user ? `/pemesanan/user/${user.id}?page=${page}&limit=5` : null);

    const orders = result?.data || [];
    const totalPages = result?.pagination?.totalPages || 1;

    if (!user) return null;

    return (
        <div className="container py-5 mt-5">
            <h2 className="fw-bold text-success mb-4">Riwayat Pemesanan Tiket</h2>

            {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-success"></div></div>
            ) : orders.length > 0 ? (
                <div className="row g-4">
                    {orders.map((order) => (
                        <div key={order.id} className="col-12">
                            <div className="card border-0 shadow-sm overflow-hidden">
                                <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className="fw-bold me-2">#{order.kodePemesanan}</span>
                                        <small className="text-muted">{new Date(order.createdAt).toLocaleDateString("id-ID")}</small>
                                    </div>
                                    <span className={`badge ${order.status === "PAID" ? "bg-success" :
                                            order.status === "PENDING" ? "bg-warning" :
                                                order.status === "CANCELLED" ? "bg-danger" : "bg-secondary"
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <h6 className="fw-bold text-muted mb-2">Detail Kunjungan</h6>
                                            <p className="mb-1"><i className="fas fa-calendar-day me-2 text-success"></i> {new Date(order.tanggalKunjungan).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>

                                            <div className="mt-3">
                                                {order.detailPemesanan && order.detailPemesanan.map((detail: any, idx: number) => (
                                                    <div key={idx} className="small text-muted mb-1">
                                                        <i className="fas fa-ticket-alt me-2 text-info"></i>
                                                        {detail.jenisTiket?.namaLayananDisplay || "Tiket"} x {detail.jumlah}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="col-md-4 text-md-end mt-3 mt-md-0 d-flex flex-column justify-content-center">
                                            <p className="small text-muted mb-1">Total Pembayaran</p>
                                            <h4 className="fw-bold text-success">Rp {order.totalHargaAkhir.toLocaleString("id-ID")}</h4>
                                            {order.status === "PENDING" && (
                                                <button className="btn btn-warning btn-sm mt-2 rounded-pill text-white fw-bold">
                                                    <i className="fas fa-wallet me-2"></i> Bayar Sekarang
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4 gap-2">
                            <Button size="sm" variant="outline-success" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
                            <Button size="sm" variant="outline-success" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-5">
                    <i className="fas fa-ticket-alt fa-3x mb-3 text-muted opacity-50"></i>
                    <p className="text-muted">Anda belum memiliki riwayat pemesanan tiket.</p>
                    <Link to="/destinations" className="btn btn-success rounded-pill mt-2">Pesan Tiket Sekarang</Link>
                </div>
            )}
        </div>
    );
}
