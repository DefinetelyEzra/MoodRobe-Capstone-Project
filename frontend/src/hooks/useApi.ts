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

    useEffect(() => {
        apiFunctionRef.current = apiFunction;
    }, [apiFunction]);

    const execute = useCallback(async (params?: P): Promise<T> => {
        // Cancel previous request only if there's one in progress
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await apiFunctionRef.current(params as P);

            // Only update state if request wasn't aborted
            if (!abortController.signal.aborted) {
                setState({ data: response, isLoading: false, error: null });
                abortControllerRef.current = null;
                return response;
            }

            // Request was aborted, throw abort error
            const abortError = new Error('Request aborted');
            abortError.name = 'AbortError';
            throw abortError;
        } catch (err) {
            // Don't update state if request was aborted
            if (abortController.signal.aborted) {
                const abortError = new Error('Request aborted');
                abortError.name = 'AbortError';
                throw abortError;
            }

            const error = err as AxiosError;
            setState({ data: null, isLoading: false, error });
            abortControllerRef.current = null;
            throw error;
        }
    }, []);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return { ...state, execute };
}