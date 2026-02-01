import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { Wisata } from "../../types";
import { getImageUrl, fetchApi } from "../../api/client";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Alert from "../../components/ui/Alert";

export default function Booking() {
    const [searchParams] = useSearchParams();
    const wisataId = searchParams.get("wisataId");
    const { user } = useAuth();
    const navigate = useNavigate();

    const [date, setDate] = useState("");
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: wisata, loading: loadingWisata } = useFetch<Wisata>(
        wisataId ? `/wisata/${wisataId}` : null
    );

    useEffect(() => {
        if (!wisataId) {
            navigate("/destinations");
        }
        if (!user) {
            navigate("/login");
        }
    }, [wisataId, user, navigate]);

    const handleQuantityChange = (ticketId: number, delta: number) => {
        setQuantities(prev => {
            const current = prev[ticketId] || 0;
            const next = Math.max(0, current + delta);
            return { ...prev, [ticketId]: next };
        });
    };

    const calculateTotal = () => {
        if (!wisata?.jenisTiket) return 0;
        return wisata.jenisTiket.reduce((total, ticket) => {
            const qty = quantities[ticket.id] || 0;
            return total + (ticket.harga * qty);
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const items = Object.entries(quantities)
            .filter(([_, qty]) => qty > 0)
            .map(([id, qty]) => ({
                jenisTiketId: parseInt(id),
                jumlah: qty
            }));

        if (items.length === 0) {
            setError("Mohon pilih minimal 1 tiket");
            setLoading(false);
            return;
        }

        if (!date) {
            setError("Tanggal kunjungan wajib diisi");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                userId: user?.id,
                tanggalKunjungan: new Date(date).toISOString(),
                items,
                catatan: `Booking Wisata: ${wisata?.nama}`
            };

            await fetchApi("/pemesanan", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            navigate("/user/history");
        } catch (err: any) {
            setError(err.message || "Gagal membuat pesanan");
        } finally {
            setLoading(false);
        }
    };

    if (loadingWisata) return <div className="py-5 mt-5 text-center"><div className="spinner-border text-success"></div></div>;
    if (!wisata) return <div className="py-5 mt-5 text-center">Destinasi tidak ditemukan</div>;

    const totalHarga = calculateTotal();

    return (
        <div className="container py-5 mt-5">
            <Link to={`/destinations/${wisataId}`} className="btn btn-outline-secondary btn-sm rounded-circle mb-4"><i className="fas fa-arrow-left"></i></Link>

            <div className="row g-5">
                <div className="col-lg-7">
                    <h2 className="fw-bold text-success mb-4">Form Pemesanan Tiket</h2>
                    {error && <Alert variant="danger" message={error} onClose={() => setError(null)} />}

                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">Informasi Kunjungan</h5>
                            <Input label="Tanggal Kunjungan" type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} required />
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">Pilih Tiket</h5>
                            {wisata.jenisTiket?.map(tiket => (
                                <div key={tiket.id} className="d-flex justify-content-between align-items-center border-bottom py-3">
                                    <div>
                                        <h6 className="fw-bold mb-1">{tiket.namaLayananDisplay}</h6>
                                        <span className={`badge ${tiket.tipeHari === "Hari Libur" ? "bg-danger" : tiket.tipeHari === "Hari Kerja" ? "bg-info" : "bg-primary"}`}>{tiket.tipeHari}</span>
                                        <div className="text-success fw-bold mt-1">Rp {tiket.harga.toLocaleString("id-ID")}</div>
                                    </div>
                                    <div className="d-flex align-items-center bg-light rounded-pill p-1 border">
                                        <button type="button" className="btn btn-sm btn-light rounded-circle text-success" style={{ width: 30, height: 30 }} onClick={() => handleQuantityChange(tiket.id, -1)}><i className="fas fa-minus fa-xs"></i></button>
                                        <span className="mx-3 fw-bold" style={{ minWidth: "20px", textAlign: "center" }}>{quantities[tiket.id] || 0}</span>
                                        <button type="button" className="btn btn-sm btn-success rounded-circle text-white shadow-sm" style={{ width: 30, height: 30 }} onClick={() => handleQuantityChange(tiket.id, 1)}><i className="fas fa-plus fa-xs"></i></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card border-0 shadow-lg sticky-top" style={{ top: "100px" }}>
                        <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                            <h4 className="fw-bold mb-0">Ringkasan Pesanan</h4>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                                <img src={getImageUrl(wisata.gambar)} alt={wisata.nama} className="rounded object-fit-cover shadow-sm me-3" width="80" height="80" />
                                <div><h6 className="fw-bold mb-1">{wisata.nama}</h6><small className="text-muted"><i className="fas fa-calendar-alt me-1"></i> {date ? new Date(date).toLocaleDateString("id-ID") : "-"}</small></div>
                            </div>
                            <div className="mb-3">
                                {Object.entries(quantities).map(([id, qty]) => {
                                    if (qty === 0) return null;
                                    const tiket = wisata.jenisTiket?.find(t => t.id === parseInt(id));
                                    if (!tiket) return null;
                                    return (
                                        <div key={id} className="d-flex justify-content-between mb-2 small text-muted">
                                            <span>{tiket.namaLayananDisplay} x {qty}</span>
                                            <span>Rp {(tiket.harga * qty).toLocaleString("id-ID")}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="d-flex justify-content-between align-items-center border-top pt-3 mb-4">
                                <h5 className="fw-bold mb-0">Total Pembayaran</h5>
                                <h4 className="fw-bold text-success mb-0">Rp {totalHarga.toLocaleString("id-ID")}</h4>
                            </div>
                            <Button onClick={handleSubmit} variant="success" isLoading={loading} className="w-100 py-3 fw-bold rounded-pill text-uppercase shadow-sm" disabled={totalHarga === 0 || !date}>Buat Pesanan <i className="fas fa-arrow-right ms-2"></i></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
