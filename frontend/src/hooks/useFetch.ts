import { useState, useEffect, useCallback } from "react";
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

    const fetchData = useCallback(async (signal?: AbortSignal) => {
        if (!endpoint) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetchApi<{ success: boolean; data: T; pagination?: Pagination }>(endpoint, { signal });
            if (response.success && response.data !== undefined) {
                setData(response.data);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
            } else {
                throw new Error("Data format invalid");
            }
        } catch (err: any) {
            if (err.name === "AbortError") return;
            setError(err.message || "Something went wrong");
            console.error(`Fetch error for ${endpoint}:`, err);
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

    useEffect(() => {
        if (options.immediate && endpoint) {
            const controller = new AbortController();
            fetchData(controller.signal);
            return () => controller.abort();
        }
    }, [endpoint, fetchData, options.immediate]);

    return { data, loading, error, pagination, refetch: fetchData };
}
