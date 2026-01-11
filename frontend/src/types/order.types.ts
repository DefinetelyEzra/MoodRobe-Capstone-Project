export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Address {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export interface MoneyAmount {
    amount: number;
    currency: string;
}

export interface OrderLine {
    id: string;
    productVariantId: string;
    productName: string;
    variantDetails: {
        size?: string;
        color?: string;
        sku: string;
    };
    quantity: number;
    unitPrice: MoneyAmount;
    lineTotal: MoneyAmount;
    imageUrl?: string; 
}

export interface Order {
    id: string;
    userId: string;
    orderNumber: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    subtotal: MoneyAmount;
    tax: MoneyAmount;
    shipping: MoneyAmount;
    discount: MoneyAmount;
    totalAmount: MoneyAmount;
    shippingAddress: Address;
    orderLines: OrderLine[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderDto {
    shippingAddress: Address;
    discountPercentage?: number;
}

export interface OrderSearchParams {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    limit?: number;
    offset?: number;
}