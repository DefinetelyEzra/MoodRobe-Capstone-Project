import React, { useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Aesthetic } from '@/types/aesthetic.types';
import { aestheticApi } from '@/api/aesthetic.api';
import { useAuth } from '@/hooks/useAuth';
import { AestheticContext, AestheticContextType } from './AestheticContext';

export const AestheticProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedAesthetic, setSelectedAesthetic] = useState<Aesthetic | null>(null);
    const [availableAesthetics, setAvailableAesthetics] = useState<Aesthetic[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const loadAesthetics = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const aesthetics = await aestheticApi.getAll();
            setAvailableAesthetics(aesthetics);

            // Load user's selected aesthetic if they have one
            if (user?.selectedAestheticId) {
                const selected = aesthetics.find((a) => a.id === user.selectedAestheticId);
                if (selected) {
                    setSelectedAesthetic(selected);
                }
            }
        } catch (error: unknown) {
            console.error('Failed to load aesthetics:', error);

            // Handle the error appropriately
            let errorMessage = 'Failed to load aesthetics';
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (error && typeof error === 'object' && 'response' in error) {
                // For API errors with response property
                const apiError = error as { response?: { data?: { error?: string } } };
                errorMessage = apiError.response?.data?.error || errorMessage;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [user?.selectedAestheticId]);

    const handleSetSelectedAesthetic = useCallback((aesthetic: Aesthetic | null): void => {
        setSelectedAesthetic(aesthetic);
        if (aesthetic) {
            localStorage.setItem('selectedAesthetic', JSON.stringify(aesthetic));
        } else {
            localStorage.removeItem('selectedAesthetic');
        }
    }, []);

    useEffect(() => {
        // Only load aesthetics once when component mounts
        loadAesthetics();
    }, [loadAesthetics]); 

    const contextValue = useMemo<AestheticContextType>(
        () => ({
            selectedAesthetic,
            availableAesthetics,
            isLoading,
            error,
            setSelectedAesthetic: handleSetSelectedAesthetic,
            loadAesthetics,
        }),
        [selectedAesthetic, availableAesthetics, isLoading, error, handleSetSelectedAesthetic, loadAesthetics]
    );

    return <AestheticContext.Provider value={contextValue}>{children}</AestheticContext.Provider>;
};