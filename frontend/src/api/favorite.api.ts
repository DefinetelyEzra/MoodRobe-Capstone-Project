import { apiClient } from './client';
import { Favorite, AddFavoriteDto } from '@/types/favorite.types';

export const favoriteApi = {
    addFavorite: async (data: AddFavoriteDto): Promise<Favorite> => {
        const response = await apiClient.post('/users/favorites', data);
        return response.data;
    },

    removeFavorite: async (productId: string): Promise<void> => {
        await apiClient.delete(`/users/favorites/${productId}`);
    },

    getUserFavorites: async (): Promise<Favorite[]> => {
        const response = await apiClient.get('/users/favorites');
        return response.data;
    },

    checkFavorite: async (productId: string): Promise<boolean> => {
        const response = await apiClient.get(`/users/favorites/check/${productId}`);
        return response.data.isFavorite;
    },
};