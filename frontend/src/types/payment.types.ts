export type PaymentStatus = 
    | 'pending' 
    | 'processing' 
    | 'success' 
    | 'failed' 
    | 'refunded' 
    | 'partially_refunded';

export type PaymentProvider = 'paystack' | 'stripe' | 'manual';

export interface PaymentMethod {
    type: 'card' | 'bank_transfer' | 'ussd' | 'qr';
    cardBrand?: string;
    last4?: string;
    bankName?: string;
}

export interface MoneyAmount {
    amount: number;
    currency: string;
}

export interface Payment {
    id: string;
    orderId: string;
    provider: PaymentProvider;
    transactionId: string | null;
    status: PaymentStatus;
    amount: MoneyAmount;
    refundedAmount: MoneyAmount;
    paymentMethod: PaymentMethod;
    metadata: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

export interface InitiatePaymentDto {
    orderId: string;
    callbackUrl?: string;
}

export interface InitiatePaymentResponse {
    paymentId: string;
    authorizationUrl: string;
    accessCode: string;
    reference: string;
    amount: MoneyAmount;
}

export interface VerifyPaymentDto {
    reference: string;
}

export interface RefundPaymentDto {
    amount: number;
    reason?: string;
}

export interface PaymentCallbackParams {
    reference: string;
    trxref?: string;
}