export interface CreateProductDto {
    name: string;
    description: string;
    category: string;
    basePrice: number | { amount: number; currency: string };
    currency?: string;
    aestheticTags?: string[];
    variants: CreateVariantDto[];
    images?: CreateImageDto[];
}

export interface CreateVariantDto {
    sku: string;
    name: string;
    size?: string;
    color?: string;
    price: number | { amount: number; currency: string }; 
    stockQuantity: number;
    attributes?: Record<string, string>;
    isActive?: boolean;
}

export interface CreateImageDto {
    imageUrl: string;
    isPrimary?: boolean;
    displayOrder?: number;
}

export interface ProductResponseDto {
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
    variants: VariantResponseDto[];
    images: ImageResponseDto[];
    createdAt: Date;
    updatedAt: Date;
}

export interface VariantResponseDto {
    id: string;
    productId: string;
    sku: string;
    size: string | null;
    color: string | null;
    price: {
        amount: number;
        currency: string;
    };
    stockQuantity: number;
    isActive: boolean;
}

export interface ImageResponseDto {
    id: string;
    productId: string;
    imageUrl: string;
    isPrimary: boolean;
    displayOrder: number;
}