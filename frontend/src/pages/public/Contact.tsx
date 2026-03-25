import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { fetchApi } from "../../api/client";
import { SITE_MAPS_URL } from "../../utils/destinationMedia";
import { getErrorMessage } from "../../utils/error";
import { ValidationRules } from "../../utils/validation";

export default function Contact() {
    const instagramUrl = "https://www.instagram.com/pesona.lembahcilengkrang/";
    const fullAddress = "Jl. Pejambon, Pajambon, Kecamatan Kramatmulya, Kabupaten Kuningan, Jawa Barat 45553";

    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        subjek: "",
        pesan: "",
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "danger"; message: string } | null>(null);

    const contactDetails = [
        {
            icon: "fa-map-marker-alt",
            label: "Alamat",
            content: (
                <a href={SITE_MAPS_URL} target="_blank" rel="noopener noreferrer">
                    {fullAddress}
                </a>
            ),
        },
        {
            icon: "fa-envelope",
            label: "Email",
            content: <a href="mailto:info@lembahcilengkrang.com">info@lembahcilengkrang.com</a>,
        },
        {
            icon: "fa-phone-alt",
            label: "WhatsApp",
            content: <a href="https://wa.me/6281234567890">+62 812-3456-7890</a>,
        },
    ];

    const socialLinks = [
        { icon: "fa-facebook-f", href: "https://facebook.com", label: "Facebook resmi" },
        { icon: "fa-instagram", href: instagramUrl, label: "Instagram resmi" },
        { icon: "fa-youtube", href: "https://youtube.com", label: "YouTube resmi" },
    ];

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
        <section className="contact-page">
            <div className="container">
                <div className="contact-hero text-center">
                    <span className="contact-kicker">Pusat Informasi</span>
                    <h1 className="contact-title">Hubungi Lembah Cilengkrang</h1>
                    <p className="contact-subtitle">
                        Kami siap membantu untuk informasi destinasi, pemesanan tiket, dan rute menuju lokasi resmi
                        Lembah Cilengkrang.
                    </p>
                </div>

                <div className="row g-4 align-items-stretch">
                    <div className="col-lg-5">
                        <div className="contact-info-panel">
                            <span className="contact-panel-label">Informasi Kontak</span>
                            <h2 className="contact-panel-title">
                                Semua kanal utama kami ada di sini, dari arah lokasi sampai dokumentasi resmi.
                            </h2>
                            <p className="contact-panel-copy">
                                Gunakan Google Maps untuk rute yang akurat dan Instagram resmi untuk melihat suasana
                                terbaru kawasan wisata.
                            </p>

                            <div className="contact-detail-list">
                                {contactDetails.map((item) => (
                                    <div key={item.label} className="contact-detail-item">
                                        <div className="contact-detail-icon">
                                            <i className={`fas ${item.icon}`}></i>
                                        </div>
                                        <div>
                                            <span className="contact-detail-label">{item.label}</span>
                                            <div className="contact-detail-value">{item.content}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <a
                                href={SITE_MAPS_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-map-link"
                            >
                                <i className="fas fa-route"></i>
                                Buka Rute di Google Maps
                            </a>

                            <div className="contact-social-section">
                                <span className="contact-detail-label">Ikuti Kami</span>
                                <div className="contact-social-row">
                                    {socialLinks.map((item) => (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="contact-social-link"
                                            aria-label={item.label}
                                        >
                                            <i className={`fab ${item.icon}`}></i>
                                        </a>
                                    ))}
                                </div>
                                <p className="contact-social-note mb-0">
                                    Dokumentasi terbaru tersedia di Instagram resmi{" "}
                                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                                        @pesona.lembahcilengkrang
                                    </a>
                                    .
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-7">
                        <div className="contact-form-panel">
                            <span className="contact-panel-label contact-panel-label-dark">Kirim Pesan</span>
                            <h2 className="contact-form-title">Sampaikan pertanyaan Anda dengan jelas dan cepat.</h2>
                            <p className="contact-form-copy">
                                Isi formulir berikut dan kami akan membantu secepat mungkin selama jam operasional.
                            </p>

                            {status && (
                                <div className="contact-status">
                                    <Alert variant={status.type} message={status.message} onClose={() => setStatus(null)} />
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <Input
                                            label="Nama Lengkap"
                                            id="nama"
                                            value={formData.nama}
                                            onChange={handleChange}
                                            error={fieldErrors.nama}
                                            icon="fa-user"
                                            className="contact-input"
                                            placeholder="Nama lengkap Anda"
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
                                            icon="fa-envelope"
                                            className="contact-input"
                                            placeholder="email@contoh.com"
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
                                    icon="fa-tag"
                                    className="contact-input"
                                    placeholder="Apa yang ingin Anda tanyakan?"
                                    required
                                />

                                <div className="mb-4">
                                    <label htmlFor="pesan" className="form-label contact-form-label">
                                        Pesan
                                    </label>
                                    <textarea
                                        id="pesan"
                                        rows={6}
                                        className={`form-control contact-textarea ${fieldErrors.pesan ? "is-invalid" : ""}`}
                                        value={formData.pesan}
                                        onChange={handleChange}
                                        required
                                        placeholder="Tulis pesan Anda dengan detail agar kami bisa membantu lebih tepat."
                                    ></textarea>
                                    {fieldErrors.pesan && (
                                        <div className="invalid-feedback d-block">{fieldErrors.pesan}</div>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    variant="success"
                                    className="contact-submit-btn"
                                    isLoading={loading}
                                >
                                    Kirim Pesan <i className="fas fa-paper-plane"></i>
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
