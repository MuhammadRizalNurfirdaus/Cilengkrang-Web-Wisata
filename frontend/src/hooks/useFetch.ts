import { useState, useEffect } from "react";
import { fetchApi } from "../api/client";

interface UseFetchOptions {
    immediate?: boolean;
}

export function useFetch<T>(endpoint: string, options: UseFetchOptions = { immediate: true }) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchApi<{ success: boolean; data: T }>(endpoint);
            if (response.success && response.data) {
                setData(response.data);
            } else {
                throw new Error("Data format invalid");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (options.immediate && endpoint) {
            fetchData();
        }
    }, [endpoint]);

    return { data, loading, error, refetch: fetchData };
}
