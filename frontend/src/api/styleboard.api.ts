import { apiClient } from './client';
import {
    StyleBoard,
    CreateStyleBoardDto,
    UpdateStyleBoardDto,
    AddStyleBoardItemDto,
    UpdateStyleBoardItemDto,
} from '@/types/styleboard.types';

export const styleBoardApi = {
    createStyleBoard: async (data: CreateStyleBoardDto): Promise<StyleBoard> => {
        const response = await apiClient.post('/users/style-boards', data);
        return response.data;
    },

    getUserStyleBoards: async (): Promise<StyleBoard[]> => {
        const response = await apiClient.get('/users/style-boards');
        return response.data;
    },

    getStyleBoardById: async (id: string): Promise<StyleBoard> => {
        const response = await apiClient.get(`/users/style-boards/${id}`);
        return response.data;
    },

    updateStyleBoard: async (id: string, data: UpdateStyleBoardDto): Promise<StyleBoard> => {
        const response = await apiClient.put(`/users/style-boards/${id}`, data);
        return response.data;
    },

    deleteStyleBoard: async (id: string): Promise<void> => {
        await apiClient.delete(`/users/style-boards/${id}`);
    },

    addItem: async (id: string, data: AddStyleBoardItemDto): Promise<void> => {
        await apiClient.post(`/users/style-boards/${id}/items`, data);
    },

    removeItem: async (id: string, productId: string): Promise<void> => {
        await apiClient.delete(`/users/style-boards/${id}/items/${productId}`);
    },

    updateItem: async (id: string, productId: string, data: UpdateStyleBoardItemDto): Promise<void> => {
        await apiClient.put(`/users/style-boards/${id}/items/${productId}`, data);
    },
};