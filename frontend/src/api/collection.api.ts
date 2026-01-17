import { apiClient } from './client';
import {
    Collection,
    CollectionWithItems,
    CreateCollectionDto,
    UpdateCollectionDto,
    AddToCollectionDto,
} from '@/types/collection.types';

export const collectionApi = {
    createCollection: async (data: CreateCollectionDto): Promise<Collection> => {
        const response = await apiClient.post('/users/collections', data);
        return response.data;
    },

    getUserCollections: async (): Promise<Collection[]> => {
        const response = await apiClient.get('/users/collections');
        return response.data;
    },

    getCollectionById: async (id: string): Promise<CollectionWithItems> => {
        const response = await apiClient.get(`/users/collections/${id}`);
        return response.data;
    },

    updateCollection: async (id: string, data: UpdateCollectionDto): Promise<Collection> => {
        const response = await apiClient.put(`/users/collections/${id}`, data);
        return response.data;
    },

    deleteCollection: async (id: string): Promise<void> => {
        await apiClient.delete(`/users/collections/${id}`);
    },

    addToCollection: async (id: string, data: AddToCollectionDto): Promise<void> => {
        await apiClient.post(`/users/collections/${id}/items`, data);
    },

    removeFromCollection: async (id: string, productId: string): Promise<void> => {
        await apiClient.delete(`/users/collections/${id}/items/${productId}`);
    },
};