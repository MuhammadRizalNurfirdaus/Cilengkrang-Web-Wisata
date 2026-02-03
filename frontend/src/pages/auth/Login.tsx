import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchApi } from "../../api/client";
import { AuthResponse } from "../../types";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetchApi<AuthResponse>("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            if (response.success && response.data) {
                login(response.data.token, response.data.user);

                // Redirect based on role
                const role = response.data.user.role;
                if (role === "admin") {
                    navigate("/admin/dashboard");
                } else if (role === "kasir") {
                    navigate("/kasir/dashboard");
                } else if (role === "owner") {
                    navigate("/owner/dashboard");
                } else {
                    navigate("/user/dashboard");
                }
            } else {
                setError(response.message || "Login gagal");
            }
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan saat login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 my-5">
            <div className="row justify-content-center">
                <div className="col-md-5 col-lg-4">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-header bg-success text-white text-center py-4">
                            <h4 className="fw-bold mb-0">Masuk Akun</h4>
                            <p className="mb-0 opacity-75 small">Selamat datang kembali!</p>
                        </div>
                        <div className="card-body p-4 p-md-5">
                            {error && <Alert variant="danger" message={error} onClose={() => setError(null)} />}

                            <form onSubmit={handleSubmit}>
                                <Input
                                    label="Email Address"
                                    type="email"
                                    id="email"
                                    placeholder="nama@email.com"
                                    icon="fa-envelope"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                                <Input
                                    label="Password"
                                    type="password"
                                    id="password"
                                    placeholder="******"
                                    icon="fa-lock"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="remember" />
                                        <label className="form-check-label small" htmlFor="remember">
                                            Ingat Saya
                                        </label>
                                    </div>
                                    <a href="#" className="small text-success text-decoration-none fw-medium">
                                        Lupa Password?
                                    </a>
                                </div>

                                <Button type="submit" className="w-100 rounded-pill mb-3" isLoading={loading}>
                                    Masuk Sekarang
                                </Button>

                                <div className="text-center small text-muted">
                                    Belum punya akun?{" "}
                                    <Link to="/register" className="text-success fw-bold text-decoration-none">
                                        Daftar Disini
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
