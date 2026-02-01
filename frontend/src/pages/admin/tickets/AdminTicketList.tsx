import { useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { PemesananTiket } from "../../../types";
import { fetchApi } from "../../../api/client";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";

export default function AdminTicketList() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<{ type: "success" | "danger"; message: string } | null>(null);
    const { data: result, loading, refetch } = useFetch<{
        data: PemesananTiket[];
        pagination: { totalPages: number };
    }>(`/pemesanan?page=${page}&limit=10`);

    const orders = result?.data || [];
    const totalPages = result?.pagination?.totalPages || 1;

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        if (!confirm(`Ubah status menjadi ${newStatus}?`)) return;

        try {
            await fetchApi(`/pemesanan/${id}/status`, {
                method: "PUT",
                body: JSON.stringify({ status: newStatus })
            });
            setStatus({ type: "success", message: `Status berhasil diubah menjadi ${newStatus}` });
            refetch();
        } catch (err: any) {
            setStatus({ type: "danger", message: err.message || "Gagal mengubah status" });
        }
    };

    return (
        <div className="container py-5 mt-5">
            <h2 className="fw-bold text-dark mb-4">Kelola Tiket</h2>
            {status && <Alert variant={status.type} message={status.message} onClose={() => setStatus(null)} />}

            <div className="card border-0 shadow-sm overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light text-secondary">
                            <tr>
                                <th className="py-3 px-4 border-0">Kode</th>
                                <th className="py-3 px-4 border-0">Pemesan</th>
                                <th className="py-3 px-4 border-0">Tgl Kunjungan</th>
                                <th className="py-3 px-4 border-0">Total</th>
                                <th className="py-3 px-4 border-0">Status</th>
                                <th className="py-3 px-4 border-0">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-5"><div className="spinner-border text-success"></div></td></tr>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-4 fw-bold text-success">#{order.kodePemesanan}</td>
                                        <td className="px-4">
                                            <div className="fw-medium">{order.user?.nama || order.namaPemesanTamu}</div>
                                            <small className="text-muted">{order.user?.email || order.emailPemesanTamu}</small>
                                        </td>
                                        <td className="px-4">{new Date(order.tanggalKunjungan).toLocaleDateString()}</td>
                                        <td className="px-4 fw-medium">Rp {order.totalHargaAkhir.toLocaleString("id-ID")}</td>
                                        <td className="px-4">
                                            <span className={`badge ${order.status === "PAID" ? "bg-success" : order.status === "PENDING" ? "bg-warning" : "bg-danger"}`}>{order.status}</span>
                                        </td>
                                        <td className="px-4">
                                            <button className="btn btn-outline-success btn-sm me-1" onClick={() => handleUpdateStatus(order.id, "PAID")} title="Set Paid"><i className="fas fa-check"></i></button>
                                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleUpdateStatus(order.id, "CANCELLED")} title="Cancel"><i className="fas fa-times"></i></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={6} className="text-center py-5 text-muted">Belum ada pemesanan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="card-footer bg-white border-0 py-3 d-flex justify-content-end gap-2">
                        <Button size="sm" variant="outline-success" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
                        <Button size="sm" variant="outline-success" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
