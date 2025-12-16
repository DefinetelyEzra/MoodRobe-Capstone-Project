import { Money } from "@shared/domain/value-objects/Money";

export interface PaymentInitializationResult {
    authorizationUrl: string;
    accessCode: string;
    reference: string;
}

export interface PaymentVerificationResult {
    success: boolean;
    transactionId: string;
    amount: number;
    currency: string;
    status: string;
    paidAt?: Date;
    channel?: string;
    cardBrand?: string;
    last4?: string;
    bankName?: string;
}

export interface RefundResult {
    success: boolean;
    refundId: string;
    amount: number;
    status: string;
}

export interface IPaymentGateway {
    initializePayment(
        amount: Money,
        email: string,
        reference: string,
        callbackUrl: string,
        metadata?: Record<string, any>
    ): Promise<PaymentInitializationResult>;

    verifyPayment(reference: string): Promise<PaymentVerificationResult>;

    processRefund(
        transactionId: string,
        amount: Money,
        reason?: string
    ): Promise<RefundResult>;

    verifyWebhookSignature(payload: string, signature: string): boolean;
}