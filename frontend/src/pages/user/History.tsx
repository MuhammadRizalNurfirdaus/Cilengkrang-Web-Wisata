import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { fetchApi } from "../../api/client";
import { DetailPemesananTiket, PemesananTiket } from "../../types";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { getErrorMessage } from "../../utils/error";

export default function History() {
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const [alertMsg, setAlertMsg] = useState<{ type: "success" | "danger"; text: string } | null>(null);

    const { data: orders, loading, pagination, refetch } = useFetch<PemesananTiket[]>(
        user ? `/pemesanan/user/${user.id}?page=${page}&limit=5` : null
    );

    const items = orders || [];
    const totalPages = pagination?.totalPages || 1;

    const handleCancel = async (orderId: number) => {
        if (!confirm("Yakin ingin membatalkan pesanan ini?")) return;
        setCancellingId(orderId);
        try {
            await fetchApi(`/pemesanan/${orderId}/status`, {
                method: "PUT",
                body: JSON.stringify({ status: "CANCELLED" }),
            });
            setAlertMsg({ type: "success", text: "Pesanan berhasil dibatalkan." });
            refetch();
        } catch (err: unknown) {
            setAlertMsg({ type: "danger", text: getErrorMessage(err, "Gagal membatalkan pesanan.") });
        } finally {
            setCancellingId(null);
        }
    };

    if (!user) return null;

    const statusInfo = (status: string) => {
        const map: Record<string, { badge: string; label: string }> = {
            PENDING: { badge: "bg-warning text-dark", label: "Menunggu Pembayaran" },
            WAITING_PAYMENT: { badge: "bg-warning text-dark", label: "Menunggu Pembayaran" },
            PAID: { badge: "bg-success", label: "Sudah Dibayar" },
            CONFIRMED: { badge: "bg-primary", label: "Dikonfirmasi" },
            COMPLETED: { badge: "bg-info", label: "Selesai" },
            CANCELLED: { badge: "bg-danger", label: "Dibatalkan" },
            EXPIRED: { badge: "bg-secondary", label: "Kedaluwarsa" },
        };
        return map[status] || { badge: "bg-secondary", label: status };
    };

    return (
        <div className="container py-5 mt-5">
            <h2 className="fw-bold text-success mb-4">Riwayat Pemesanan Tiket</h2>

            {alertMsg && (
                <Alert variant={alertMsg.type} message={alertMsg.text} onClose={() => setAlertMsg(null)} />
            )}

            {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-success"></div></div>
            ) : items.length > 0 ? (
                <div className="row g-4">
                    {items.map((order) => {
                        const si = statusInfo(order.status);
                        return (
                            <div key={order.id} className="col-12">
                                <div className="card border-0 shadow-sm overflow-hidden">
                                    <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className="fw-bold me-2">#{order.kodePemesanan}</span>
                                            <small className="text-muted">{new Date(order.createdAt).toLocaleDateString("id-ID")}</small>
                                        </div>
                                        <span className={`badge ${si.badge}`}>{si.label}</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-8">
                                                <h6 className="fw-bold text-muted mb-2">Detail Kunjungan</h6>
                                                <p className="mb-1">
                                                    <i className="fas fa-calendar-day me-2 text-success"></i>
                                                    {new Date(order.tanggalKunjungan).toLocaleDateString("id-ID", {
                                                        weekday: "long", day: "numeric", month: "long", year: "numeric"
                                                    })}
                                                </p>
                                                <div className="mt-3">
                                                    {order.detailPemesanan?.map((detail: DetailPemesananTiket, idx: number) => (
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
                                                {(order.status === "PENDING" || order.status === "WAITING_PAYMENT") && (
                                                    <div className="d-flex gap-2 justify-content-md-end mt-2">
                                                        <button
                                                            className="btn btn-outline-danger btn-sm rounded-pill"
                                                            onClick={() => handleCancel(order.id)}
                                                            disabled={cancellingId === order.id}
                                                        >
                                                            {cancellingId === order.id ? (
                                                                <span className="spinner-border spinner-border-sm"></span>
                                                            ) : (
                                                                <><i className="fas fa-times me-1"></i> Batalkan</>
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                                {order.status === "PAID" && (
                                                    <small className="text-success mt-1">
                                                        <i className="fas fa-check-circle me-1"></i> Pembayaran diterima
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4 gap-2">
                            <Button size="sm" variant="outline-success" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
                            <span className="d-flex align-items-center small text-muted px-2">Halaman {page} dari {totalPages}</span>
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
