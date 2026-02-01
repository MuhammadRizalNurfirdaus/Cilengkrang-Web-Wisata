import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchApi } from "../../api/client";
import { AuthResponse } from "../../types";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

export default function Register() {
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        password: "",
        confirmPassword: "",
        noHp: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Password konfirmasi tidak sesuai");
            return;
        }

        setLoading(true);

        try {
            const response = await fetchApi<AuthResponse>("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    nama: formData.nama,
                    email: formData.email,
                    password: formData.password,
                    noHp: formData.noHp,
                }),
            });

            if (response.success && response.data) {
                // Auto login after register
                login(response.data.token, response.data.user);
                navigate("/");
            } else {
                setError(response.message || "Registrasi gagal");
            }
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan saat registrasi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 my-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-header bg-success text-white text-center py-4">
                            <h4 className="fw-bold mb-0">Daftar Akun Baru</h4>
                            <p className="mb-0 opacity-75 small">Bergabunglah dengan komunitas kami</p>
                        </div>
                        <div className="card-body p-4 p-md-5">
                            {error && <Alert variant="danger" message={error} onClose={() => setError(null)} />}

                            <form onSubmit={handleSubmit}>
                                <Input
                                    label="Nama Lengkap"
                                    type="text"
                                    id="nama"
                                    placeholder="Nama Lengkap Anda"
                                    icon="fa-user"
                                    value={formData.nama}
                                    onChange={handleChange}
                                    required
                                />

                                <Input
                                    label="Email Address"
                                    type="email"
                                    id="email"
                                    placeholder="nama@email.com"
                                    icon="fa-envelope"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                                <Input
                                    label="Nomor Handphone"
                                    type="tel"
                                    id="noHp"
                                    placeholder="08123456789"
                                    icon="fa-phone"
                                    value={formData.noHp}
                                    onChange={handleChange}
                                />

                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <Input
                                            label="Password"
                                            type="password"
                                            id="password"
                                            placeholder="******"
                                            icon="fa-lock"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <Input
                                            label="Konfirmasi Password"
                                            type="password"
                                            id="confirmPassword"
                                            placeholder="******"
                                            icon="fa-lock"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-check mb-4">
                                    <input className="form-check-input" type="checkbox" id="terms" required />
                                    <label className="form-check-label small text-muted" htmlFor="terms">
                                        Saya setuju dengan <a href="#" className="text-success text-decoration-none">Syarat & Ketentuan</a>
                                    </label>
                                </div>

                                <Button type="submit" className="w-100 rounded-pill mb-3" isLoading={loading}>
                                    Daftar Sekarang
                                </Button>

                                <div className="text-center small text-muted">
                                    Sudah punya akun?{" "}
                                    <Link to="/login" className="text-success fw-bold text-decoration-none">
                                        Masuk Disini
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
