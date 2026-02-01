import { useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { User } from "../../../types";
import { fetchApi } from "../../../api/client";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";

export default function AdminUserList() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<{ type: "success" | "danger"; message: string } | null>(null);
    const { data: result, loading, refetch } = useFetch<{
        data: User[];
        pagination: { totalPages: number };
    }>(`/users?page=${page}&limit=10`);

    const users = result?.data || [];
    const totalPages = result?.pagination?.totalPages || 1;

    const handleDelete = async (id: number) => {
        if (!confirm("Yakin ingin menghapus user ini?")) return;
        try {
            await fetchApi(`/users/${id}`, { method: "DELETE" });
            setStatus({ type: "success", message: "User berhasil dihapus" });
            refetch();
        } catch (err: any) {
            setStatus({ type: "danger", message: err.message || "Gagal menghapus user" });
        }
    }

    return (
        <div className="container py-5 mt-5">
            <h2 className="fw-bold text-dark mb-4">Kelola User</h2>
            {status && <Alert variant={status.type} message={status.message} onClose={() => setStatus(null)} />}

            <div className="card border-0 shadow-sm overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light text-secondary">
                            <tr>
                                <th className="py-3 px-4 border-0">ID</th>
                                <th className="py-3 px-4 border-0">Nama</th>
                                <th className="py-3 px-4 border-0">Email</th>
                                <th className="py-3 px-4 border-0">Role</th>
                                <th className="py-3 px-4 border-0">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-5"><div className="spinner-border text-success"></div></td></tr>
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-4 text-muted">{user.id}</td>
                                        <td className="px-4 fw-medium">{user.nama}</td>
                                        <td className="px-4">{user.email}</td>
                                        <td className="px-4"><span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>{user.role}</span></td>
                                        <td className="px-4">
                                            <button className="btn btn-outline-danger btn-sm rounded-circle" onClick={() => handleDelete(user.id)} title="Hapus"><i className="fas fa-trash-alt"></i></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={5} className="text-center py-5 text-muted">Belum ada user.</td></tr>
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
