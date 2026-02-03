import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { fetchApi } from "../../api/client";

export default function Contact() {
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        subjek: "",
        pesan: "",
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "danger"; message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            await fetchApi("/contacts", {
                method: "POST",
                body: JSON.stringify(formData),
            });
            setStatus({ type: "success", message: "Pesan Anda telah terkirim! Terima kasih telah menghubungi kami." });
            setFormData({ nama: "", email: "", subjek: "", pesan: "" });
        } catch (err: any) {
            setStatus({ type: "danger", message: err.message || "Gagal mengirim pesan." });
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
                                <a href="#" className="btn btn-outline-light rounded-circle p-2" style={{ width: 40, height: 40 }}><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="btn btn-outline-light rounded-circle p-2" style={{ width: 40, height: 40 }}><i className="fab fa-instagram"></i></a>
                                <a href="#" className="btn btn-outline-light rounded-circle p-2" style={{ width: 40, height: 40 }}><i className="fab fa-youtube"></i></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-7">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-body p-5">
                            <h4 className="fw-bold mb-4 text-dark">Kirim Pesan</h4>
                            {status && <Alert variant={status.type} message={status.message} onClose={() => setStatus(null)} />}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Input
                                            label="Nama Lengkap"
                                            id="nama"
                                            value={formData.nama}
                                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <Input
                                            label="Email"
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <Input
                                    label="Subjek"
                                    id="subjek"
                                    value={formData.subjek}
                                    onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
                                    placeholder="Apa yang ingin Anda tanyakan?"
                                />

                                <div className="mb-4">
                                    <label htmlFor="pesan" className="form-label small fw-medium text-black-50 uppercase tracking-wide">Pesan</label>
                                    <textarea
                                        id="pesan"
                                        rows={6}
                                        className="form-control"
                                        value={formData.pesan}
                                        onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                                        required
                                        placeholder="Tulis pesan Anda di sini..."
                                    ></textarea>
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
