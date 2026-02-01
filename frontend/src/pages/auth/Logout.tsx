import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }, []);

    return null;
}
