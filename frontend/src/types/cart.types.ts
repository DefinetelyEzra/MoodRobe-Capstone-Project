export interface AddToCartDto {
    productVariantId: string;
    quantity: number;
}

export interface UpdateCartItemDto {
    quantity: number;
}

export interface CartResponseDto {
    id: string;
    userId: string;
    items: CartItemResponseDto[];
    itemCount: number;
    subtotal: {
        amount: number;
        currency: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface CartItemResponseDto {
    id: string;
    productVariantId: string;
    productName: string;
    quantity: number;
    unitPrice: {
        amount: number;
        currency: string;
    };
    lineTotal: {
        amount: number;
        currency: string;
    };
    addedAt: Date;
    productId?: string;
    imageUrl?: string;
    variantAttributes?: Record<string, string | number | boolean>;
}