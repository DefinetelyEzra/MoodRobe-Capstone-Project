import { apiClient } from './client';
import {
    Product,
    ProductSearchParams,
    ProductSearchResponse,
    ProductVariant,
    ProductImage
} from '@/types/product.types';

// Define types for API request payloads that match backend DTOs
export interface CreateProductRequest {
    name: string;
    description: string;
    category: string;
    basePrice: {
        amount: number;
        currency: string;
    };
    aestheticTags: string[];
    isActive?: boolean;
    variants?: Array<{
        sku: string;
        name: string;
        size?: string;
        color?: string;
        price: {
            amount: number;
            currency: string;
        };
        stockQuantity: number;
        attributes?: Record<string, string>;
        isActive?: boolean;
    }>;
    images?: Array<{
        imageUrl: string;
        isPrimary?: boolean;
        displayOrder?: number;
    }>;
}

export interface UpdateProductRequest {
    name?: string;
    description?: string;
    category?: string;
    basePrice?: {
        amount: number;
        currency: string;
    };
    aestheticTags?: string[];
    isActive?: boolean;
    variants?: Array<{
        id?: string;
        sku: string;
        name: string;
        size?: string;
        color?: string;
        price: {
            amount: number;
            currency: string;
        };
        stockQuantity: number;
        isActive?: boolean;
    }>;
    images?: Array<{
        id?: string;
        imageUrl: string;
        isPrimary?: boolean;
        displayOrder?: number;
    }>;
}

export interface UpdateStockRequest {
    stockQuantity: number;
    action?: 'set' | 'increment' | 'decrement';
}

export interface AddImageRequest {
    imageUrl: string;
    altText?: string;
    displayOrder?: number;
    isPrimary?: boolean;
}

export const productApi = {
    getById: async (id: string): Promise<Product> => {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    },

    search: async (params: ProductSearchParams): Promise<ProductSearchResponse> => {
        const response = await apiClient.get('/products/search', { params });
        return response.data;
    },

    getByAesthetic: async (
        aestheticId: string,
        limit: number = 20,
        offset: number = 0
    ): Promise<ProductSearchResponse> => {
        const response = await apiClient.get(`/products/aesthetic/${aestheticId}`, {
            params: { limit, offset }
        });
        return response.data;
    },

    // Merchant-specific endpoints (require authentication)
    create: async (merchantId: string, data: CreateProductRequest): Promise<Product> => {
        const response = await apiClient.post(`/products/merchant/${merchantId}`, data);
        return response.data;
    },

    update: async (id: string, data: UpdateProductRequest): Promise<Product> => {
        const response = await apiClient.put(`/products/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/products/${id}`);
    },

    updateVariantStock: async (variantId: string, stockData: UpdateStockRequest): Promise<ProductVariant> => {
        const response = await apiClient.put(`/products/variant/${variantId}/stock`, stockData);
        return response.data;
    },

    addImage: async (id: string, imageData: AddImageRequest): Promise<ProductImage> => {
        const response = await apiClient.post(`/products/${id}/images`, imageData);
        return response.data;
    },

    updateVariant: async (variantId: string, data: Partial<ProductVariant>): Promise<ProductVariant> => {
        const response = await apiClient.put(`/products/variant/${variantId}`, data);
        return response.data;
    }
};