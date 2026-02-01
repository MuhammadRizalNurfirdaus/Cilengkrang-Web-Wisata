const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    // Handle FormData (don't set Content-Type)
    if (options.body instanceof FormData) {
        delete (headers as any)["Content-Type"];
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan pada request API");
    }

    return data as T;
}

export const getImageUrl = (path?: string | null) => {
    if (!path) return "https://placehold.co/600x400?text=No+Image";
    if (path.startsWith("http")) return path;
    return `http://localhost:3001/${path}`; // Assuming static serve from root/uploads or similar
};
