import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchApi, getImageUrl } from "../../api/client";
import { User } from "../../types";
import Alert from "../../components/ui/Alert";
import { getErrorMessage } from "../../utils/error";

export default function Profile() {
    const { user, login, token } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({ nama: "", email: "", noHp: "", alamat: "" });
    const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "" });

    const [loading, setLoading] = useState(false);
    const [pwLoading, setPwLoading] = useState(false);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "danger"; text: string } | null>(null);
    const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

    useEffect(() => {
        if (user) {
            setForm({ nama: user.nama || "", email: user.email || "", noHp: user.noHp || "", alamat: user.alamat || "" });
        }
    }, [user]);

    const showAlert = (type: "success" | "danger", text: string) => {
        setAlert({ type, text });
        setTimeout(() => setAlert(null), 4000);
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetchApi<{ success: boolean; data: User; message?: string }>(`/users/${user?.id}`, {
                method: "PUT",
                body: JSON.stringify({ nama: form.nama, noHp: form.noHp, alamat: form.alamat }),
            });
            if (res.success && res.data) {
                if (token) login(token, { ...user!, ...res.data });
                showAlert("success", "Profil berhasil diperbarui!");
            } else {
                showAlert("danger", res.message || "Gagal memperbarui profil");
            }
        } catch (err: unknown) {
            showAlert("danger", getErrorMessage(err, "Terjadi kesalahan"));
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return showAlert("danger", "Password baru dan konfirmasi tidak cocok");
        }
        if (passwordForm.newPassword.length < 6) {
            return showAlert("danger", "Password minimal 6 karakter");
        }
        setPwLoading(true);
        try {
            const res = await fetchApi<{ success: boolean; message?: string }>(`/users/${user?.id}`, {
                method: "PUT",
                body: JSON.stringify({ password: passwordForm.newPassword }),
            });
            if (res.success) {
                showAlert("success", "Password berhasil diubah!");
                setPasswordForm({ newPassword: "", confirmPassword: "" });
            } else {
                showAlert("danger", res.message || "Gagal mengubah password");
            }
        } catch (err: unknown) {
            showAlert("danger", getErrorMessage(err, "Terjadi kesalahan"));
        } finally {
            setPwLoading(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return showAlert("danger", "File harus berupa gambar");
        if (file.size > 2 * 1024 * 1024) return showAlert("danger", "Ukuran file maksimal 2MB");

        setPhotoLoading(true);
        try {
            const formData = new FormData();
            formData.append("foto", file);
            const data = await fetchApi<{ success: boolean; data: { fotoProfil: string }; message?: string }>(
                `/users/${user?.id}/photo`,
                { method: "POST", body: formData }
            );
            if (data.success && data.data) {
                if (token && user) login(token, { ...user, fotoProfil: data.data.fotoProfil });
                showAlert("success", "Foto profil diperbarui!");
            } else {
                showAlert("danger", data.message || "Gagal upload foto");
            }
        } catch (err: unknown) {
            showAlert("danger", getErrorMessage(err, "Gagal upload foto"));
        } finally {
            setPhotoLoading(false);
        }
    };

    const avatarUrl = user?.fotoProfil
        ? user.fotoProfil.startsWith("http") ? user.fotoProfil : getImageUrl(user.fotoProfil)
        : null;

    if (!user) return null;

    const roleBg = user.role === "admin" ? "#dc3545" : user.role === "kasir" ? "#0dcaf0" : user.role === "owner" ? "#6f42c1" : "#198754";

    return (
        <div className="row justify-content-center g-0">
            <div className="col-xl-9 col-lg-10">
                {alert && <Alert variant={alert.type} message={alert.text} onClose={() => setAlert(null)} />}

                {/* Profile Card Header - compact */}
                <div className="card border-0 shadow-sm mb-3 overflow-hidden">
                    <div className="position-relative" style={{ height: "100px", background: `linear-gradient(135deg, ${roleBg}22, ${roleBg}44)` }} />
                    <div className="card-body pt-0 pb-3 px-4">
                        <div className="d-flex flex-column flex-sm-row align-items-center gap-3" style={{ marginTop: "-50px" }}>
                            <div className="position-relative flex-shrink-0">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Foto" className="rounded-circle border border-4 border-white shadow"
                                        style={{ width: "90px", height: "90px", objectFit: "cover", background: "var(--element-bg, #fff)" }} />
                                ) : (
                                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white shadow border border-4 border-white"
                                        style={{ width: "90px", height: "90px", fontSize: "2rem", background: roleBg }}>
                                        {user.nama.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <button
                                    className="btn btn-sm btn-success rounded-circle position-absolute shadow-sm"
                                    style={{ width: "30px", height: "30px", padding: 0, bottom: "2px", right: "2px" }}
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={photoLoading}
                                    title="Ganti Foto"
                                >
                                    {photoLoading ? (
                                        <span className="spinner-border spinner-border-sm" style={{ width: "12px", height: "12px" }} />
                                    ) : (
                                        <i className="fas fa-camera" style={{ fontSize: "11px" }}></i>
                                    )}
                                </button>
                                <input type="file" ref={fileInputRef} className="d-none" accept="image/*" onChange={handlePhotoUpload} />
                            </div>
                            <div className="text-center text-sm-start">
                                <h5 className="fw-bold mb-0">{user.nama}</h5>
                                <small className="text-muted"><i className="fas fa-envelope me-1"></i>{user.email}</small>
                                <div className="mt-1">
                                    <span className="badge text-white" style={{ background: roleBg, fontSize: "11px" }}>
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <ul className="nav nav-pills nav-fill gap-2 mb-3">
                    <li className="nav-item">
                        <button
                            className={`nav-link rounded-pill px-3 py-2 d-flex align-items-center justify-content-center gap-2 ${activeTab === "profile" ? "active bg-success" : "text-muted bg-transparent border"}`}
                            onClick={() => setActiveTab("profile")}
                            style={{ fontSize: "14px" }}
                        >
                            <i className="fas fa-user"></i> Informasi Profil
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link rounded-pill px-3 py-2 d-flex align-items-center justify-content-center gap-2 ${activeTab === "password" ? "active bg-success" : "text-muted bg-transparent border"}`}
                            onClick={() => setActiveTab("password")}
                            style={{ fontSize: "14px" }}
                        >
                            <i className="fas fa-lock"></i> Ubah Password
                        </button>
                    </li>
                </ul>

                {/* Profile Form */}
                {activeTab === "profile" && (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <form onSubmit={handleProfileSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small">
                                            <i className="fas fa-user me-1 text-success"></i> Nama Lengkap
                                        </label>
                                        <input type="text" className="form-control" value={form.nama}
                                            onChange={(e) => setForm({ ...form, nama: e.target.value })} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small">
                                            <i className="fas fa-envelope me-1 text-success"></i> Email
                                        </label>
                                        <input type="email" className="form-control bg-light" value={form.email} disabled />
                                        <small className="text-muted">Email tidak dapat diubah</small>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small">
                                            <i className="fas fa-phone me-1 text-success"></i> No. Handphone
                                        </label>
                                        <input type="text" className="form-control" value={form.noHp}
                                            onChange={(e) => setForm({ ...form, noHp: e.target.value })} placeholder="08123456789" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small">
                                            <i className="fas fa-map-marker-alt me-1 text-success"></i> Alamat
                                        </label>
                                        <textarea className="form-control" rows={2} value={form.alamat}
                                            onChange={(e) => setForm({ ...form, alamat: e.target.value })} placeholder="Alamat lengkap" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <button type="submit" className="btn btn-success rounded-pill px-4" disabled={loading}>
                                        {loading ? (<><span className="spinner-border spinner-border-sm me-2" />Menyimpan...</>)
                                            : (<><i className="fas fa-save me-2"></i>Simpan Perubahan</>)}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Password Form */}
                {activeTab === "password" && (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <form onSubmit={handlePasswordSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small">
                                            <i className="fas fa-lock me-1 text-success"></i> Password Baru
                                        </label>
                                        <input type="password" className="form-control" value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            placeholder="Minimal 6 karakter" required minLength={6} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small">
                                            <i className="fas fa-lock me-1 text-success"></i> Konfirmasi Password
                                        </label>
                                        <input type="password" className="form-control" value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                            placeholder="Ulangi password baru" required minLength={6} />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <button type="submit" className="btn btn-warning rounded-pill px-4" disabled={pwLoading}>
                                        {pwLoading ? (<><span className="spinner-border spinner-border-sm me-2" />Mengubah...</>)
                                            : (<><i className="fas fa-key me-2"></i>Ubah Password</>)}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
