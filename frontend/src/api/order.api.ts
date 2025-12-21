import { apiClient } from './client';
import { Order, CreateOrderDto, OrderSearchParams } from '@/types/order.types';

export const orderApi = {
    // Create order from cart
    createOrder: async (data: CreateOrderDto): Promise<Order> => {
        const response = await apiClient.post('/orders', data);
        return response.data;
    },

    // Get order by ID
    getOrderById: async (orderId: string): Promise<Order> => {
        const response = await apiClient.get(`/orders/${orderId}`);
        return response.data;
    },

    // Get user's orders
    getUserOrders: async (params?: OrderSearchParams): Promise<Order[]> => {
        const response = await apiClient.get('/orders/my-orders', { params });
        return response.data.orders; 
    },

    // Cancel order
    cancelOrder: async (orderId: string): Promise<void> => {
        await apiClient.post(`/orders/${orderId}/cancel`);
    }
};