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

    const execute = useCallback(async (params?: P): Promise<T> => {
        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        setState({ data: null, isLoading: true, error: null });

        try {
            const response = await apiFunction(params as P);
            if (!abortController.signal.aborted) {
                setState({ data: response, isLoading: false, error: null });
                return response;
            }
            throw new Error('Request aborted');
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                throw err;
            }
            const error = err as AxiosError;
            setState({ data: null, isLoading: false, error });
            throw error;
        } finally {
            abortControllerRef.current = null;
        }
    }, [apiFunction]);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return { ...state, execute };
}