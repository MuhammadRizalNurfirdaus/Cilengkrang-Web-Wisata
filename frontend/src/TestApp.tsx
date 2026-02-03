export default function TestApp() {
    return (
        <div style={{ padding: "40px", textAlign: "center", background: "#2E8B57", minHeight: "100vh", color: "white" }}>
            <h1>✅ React Berhasil Dimuat!</h1>
            <p>Jika Anda melihat ini, frontend berfungsi dengan baik.</p>
            <div style={{ marginTop: "20px" }}>
                <a href="/" style={{ color: "white", marginRight: "20px" }}>Beranda</a>
                <a href="/destinations" style={{ color: "white", marginRight: "20px" }}>Destinasi</a>
                <a href="/login" style={{ color: "white" }}>Login</a>
            </div>
        </div>
    );
}
