import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchApi, getImageUrl } from "../../../api/client";
import { useFetch } from "../../../hooks/useFetch";
import { Article } from "../../../types";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";

export default function AdminArticleForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        judul: "",
        isi: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: existingData } = useFetch<Article>(
        isEdit ? `/articles/${id}` : null
    );

    useEffect(() => {
        if (existingData) {
            setFormData({
                judul: existingData.judul,
                isi: existingData.isi,
            });
            if (existingData.gambar) {
                setImagePreview(getImageUrl(existingData.gambar));
            }
        }
    }, [existingData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = new FormData();
            data.append("judul", formData.judul);
            data.append("isi", formData.isi);
            if (imageFile) {
                data.append("gambar", imageFile);
            }

            await fetchApi(isEdit ? `/articles/${id}` : "/articles", {
                method: isEdit ? "PUT" : "POST",
                body: data,
            });

            navigate("/admin/articles");
        } catch (err: any) {
            setError(err.message || "Gagal menyimpan artikel");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 mt-5">
            <div className="d-flex align-items-center mb-4">
                <Link to="/admin/articles" className="btn btn-outline-secondary btn-sm rounded-circle me-3">
                    <i className="fas fa-arrow-left"></i>
                </Link>
                <div>
                    <h2 className="fw-bold text-dark mb-0">{isEdit ? "Edit Artikel" : "Buat Artikel Baru"}</h2>
                    <p className="text-muted mb-0">Isi formulir berikut untuk {isEdit ? "memperbarui" : "membuat"} artikel berita</p>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-body p-5">
                    {error && <Alert variant="danger" message={error} onClose={() => setError(null)} />}

                    <form onSubmit={handleSubmit}>
                        <div className="row mb-4">
                            <div className="col-md-8">
                                <Input
                                    label="Judul Artikel"
                                    id="judul"
                                    value={formData.judul}
                                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                                    required
                                />

                                <div className="mb-3">
                                    <label htmlFor="isi" className="form-label small fw-medium text-black-50 uppercase tracking-wide">Isi Konten</label>
                                    <textarea
                                        id="isi"
                                        className="form-control font-monospace"
                                        rows={15}
                                        value={formData.isi}
                                        onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                                        required
                                    ></textarea>
                                    <div className="form-text">Gunakan format markdown sederhana atau text biasa.</div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label small fw-medium text-black-50 uppercase tracking-wide">Gambar Sampul</label>
                                <div className="card bg-light border-dashed text-center d-flex align-items-center justify-content-center overflow-hidden position-relative" style={{ height: "200px", borderStyle: "dashed", borderWidth: "2px" }}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-100 h-100 object-fit-cover position-absolute top-0 start-0" />
                                    ) : (
                                        <div className="text-muted">
                                            <i className="fas fa-image fa-3x mb-2 opacity-50"></i>
                                            <p className="mb-0 small">Upload Sampul</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                            <Link to="/admin/articles" className="btn btn-light">Batal</Link>
                            <Button type="submit" variant="success" isLoading={loading} className="px-4">
                                <i className="fas fa-save me-2"></i> {isEdit ? "Update Artikel" : "Terbitkan Artikel"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
