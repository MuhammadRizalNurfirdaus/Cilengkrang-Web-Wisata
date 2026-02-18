import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import HeroVideo from "../../components/sections/HeroVideo";
import Features from "../../components/sections/Features";
import Destinations from "../../components/sections/Destinations";
import Articles from "../../components/sections/Articles";
import Testimonials from "../../components/sections/Testimonials";

export default function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <>
            <HeroVideo />
            <Features />
            <Destinations />
            <div className="py-5 bg-success text-white text-center">
                <div className="container">
                    <h2 className="fw-bold mb-3">Siap untuk Petualangan?</h2>
                    <p className="lead mb-4">Pesan tiket sekarang dan nikmati liburan tak terlupakan.</p>
                    <Link
                        to={isAuthenticated ? "/destinations" : "/login"}
                        className="btn btn-light btn-lg rounded-pill px-5 text-success fw-bold shadow"
                    >
                        {isAuthenticated ? "Jelajahi Destinasi" : "Pesan Tiket Sekarang"}
                    </Link>
                </div>
            </div>
            <Articles />
            <Testimonials />
        </>
    );
}
