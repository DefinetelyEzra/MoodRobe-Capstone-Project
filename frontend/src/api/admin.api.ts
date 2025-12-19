import { apiClient } from './client';
import {
    CarouselItem,
    CreateCarouselDto,
    UpdateCarouselDto,
    HomepageContent,
    UpdateContentDto,
    ActivityLog
} from '@/types/admin.types';

export const adminApi = {
    // Carousel Management
    getAllCarousel: async (): Promise<CarouselItem[]> => {
        const response = await apiClient.get('/admin/carousel');
        return response.data;
    },

    getActiveCarousel: async (): Promise<CarouselItem[]> => {
        const response = await apiClient.get('/admin/carousel/active');
        return response.data;
    },

    createCarousel: async (data: CreateCarouselDto): Promise<CarouselItem> => {
        const response = await apiClient.post('/admin/carousel', data);
        return response.data;
    },

    updateCarousel: async (id: string, data: UpdateCarouselDto): Promise<CarouselItem> => {
        const response = await apiClient.put(`/admin/carousel/${id}`, data);
        return response.data;
    },

    deleteCarousel: async (id: string): Promise<void> => {
        await apiClient.delete(`/admin/carousel/${id}`);
    },

    // Content Management
    getAllContent: async (): Promise<HomepageContent[]> => {
        const response = await apiClient.get('/admin/content');
        return response.data;
    },

    getContentBySectionKey: async (sectionKey: string): Promise<HomepageContent> => {
        const response = await apiClient.get(`/admin/content/${sectionKey}`);
        return response.data;
    },

    updateContent: async (sectionKey: string, data: UpdateContentDto): Promise<HomepageContent> => {
        const response = await apiClient.put(`/admin/content/${sectionKey}`, data);
        return response.data;
    },

    // Activity Log
    getActivityLog: async (limit?: number): Promise<ActivityLog[]> => {
        const response = await apiClient.get('/admin/activity-log', {
            params: { limit }
        });
        return response.data;
    }
};