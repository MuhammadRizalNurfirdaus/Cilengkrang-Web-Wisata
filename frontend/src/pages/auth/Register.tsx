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

export default function Register() {
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        password: "",
        confirmPassword: "",
        noHp: "",
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        
        // Clear field error on change
        if (fieldErrors[id]) {
            setFieldErrors({ ...fieldErrors, [id]: "" });
        }

        // Real-time validation for certain fields
        if (id === "noHp" && value && !ValidationRules.isValidPhoneNumber(value)) {
            // Let user type, validation happens on submit
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        // Validate nama
        if (!formData.nama.trim()) {
            errors.nama = ValidationRules.getValidationError("nama", "required");
        } else if (formData.nama.trim().length < 2) {
            errors.nama = ValidationRules.getValidationError("nama", "minLength");
        }

        // Validate email
        if (!formData.email.trim()) {
            errors.email = ValidationRules.getValidationError("email", "required");
        } else if (!ValidationRules.isValidEmail(formData.email)) {
            errors.email = ValidationRules.getValidationError("email", "invalid");
        }

        // Validate password
        if (!formData.password) {
            errors.password = ValidationRules.getValidationError("password", "required");
        } else if (!ValidationRules.isValidPassword(formData.password)) {
            errors.password = ValidationRules.getValidationError("password", "weak");
        }

        // Validate confirmPassword
        if (!formData.confirmPassword) {
            errors.confirmPassword = ValidationRules.getValidationError("confirmPassword", "required");
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = ValidationRules.getValidationError("password", "mismatch");
        }

        // Validate noHp (optional)
        if (formData.noHp && !ValidationRules.isValidPhoneNumber(formData.noHp)) {
            errors.noHp = ValidationRules.getValidationError("noHp", "invalid");
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
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Terjadi kesalahan saat registrasi"));
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
                                    error={fieldErrors.nama}
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
                                    error={fieldErrors.email}
                                    required
                                />

                                <Input
                                    label="Nomor Handphone"
                                    type="tel"
                                    id="noHp"
                                    placeholder="08123456789 atau +628123456789"
                                    icon="fa-phone"
                                    value={formData.noHp}
                                    onChange={handleChange}
                                    error={fieldErrors.noHp}
                                />

                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <Input
                                            label="Password"
                                            type="password"
                                            id="password"
                                            placeholder="6+ karakter"
                                            icon="fa-lock"
                                            value={formData.password}
                                            onChange={handleChange}
                                            error={fieldErrors.password}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <Input
                                            label="Konfirmasi Password"
                                            type="password"
                                            id="confirmPassword"
                                            placeholder="Ulangi password"
                                            icon="fa-lock"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            error={fieldErrors.confirmPassword}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-check mb-4">
                                    <input className="form-check-input" type="checkbox" id="terms" required />
                                    <label className="form-check-label small text-muted" htmlFor="terms">
                                        Saya setuju dengan <span className="text-success fw-medium">Syarat & Ketentuan</span> yang berlaku
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
