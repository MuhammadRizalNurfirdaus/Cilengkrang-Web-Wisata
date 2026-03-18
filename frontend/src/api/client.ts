import { ApiResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api";

export async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem("token");

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string> || {}),
    };

    // Handle FormData (don't set Content-Type)
    if (options.body instanceof FormData) {
        delete headers["Content-Type"];
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Handle non-JSON responses (502, HTML error pages, etc.)
    let data: ApiResponse<unknown>;
    try {
        data = await response.json();
    } catch {
        throw new Error(
            response.status === 502 ? "Server sedang tidak tersedia" :
            response.status === 504 ? "Server timeout" :
            `Server error (${response.status})`
        );
    }

    if (!response.ok) {
        // Auto-logout on 401 (expired token)
        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        throw new Error(data.message || "Terjadi kesalahan pada request API");
    }

    return data as T;
}

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:3002";

export const getImageUrl = (path?: string | null) => {
    if (!path) return "https://placehold.co/600x400?text=No+Image";
    if (path.startsWith("http")) return path;
    return `${API_BASE}/${path}`;
};
