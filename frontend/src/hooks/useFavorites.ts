import { useState, useCallback } from 'react';
import { favoriteApi } from '@/api/favorite.api';
import { Favorite } from '@/types/favorite.types';
import { useToast } from './useToast';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const fetchFavorites = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await favoriteApi.getUserFavorites();
            setFavorites(data);
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
            showToast('Failed to load favorites', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    const addFavorite = useCallback(async (productId: string) => {
        try {
            const newFavorite = await favoriteApi.addFavorite({ productId });
            setFavorites(prev => [newFavorite, ...prev]);
            showToast('Added to favorites', 'success');
        } catch (error) {
            console.error('Failed to add favorite:', error);
            throw error;
        }
    }, [showToast]);

    const removeFavorite = useCallback(async (productId: string) => {
        try {
            await favoriteApi.removeFavorite(productId);
            setFavorites(prev => prev.filter(fav => fav.productId !== productId));
            showToast('Removed from favorites', 'success');
        } catch (error) {
            console.error('Failed to remove favorite:', error);
            throw error;
        }
    }, [showToast]);
    const isFavorite = useCallback((productId: string): boolean => {
        return favorites.some(fav => fav.productId === productId);
    }, [favorites]);

    const checkFavorite = useCallback(async (productId: string): Promise<boolean> => {
        try {
            return await favoriteApi.checkFavorite(productId);
        } catch (error) {
            console.error('Failed to check favorite:', error);
            return false;
        }
    }, []);

    return {
        favorites,
        isLoading,
        fetchFavorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        checkFavorite,
    };
};