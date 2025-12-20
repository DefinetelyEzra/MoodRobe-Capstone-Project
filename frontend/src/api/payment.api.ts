import { apiClient } from './client';
import {
    InitiatePaymentDto,
    InitiatePaymentResponse,
    VerifyPaymentDto,
    Payment,
    RefundPaymentDto
} from '@/types/payment.types';

export const paymentApi = {
    // Initiate payment for an order
    initiatePayment: async (data: InitiatePaymentDto): Promise<InitiatePaymentResponse> => {
        const response = await apiClient.post('/payments/initiate', data);
        return response.data;
    },

    // Verify payment after redirect
    verifyPayment: async (data: VerifyPaymentDto): Promise<Payment> => {
        const response = await apiClient.post('/payments/verify', data);
        return response.data;
    },

    // Get payment by ID
    getPaymentById: async (paymentId: string): Promise<Payment> => {
        const response = await apiClient.get(`/payments/${paymentId}`);
        return response.data;
    },

    // Get all payments for an order
    getPaymentsByOrderId: async (orderId: string): Promise<Payment[]> => {
        const response = await apiClient.get(`/payments/order/${orderId}`);
        return response.data;
    },

    // Process refund
    processRefund: async (paymentId: string, data: RefundPaymentDto): Promise<Payment> => {
        const response = await apiClient.post(`/payments/${paymentId}/refund`, data);
        return response.data;
    }
};