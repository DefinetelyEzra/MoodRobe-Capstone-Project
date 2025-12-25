import React, { useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Aesthetic } from '@/types/aesthetic.types';
import { aestheticApi } from '@/api/aesthetic.api';
import { useAuth } from '@/hooks/useAuth';
import { AestheticContext, AestheticContextType } from './AestheticContext';
import { getThemeByAesthetic, applyTheme, aestheticThemes } from '@/themes/aestheticThemes';

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
            } else {
                // No aesthetic selected - use default theme
                setSelectedAesthetic(null);
            }
        } catch (error: unknown) {
            console.error('Failed to load aesthetics:', error);

            let errorMessage = 'Failed to load aesthetics';
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (error && typeof error === 'object' && 'response' in error) {
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

        // Apply theme based on selected aesthetic
        if (aesthetic && aesthetic.id !== 'none') {
            const theme = getThemeByAesthetic(aesthetic.name);
            applyTheme(theme);
            localStorage.setItem('selectedAesthetic', JSON.stringify(aesthetic));
        } else {
            // Apply default theme when no aesthetic is selected or "none" is selected
            const defaultTheme = aestheticThemes.default;
            applyTheme(defaultTheme);
            localStorage.removeItem('selectedAesthetic');
        }
    }, []);

    // Apply theme on mount based on selected aesthetic
    useEffect(() => {
        if (selectedAesthetic && selectedAesthetic.id !== 'none') {
            const theme = getThemeByAesthetic(selectedAesthetic.name);
            applyTheme(theme);
        } else {
            // Apply default theme if no aesthetic is selected
            const defaultTheme = aestheticThemes.default;
            applyTheme(defaultTheme);
        }
    }, [selectedAesthetic]);

    useEffect(() => {
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