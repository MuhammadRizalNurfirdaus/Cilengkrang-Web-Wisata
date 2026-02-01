import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { Wisata } from "../../../types";
import { getImageUrl, fetchApi } from "../../../api/client";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";

export default function AdminWisataList() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<{ type: "success" | "danger"; message: string } | null>(null);
    const { data: result, loading, refetch } = useFetch<{
        data: Wisata[];
        pagination: { totalPages: number };
    }>(`/wisata?page=${page}&limit=10`);

    const wisataList = result?.data || [];
    const totalPages = result?.pagination?.totalPages || 1;

    const handleDelete = async (id: number) => {
        if (!confirm("Apakah Anda yakin ingin menghapus destinasi ini?")) return;

        try {
            await fetchApi(`/wisata/${id}`, { method: "DELETE" });
            setStatus({ type: "success", message: "Destinasi berhasil dihapus" });
            refetch();
        } catch (err: any) {
            setStatus({ type: "danger", message: err.message || "Gagal menghapus destinasi" });
        }
    };

    return (
        <div className="container py-5 mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark">Kelola Wisata</h2>
                    <p className="text-muted mb-0">Daftar semua destinasi wisata</p>
                </div>
                <Link to="/admin/wisata/create" className="btn btn-success rounded-pill px-4 shadow-sm">
                    <i className="fas fa-plus me-2"></i> Tambah Destinasi
                </Link>
            </div>

            {status && <Alert variant={status.type} message={status.message} onClose={() => setStatus(null)} />}

            <div className="card border-0 shadow-sm overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light text-secondary">
                            <tr>
                                <th className="py-3 px-4 border-0">No</th>
                                <th className="py-3 px-4 border-0">Gambar</th>
                                <th className="py-3 px-4 border-0">Nama Destinasi</th>
                                <th className="py-3 px-4 border-0">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-5">
                                        <div className="spinner-border text-success" role="status"></div>
                                    </td>
                                </tr>
                            ) : wisataList.length > 0 ? (
                                wisataList.map((wisata, idx) => (
                                    <tr key={wisata.id}>
                                        <td className="px-4 text-muted">{(page - 1) * 10 + idx + 1}</td>
                                        <td className="px-4">
                                            <img
                                                src={getImageUrl(wisata.gambar)}
                                                alt={wisata.nama}
                                                className="rounded shadow-sm object-fit-cover"
                                                width="60"
                                                height="40"
                                            />
                                        </td>
                                        <td className="px-4 fw-medium">{wisata.nama}</td>
                                        <td className="px-4">
                                            <div className="d-flex gap-2">
                                                <Link to={`/admin/wisata/edit/${wisata.id}`} className="btn btn-outline-info btn-sm rounded-circle" title="Edit">
                                                    <i className="fas fa-edit"></i>
                                                </Link>
                                                <button onClick={() => handleDelete(wisata.id)} className="btn btn-outline-danger btn-sm rounded-circle" title="Hapus">
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-5 text-muted">
                                        Belum ada data wisata.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="card-footer bg-white border-0 py-3 d-flex justify-content-end gap-2">
                        <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Prev
                        </Button>
                        <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
