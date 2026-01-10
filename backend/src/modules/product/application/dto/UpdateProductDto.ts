export interface UpdateProductDto {
    name?: string;
    description?: string;
    category?: string;
    basePrice?: number | { amount: number; currency: string };
    aestheticTags?: string[];
    variants?: UpdateVariantDto[];
    images?: UpdateImageDto[];
}

export interface UpdateVariantDto {
    id?: string;
    sku: string;
    name?: string;
    size?: string;
    color?: string;
    price: number | { amount: number; currency: string };
    stockQuantity: number;
    isActive?: boolean;
}

export interface UpdateImageDto {
    id?: string;
    imageUrl: string;
    isPrimary?: boolean;
    displayOrder?: number;
}