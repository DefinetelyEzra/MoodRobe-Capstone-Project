import { apiClient } from './client';
import { CreateOutfitDto, UpdateOutfitDto, OutfitResponseDto } from '@/types/outfit.types';

export const outfitApi = {
    /**
     * Create a new outfit
     */
    create: async (data: CreateOutfitDto): Promise<OutfitResponseDto> => {
        const response = await apiClient.post('/outfits', data);
        return response.data;
    },

    /**
     * Get all outfits for the current user
     */
    getUserOutfits: async (): Promise<OutfitResponseDto[]> => {
        const response = await apiClient.get('/outfits');
        return response.data;
    },

    /**
     * Get a specific outfit by ID
     */
    getById: async (id: string): Promise<OutfitResponseDto> => {
        const response = await apiClient.get(`/outfits/${id}`);
        return response.data;
    },

    /**
     * Update an existing outfit
     */
    update: async (id: string, data: UpdateOutfitDto): Promise<OutfitResponseDto> => {
        const response = await apiClient.put(`/outfits/${id}`, data);
        return response.data;
    },

    /**
     * Delete an outfit
     */
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/outfits/${id}`);
    }
};