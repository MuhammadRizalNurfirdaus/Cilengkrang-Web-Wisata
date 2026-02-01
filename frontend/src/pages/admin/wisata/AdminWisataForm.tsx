import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchApi, getImageUrl } from "../../../api/client";
import { useFetch } from "../../../hooks/useFetch";
import { Wisata } from "../../../types";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";

export default function AdminWisataForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        nama: "",
        deskripsi: "",
        lokasi: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch data if editing
    const { data: existingData } = useFetch<Wisata>(
        isEdit ? `/wisata/${id}` : null
    );

    useEffect(() => {
        if (existingData) {
            setFormData({
                nama: existingData.nama,
                deskripsi: existingData.deskripsi || "",
                lokasi: existingData.lokasi || "",
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
            data.append("nama", formData.nama);
            data.append("deskripsi", formData.deskripsi);
            data.append("lokasi", formData.lokasi);
            if (imageFile) {
                data.append("gambar", imageFile);
            }

            await fetchApi(isEdit ? `/wisata/${id}` : "/wisata", {
                method: isEdit ? "PUT" : "POST",
                body: data,
            });

            navigate("/admin/wisata");
        } catch (err: any) {
            setError(err.message || "Gagal menyimpan data wisata");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 mt-5">
            <div className="d-flex align-items-center mb-4">
                <Link to="/admin/wisata" className="btn btn-outline-secondary btn-sm rounded-circle me-3">
                    <i className="fas fa-arrow-left"></i>
                </Link>
                <div>
                    <h2 className="fw-bold text-dark mb-0">{isEdit ? "Edit Wisata" : "Tambah Wisata Baru"}</h2>
                    <p className="text-muted mb-0">Isi formulir berikut untuk {isEdit ? "memperbarui" : "menambahkan"} destinasi</p>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-body p-5">
                    {error && <Alert variant="danger" message={error} onClose={() => setError(null)} />}

                    <form onSubmit={handleSubmit}>
                        <div className="row mb-4">
                            <div className="col-md-8">
                                <Input
                                    label="Nama Destinasi"
                                    id="nama"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    required
                                />

                                <div className="mb-3">
                                    <label htmlFor="deskripsi" className="form-label small fw-medium text-black-50 uppercase tracking-wide">Deskripsi</label>
                                    <textarea
                                        id="deskripsi"
                                        className="form-control"
                                        rows={5}
                                        value={formData.deskripsi}
                                        onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                    ></textarea>
                                </div>

                                <Input
                                    label="Lokasi"
                                    id="lokasi"
                                    value={formData.lokasi}
                                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label small fw-medium text-black-50 uppercase tracking-wide">Gambar Utama</label>
                                <div className="card bg-light border-dashed text-center d-flex align-items-center justify-content-center overflow-hidden position-relative" style={{ height: "250px", borderStyle: "dashed", borderWidth: "2px" }}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-100 h-100 object-fit-cover position-absolute top-0 start-0" />
                                    ) : (
                                        <div className="text-muted">
                                            <i className="fas fa-image fa-3x mb-2 opacity-50"></i>
                                            <p className="mb-0 small">Belum ada gambar</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <div className="form-text text-center mt-2">Klik area diatas untuk upload gambar</div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                            <Link to="/admin/wisata" className="btn btn-light">Batal</Link>
                            <Button type="submit" variant="success" isLoading={loading} className="px-4">
                                <i className="fas fa-save me-2"></i> {isEdit ? "Update Data" : "Simpan Data"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
