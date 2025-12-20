import {
    IPaymentGateway,
    PaymentInitializationResult,
    PaymentVerificationResult,
    RefundResult
} from '@modules/payment/domain/repositories/IPaymentGateway';
import { Money } from '@shared/domain/value-objects/Money';

/**
 * Mock Payment Gateway for offline development and testing
 */
export class MockPaymentGateway implements IPaymentGateway {
    private readonly mockDelay = 1000; // Simulate network delay

    constructor() {
        console.log('🧪 Using Mock Payment Gateway - For Testing Only');
    }

    public async initializePayment(
        amount: Money,
        email: string,
        reference: string,
        callbackUrl: string,
        metadata?: Record<string, any>
    ): Promise<PaymentInitializationResult> {
        // Simulate API delay
        await this.delay(this.mockDelay);

        console.log('Mock Payment Initialized:', {
            amount: amount.getAmount(),
            email,
            reference,
            callbackUrl
        });

        // Return mock authorization URL that redirects directly to callback
        return {
            authorizationUrl: `${callbackUrl}?reference=${reference}&trxref=${reference}`,
            accessCode: `mock_access_${Date.now()}`,
            reference: reference
        };
    }

    public async verifyPayment(reference: string): Promise<PaymentVerificationResult> {
        // Simulate API delay
        await this.delay(this.mockDelay);

        // Simulate different outcomes based on reference pattern
        const isFailed = reference.includes('FAIL');
        const isDeclined = reference.includes('DECLINE');

        console.log('Mock Payment Verification:', {
            reference,
            status: isFailed || isDeclined ? 'failed' : 'success'
        });

        if (isFailed || isDeclined) {
            return {
                success: false,
                transactionId: `mock_txn_${Date.now()}`,
                amount: 0,
                currency: 'NGN',
                status: 'failed',
                channel: 'card'
            };
        }

        // Successful payment
        return {
            success: true,
            transactionId: `mock_txn_${Date.now()}`,
            amount: 10000, // Mock amount
            currency: 'NGN',
            status: 'success',
            paidAt: new Date(),
            channel: 'card',
            cardBrand: 'visa',
            last4: '4081',
            bankName: 'Mock Bank'
        };
    }

    public async processRefund(
        transactionId: string,
        amount: Money,
        reason?: string
    ): Promise<RefundResult> {
        // Simulate API delay
        await this.delay(this.mockDelay);

        console.log('Mock Refund Processed:', {
            transactionId,
            amount: amount.getAmount(),
            reason
        });

        return {
            success: true,
            refundId: `mock_refund_${Date.now()}`,
            amount: amount.getAmount(),
            status: 'success'
        };
    }

    public verifyWebhookSignature(payload: string, signature: string): boolean {
        // Always return true for mock gateway
        console.log('Mock Webhook Signature Verification: Always returns true');
        return true;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}