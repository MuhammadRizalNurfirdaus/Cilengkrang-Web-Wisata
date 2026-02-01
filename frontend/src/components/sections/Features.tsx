export default function Features() {
    const features = [
        {
            icon: "fa-tree",
            title: "Alam Asri",
            description: "Nikmati udara segar dan pemandangan hijau yang menenangkan jiwa.",
        },
        {
            icon: "fa-camera",
            title: "Spot Foto",
            description: "Beragam spot foto instagramable untuk mengabadikan momen berharga.",
        },
        {
            icon: "fa-campground",
            title: "Camping Ground",
            description: "Area camping luas dengan fasilitas lengkap untuk bermalam di alam bebas.",
        },
        {
            icon: "fa-person-swimming",
            title: "Kolam Renang",
            description: "Segarkan diri di kolam renang dengan air pegunungan yang jernih.",
        },
    ];

    return (
        <section className="py-5 bg-white">
            <div className="container py-4">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-success display-6">Mengapa Memilih Kami?</h2>
                    <p className="text-muted lead">Fasilitas dan keunggulan Lembah Cilengkrang</p>
                </div>
                <div className="row g-4">
                    {features.map((feature, index) => (
                        <div key={index} className="col-md-3 text-center">
                            <div
                                className="feature-icon bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                style={{ width: "80px", height: "80px" }}
                            >
                                <i className={`fas ${feature.icon} fa-2x`}></i>
                            </div>
                            <h5 className="fw-bold mb-2">{feature.title}</h5>
                            <p className="text-muted small">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
