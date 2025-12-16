export interface Product {
    id: string;
    merchantId: string;
    name: string;
    description: string;
    category: string;
    basePrice: {
        amount: number;
        currency: string;
    };
    aestheticTags: string[];
    isActive: boolean;
    variants?: ProductVariant[];
    images?: ProductImage[];
    createdAt: string;
    updatedAt: string;
}

export interface ProductVariant {
    id: string;
    productId: string;
    sku: string;
    name: string;
    price: {
        amount: number;
        currency: string;
    };
    stockQuantity: number;
    attributes: Record<string, string>;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductImage {
    id: string;
    productId: string;
    imageUrl: string;
    altText?: string;
    displayOrder: number;
    isPrimary: boolean;
    createdAt: string;
}

export interface ProductSearchParams {
    merchantId?: string;
    category?: string;
    aestheticTags?: string[];
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
    searchTerm?: string;
    limit?: number;
    offset?: number;
}

export interface ProductSearchResponse {
    products: Product[];
    total: number;
    limit: number;
    offset: number;
}