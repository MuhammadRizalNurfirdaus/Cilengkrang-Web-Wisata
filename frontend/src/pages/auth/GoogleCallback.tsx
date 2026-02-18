import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchApi } from "../../api/client";
import { AuthResponse } from "../../types";

export default function GoogleCallback() {
    const [searchParams] = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const code = searchParams.get("code");
        const errorParam = searchParams.get("error");

        if (errorParam) {
            setError("Login Google dibatalkan atau gagal.");
            setTimeout(() => navigate("/login"), 3000);
            return;
        }

        if (!code) {
            setError("Kode otorisasi tidak ditemukan.");
            setTimeout(() => navigate("/login"), 3000);
            return;
        }

        // Exchange code with backend
        const exchangeCode = async () => {
            try {
                const response = await fetchApi<AuthResponse>("/auth/google/callback", {
                    method: "POST",
                    body: JSON.stringify({ code }),
                });

                if (response.success && response.data) {
                    login(response.data.token, response.data.user);

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
                    setError(response.message || "Login Google gagal");
                }
            } catch (err: any) {
                console.error("Google callback error:", err);
                setError(err.message || "Terjadi kesalahan saat login Google");
                setTimeout(() => navigate("/login"), 3000);
            }
        };

        exchangeCode();
    }, [searchParams, login, navigate]);

    if (error) {
        return (
            <div className="container py-5 my-5 text-center">
                <div className="card border-0 shadow mx-auto" style={{ maxWidth: "400px" }}>
                    <div className="card-body p-5">
                        <i className="fas fa-exclamation-circle text-danger fa-3x mb-3"></i>
                        <h5 className="text-danger mb-3">Login Gagal</h5>
                        <p className="text-muted">{error}</p>
                        <p className="small text-muted">Mengalihkan ke halaman login...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5 my-5 text-center">
            <div className="card border-0 shadow mx-auto" style={{ maxWidth: "400px" }}>
                <div className="card-body p-5">
                    <div className="spinner-border text-success mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h5 className="text-success mb-2">Memproses Login Google...</h5>
                    <p className="text-muted small">Mohon tunggu sebentar</p>
                </div>
            </div>
        </div>
    );
}
