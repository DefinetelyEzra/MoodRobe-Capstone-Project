export interface InitiatePaymentDto {
    orderId: string;
    callbackUrl?: string;
}

export interface InitiatePaymentResponseDto {
    paymentId: string;
    authorizationUrl: string;
    accessCode: string;
    reference: string;
    amount: {
        amount: number;
        currency: string;
    };
}