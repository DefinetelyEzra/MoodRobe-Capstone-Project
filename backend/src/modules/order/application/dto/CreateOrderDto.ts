import { AddressData } from '../../domain/value-objects/Address';

export interface CreateOrderDto {
    shippingAddress: AddressData;
    discountPercentage?: number;
}

export interface OrderResponseDto {
    id: string;
    userId: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    subtotal: {
        amount: number;
        currency: string;
    };
    tax: {
        amount: number;
        currency: string;
    };
    shipping: {
        amount: number;
        currency: string;
    };
    discount: {
        amount: number;
        currency: string;
    };
    totalAmount: {
        amount: number;
        currency: string;
    };
    shippingAddress: AddressData;
    orderLines: OrderLineResponseDto[];
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderLineResponseDto {
    id: string;
    productVariantId: string;
    productName: string;
    variantDetails: {
        size?: string;
        color?: string;
        sku: string;
    };
    quantity: number;
    unitPrice: {
        amount: number;
        currency: string;
    };
    lineTotal: {
        amount: number;
        currency: string;
    };
}