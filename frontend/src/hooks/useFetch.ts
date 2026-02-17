import { useState, useEffect } from "react";
import { fetchApi } from "../api/client";

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface UseFetchOptions {
    immediate?: boolean;
}

export function useFetch<T>(endpoint: string | null, options: UseFetchOptions = { immediate: true }) {
    const [data, setData] = useState<T | null>(null);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        if (!endpoint) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetchApi<{ success: boolean; data: T; pagination?: Pagination }>(endpoint);
            if (response.success && response.data !== undefined) {
                setData(response.data);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
            } else {
                throw new Error("Data format invalid");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong");
            console.error(`Fetch error for ${endpoint}:`, err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (options.immediate && endpoint) {
            fetchData();
        }
    }, [endpoint]);

    return { data, loading, error, pagination, refetch: fetchData };
}
