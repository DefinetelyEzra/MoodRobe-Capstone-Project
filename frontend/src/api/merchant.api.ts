import { apiClient } from './client';
import {
    Merchant,
    MerchantStaff,
    CreateMerchantDto,
    UpdateMerchantDto,
    AddStaffDto,
    UpdateStaffDto,
    GetMerchantsParams,
    MerchantListResponse
} from '@/types/merchant.types';

export const merchantApi = {
    // Merchant Management
    create: async (data: CreateMerchantDto): Promise<Merchant> => {
        const response = await apiClient.post('/merchants', data);
        return response.data;
    },

    getById: async (id: string): Promise<Merchant> => {
        const response = await apiClient.get(`/merchants/${id}`);
        return response.data;
    },

    getAll: async (params?: GetMerchantsParams): Promise<MerchantListResponse> => {
        const response = await apiClient.get('/merchants', { params });
        return response.data;
    },

    getUserMerchants: async (): Promise<Merchant[]> => {
        const response = await apiClient.get('/merchants/my-merchants');
        return response.data;
    },

    update: async (id: string, data: UpdateMerchantDto): Promise<Merchant> => {
        const response = await apiClient.put(`/merchants/${id}`, data);
        return response.data;
    },

    activate: async (id: string): Promise<void> => {
        await apiClient.post(`/merchants/${id}/activate`);
    },

    deactivate: async (id: string): Promise<void> => {
        await apiClient.post(`/merchants/${id}/deactivate`);
    },

    // Staff Management
    getStaff: async (merchantId: string): Promise<MerchantStaff[]> => {
        const response = await apiClient.get(`/merchants/${merchantId}/staff`);
        return response.data;
    },

    addStaff: async (merchantId: string, data: AddStaffDto): Promise<MerchantStaff> => {
        const response = await apiClient.post(`/merchants/${merchantId}/staff`, data);
        return response.data;
    },

    updateStaff: async (staffId: string, data: UpdateStaffDto): Promise<MerchantStaff> => {
        const response = await apiClient.put(`/merchants/staff/${staffId}`, data);
        return response.data;
    },

    removeStaff: async (staffId: string): Promise<void> => {
        await apiClient.delete(`/merchants/staff/${staffId}`);
    }
};