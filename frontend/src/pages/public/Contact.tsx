import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { fetchApi } from "../../api/client";
import { getErrorMessage } from "../../utils/error";
import { ValidationRules } from "../../utils/validation";

export default function Contact() {
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        subjek: "",
        pesan: "",
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "danger"; message: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        if (fieldErrors[id]) {
            setFieldErrors({ ...fieldErrors, [id]: "" });
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.nama.trim()) {
            errors.nama = ValidationRules.getValidationError("nama", "required");
        } else if (formData.nama.trim().length < 2) {
            errors.nama = ValidationRules.getValidationError("nama", "minLength");
        }

        if (!formData.email.trim()) {
            errors.email = ValidationRules.getValidationError("email", "required");
        } else if (!ValidationRules.isValidEmail(formData.email)) {
            errors.email = ValidationRules.getValidationError("email", "invalid");
        }

        if (!formData.subjek.trim()) {
            errors.subjek = "Subjek wajib diisi";
        } else if (formData.subjek.trim().length < 3) {
            errors.subjek = "Subjek minimal 3 karakter";
        }

        if (!formData.pesan.trim()) {
            errors.pesan = "Pesan wajib diisi";
        } else if (formData.pesan.trim().length < 10) {
            errors.pesan = "Pesan minimal 10 karakter";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            await fetchApi("/contacts", {
                method: "POST",
                body: JSON.stringify(formData),
            });
            setStatus({ type: "success", message: "Pesan Anda telah terkirim! Terima kasih telah menghubungi kami." });
            setFormData({ nama: "", email: "", subjek: "", pesan: "" });
        } catch (err: unknown) {
            setStatus({ type: "danger", message: getErrorMessage(err, "Gagal mengirim pesan.") });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 mt-5">
            <div className="text-center mb-5">
                <h1 className="fw-bold text-success display-5">Hubungi Kami</h1>
                <p className="text-muted lead">Kami siap membantu menjawab pertanyaan Anda</p>
            </div>

            <div className="row g-5 justify-content-center">
                <div className="col-md-5">
                    <div className="h-100 p-4 bg-success text-white rounded-4 shadow-sm">
                        <h3 className="fw-bold mb-4">Informasi Kontak</h3>

                        <div className="mb-4 d-flex">
                            <i className="fas fa-map-marker-alt fa-lg mt-1 me-3 opacity-75"></i>
                            <div>
                                <h6 className="fw-bold mb-1">Alamat</h6>
                                <p className="mb-0 opacity-75">Desa Cilengkrang, Kec. Pasaleman<br />Kab. Cirebon, Jawa Barat</p>
                            </div>
                        </div>

                        <div className="mb-4 d-flex">
                            <i className="fas fa-envelope fa-lg mt-1 me-3 opacity-75"></i>
                            <div>
                                <h6 className="fw-bold mb-1">Email</h6>
                                <p className="mb-0 opacity-75">info@lembahcilengkrang.com</p>
                            </div>
                        </div>

                        <div className="mb-4 d-flex">
                            <i className="fas fa-phone fa-lg mt-1 me-3 opacity-75"></i>
                            <div>
                                <h6 className="fw-bold mb-1">WhatsApp</h6>
                                <p className="mb-0 opacity-75">+62 812-3456-7890</p>
                            </div>
                        </div>

                        <div className="mt-5">
                            <h6 className="fw-bold mb-3">Ikuti Kami</h6>
                            <div className="d-flex gap-3">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light rounded-circle p-2" style={{ width: 40, height: 40 }}><i className="fab fa-facebook-f"></i></a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light rounded-circle p-2" style={{ width: 40, height: 40 }}><i className="fab fa-instagram"></i></a>
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light rounded-circle p-2" style={{ width: 40, height: 40 }}><i className="fab fa-youtube"></i></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-7">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-body p-5">
                            <h4 className="fw-bold mb-4">Kirim Pesan</h4>
                            {status && <Alert variant={status.type} message={status.message} onClose={() => setStatus(null)} />}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Input
                                            label="Nama Lengkap"
                                            id="nama"
                                            value={formData.nama}
                                            onChange={handleChange}
                                            error={fieldErrors.nama}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <Input
                                            label="Email"
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            error={fieldErrors.email}
                                            required
                                        />
                                    </div>
                                </div>

                                <Input
                                    label="Subjek"
                                    id="subjek"
                                    value={formData.subjek}
                                    onChange={handleChange}
                                    error={fieldErrors.subjek}
                                    placeholder="Apa yang ingin Anda tanyakan?"
                                    required
                                />

                                <div className="mb-4">
                                    <label htmlFor="pesan" className="form-label small fw-medium text-muted uppercase tracking-wide">
                                        Pesan
                                        {fieldErrors.pesan && <span className="text-danger ms-1">*</span>}
                                    </label>
                                    <textarea
                                        id="pesan"
                                        rows={6}
                                        className={`form-control ${fieldErrors.pesan ? "is-invalid" : ""}`}
                                        value={formData.pesan}
                                        onChange={handleChange}
                                        required
                                        placeholder="Tulis pesan Anda di sini... (minimal 10 karakter)"
                                    ></textarea>
                                    {fieldErrors.pesan && <div className="invalid-feedback" style={{ display: "block" }}>{fieldErrors.pesan}</div>}
                                </div>

                                <Button type="submit" variant="success" className="rounded-pill px-4" isLoading={loading}>
                                    Kirim Pesan <i className="fas fa-paper-plane ms-2"></i>
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
