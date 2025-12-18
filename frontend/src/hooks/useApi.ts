import { useState, useCallback, useRef, useEffect } from 'react';
import { AxiosError } from 'axios';

export interface UseApiState<T> {
    data: T | null;
    isLoading: boolean;
    error: AxiosError | null;
}

export function useApi<T, P = void>(
    apiFunction: (params: P) => Promise<T>
) {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        isLoading: false,
        error: null,
    });

    const abortControllerRef = useRef<AbortController | null>(null);
    const apiFunctionRef = useRef(apiFunction);
    const mountedRef = useRef(true);

    useEffect(() => {
        apiFunctionRef.current = apiFunction;
    }, [apiFunction]);

    const execute = useCallback(async (params?: P): Promise<T | null> => {
        // Cancel previous request only if there's one in progress
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        if (mountedRef.current) {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
        }

        try {
            const response = await apiFunctionRef.current(params as P);

            // Only update state if component is still mounted
            if (mountedRef.current) {
                setState({ data: response, isLoading: false, error: null });
                abortControllerRef.current = null;
                return response;
            }

            return null;
        } catch (err) {
            // Don't update state or throw if component unmounted
            if (!mountedRef.current) {
                return null;
            }

            // Don't update state or throw if request was aborted
            if (err instanceof Error && err.name === 'AbortError') {
                console.log('Request was aborted');
                return null;
            }

            const error = err as AxiosError;
            setState({ data: null, isLoading: false, error });
            abortControllerRef.current = null;

            // Still throw the error so the calling code can handle it
            throw error;
        }
    }, []);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return { ...state, execute };
}