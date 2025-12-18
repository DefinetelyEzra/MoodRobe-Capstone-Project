import { apiClient } from './client';
import { AddToCartDto, UpdateCartItemDto, CartResponseDto } from '@/types/cart.types';

export const cartApi = {
    /**
     * Get or create the current user's cart
     */
    getCart: async (): Promise<CartResponseDto> => {
        const response = await apiClient.get('/cart');
        return response.data;
    },

    /**
     * Add an item to the cart
     */
    addItem: async (dto: AddToCartDto): Promise<CartResponseDto> => {
        const response = await apiClient.post('/cart/items', dto);
        return response.data;
    },

    /**
     * Update the quantity of an item in the cart
     */
    updateItemQuantity: async (
        productVariantId: string,
        dto: UpdateCartItemDto
    ): Promise<CartResponseDto> => {
        const response = await apiClient.put(`/cart/items/${productVariantId}`, dto);
        return response.data;
    },

    /**
     * Remove an item from the cart
     */
    removeItem: async (productVariantId: string): Promise<CartResponseDto> => {
        const response = await apiClient.delete(`/cart/items/${productVariantId}`);
        return response.data;
    },

    /**
     * Clear all items from the cart
     */
    clearCart: async (): Promise<{ message: string }> => {
        const response = await apiClient.delete('/cart');
        return response.data;
    },
};