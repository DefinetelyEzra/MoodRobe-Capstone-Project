export interface RefundPaymentDto {
    amount: number;
    reason?: string;
}

export interface RefundPaymentResponseDto {
    paymentId: string;
    refundId: string;
    amount: {
        amount: number;
        currency: string;
    };
    status: string;
    message: string;
}