import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchApi } from "../../api/client";
import { AuthResponse } from "../../types";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { getErrorMessage } from "../../utils/error";
import { ValidationRules } from "../../utils/validation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (fieldErrors.email) {
            setFieldErrors({ ...fieldErrors, email: "" });
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (fieldErrors.password) {
            setFieldErrors({ ...fieldErrors, password: "" });
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!email.trim()) {
            errors.email = ValidationRules.getValidationError("email", "required");
        } else if (!ValidationRules.isValidEmail(email)) {
            errors.email = ValidationRules.getValidationError("email", "invalid");
        }

        if (!password) {
            errors.password = ValidationRules.getValidationError("password", "required");
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

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
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Terjadi kesalahan saat login"));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError(null);
        try {
            const response = await fetchApi<{ success: boolean; data: { url: string } }>("/auth/google/url");
            if (response.success && response.data?.url) {
                window.location.href = response.data.url;
            } else {
                setError("Gagal mendapatkan URL Google login");
            }
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Gagal memulai login Google"));
            setGoogleLoading(false);
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
                                    onChange={handleEmailChange}
                                    error={fieldErrors.email}
                                    required
                                />

                                <Input
                                    label="Password"
                                    type="password"
                                    id="password"
                                    placeholder="Password Anda"
                                    icon="fa-lock"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    error={fieldErrors.password}
                                    required
                                />

                                <div className="mb-4">
                                </div>

                                <Button type="submit" className="w-100 rounded-pill mb-3" isLoading={loading}>
                                    Masuk Sekarang
                                </Button>

                                <div className="d-flex align-items-center my-3">
                                    <hr className="flex-grow-1" />
                                    <span className="px-3 text-muted small">atau</span>
                                    <hr className="flex-grow-1" />
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary w-100 rounded-pill d-flex align-items-center justify-content-center gap-2"
                                    onClick={handleGoogleLogin}
                                    disabled={googleLoading}
                                >
                                    {googleLoading ? (
                                        <span className="spinner-border spinner-border-sm" />
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 48 48">
                                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                        </svg>
                                    )}
                                    Masuk dengan Google
                                </button>

                                <div className="text-center small text-muted mt-3">
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
