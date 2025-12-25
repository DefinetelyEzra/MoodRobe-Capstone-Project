import { apiClient } from './client';
import { User, UpdateUserDto, UserProfile } from '@/types/user.types';

export const userApi = {
    getProfile: async (): Promise<User> => {
        const response = await apiClient.get('/users/profile');
        return response.data;
    },

    updateProfile: async (data: UpdateUserDto): Promise<User> => {
        const response = await apiClient.put('/users/profile', data);
        return response.data;
    },

    updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
        await apiClient.put('/users/password', { currentPassword, newPassword });
    },

    selectAesthetic: async (aestheticId: string): Promise<void> => {
        await apiClient.post('/users/aesthetic', { aestheticId });
    },

    getUserPreferences: async (): Promise<UserProfile> => {
        const response = await apiClient.get('/users/profile/preferences');
        return response.data;
    },

    updateUserPreferences: async (preferences: Partial<UserProfile>): Promise<UserProfile> => {
        const response = await apiClient.put('/users/profile/preferences', preferences);
        return response.data;
    },

    saveAesthetic: async (aestheticId: string): Promise<void> => {
        await apiClient.post('/users/profile/saved-aesthetics', { aestheticId });
    },

    clearAesthetic: async (): Promise<void> => {
        await apiClient.delete('/users/aesthetic');
    },
};