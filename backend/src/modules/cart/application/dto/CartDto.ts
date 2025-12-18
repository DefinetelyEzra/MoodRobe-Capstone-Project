export interface AddToCartDto {
    productVariantId: string;
    quantity: number;
}

export interface UpdateCartItemDto {
    quantity: number;
}

export interface PriceDto {
    amount: number;
    currency: string;
}

export interface CartItemResponseDto {
    id: string;
    productVariantId: string;
    productName: string;
    quantity: number;
    unitPrice: PriceDto;
    lineTotal: PriceDto;
    addedAt: Date;
    productId?: string;
    imageUrl?: string;
    variantAttributes?: Record<string, string | number | boolean>;
}

export interface CartResponseDto {
    id: string;
    userId: string;
    items: CartItemResponseDto[];
    itemCount: number;
    subtotal: PriceDto;
    createdAt: Date;
    updatedAt: Date;
}