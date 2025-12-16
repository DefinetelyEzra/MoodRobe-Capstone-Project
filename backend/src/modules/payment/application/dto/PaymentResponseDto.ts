export interface PaymentResponseDto {
    id: string;
    orderId: string;
    provider: string;
    transactionId: string | null;
    status: string;
    amount: {
        amount: number;
        currency: string;
    };
    refundedAmount: {
        amount: number;
        currency: string;
    };
    paymentMethod: {
        type: string;
        cardBrand?: string;
        last4?: string;
        bankName?: string;
    };
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}