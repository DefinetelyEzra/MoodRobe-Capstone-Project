import * as crypto from 'node:crypto';
import {
    IPaymentGateway,
    PaymentInitializationResult,
    PaymentVerificationResult,
    RefundResult
} from '@modules/payment/domain/repositories/IPaymentGateway';
import { Money } from '../../../../shared/domain/value-objects/Money';
import { PaymentGatewayException } from '../../domain/exceptions/PaymentExceptions';

// Paystack API response types
interface PaystackResponse<T = any> {
    status: boolean;
    message: string;
    data: T;
}

interface InitializePaymentResponse {
    authorization_url: string;
    access_code: string;
    reference: string;
}

interface VerifyPaymentResponse {
    id: number;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    paid_at: string | null;
    channel: string;
    authorization?: {
        card_type?: string;
        last4?: string;
        bank?: string;
    };
}

interface ProcessRefundResponse {
    id: number;
    amount: number;
    currency: string;
    status: string;
}

export class PaystackGateway implements IPaymentGateway {
    private readonly secretKey: string;
    private readonly baseUrl: string = 'https://api.paystack.co';

    constructor(secretKey: string) {
        if (!secretKey) {
            throw new Error('Paystack secret key is required');
        }
        this.secretKey = secretKey;
    }

    public async initializePayment(
        amount: Money,
        email: string,
        reference: string,
        callbackUrl: string,
        metadata?: Record<string, any>
    ): Promise<PaymentInitializationResult> {
        try {
            // Paystack expects amount in kobo (smallest currency unit)
            const amountInKobo = Math.round(amount.getAmount() * 100);

            const payload = {
                email,
                amount: amountInKobo,
                currency: amount.getCurrency(),
                reference,
                callback_url: callbackUrl,
                metadata: metadata || {}
            };

            const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json() as PaystackResponse<InitializePaymentResponse>;

            if (!response.ok || !data.status) {
                throw new PaymentGatewayException(
                    'Paystack',
                    data.message || 'Failed to initialize payment'
                );
            }

            return {
                authorizationUrl: data.data.authorization_url,
                accessCode: data.data.access_code,
                reference: data.data.reference
            };
        } catch (error) {
            if (error instanceof PaymentGatewayException) {
                throw error;
            }
            throw new PaymentGatewayException(
                'Paystack',
                error instanceof Error ? error.message : 'Unknown error'
            );
        }
    }

    public async verifyPayment(reference: string): Promise<PaymentVerificationResult> {
        try {
            const response = await fetch(
                `${this.baseUrl}/transaction/verify/${reference}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.secretKey}`
                    }
                }
            );

            const data = await response.json() as PaystackResponse<VerifyPaymentResponse>;

            if (!response.ok || !data.status) {
                throw new PaymentGatewayException(
                    'Paystack',
                    data.message || 'Failed to verify payment'
                );
            }

            const transaction = data.data;
            const amountInMajorUnit = transaction.amount / 100;

            return {
                success: transaction.status === 'success',
                transactionId: transaction.id.toString(),
                amount: amountInMajorUnit,
                currency: transaction.currency,
                status: transaction.status,
                paidAt: transaction.paid_at ? new Date(transaction.paid_at) : undefined,
                channel: transaction.channel,
                cardBrand: transaction.authorization?.card_type,
                last4: transaction.authorization?.last4,
                bankName: transaction.authorization?.bank
            };
        } catch (error) {
            if (error instanceof PaymentGatewayException) {
                throw error;
            }
            throw new PaymentGatewayException(
                'Paystack',
                error instanceof Error ? error.message : 'Unknown error'
            );
        }
    }

    public async processRefund(
        transactionId: string,
        amount: Money,
        reason?: string
    ): Promise<RefundResult> {
        try {
            const amountInKobo = Math.round(amount.getAmount() * 100);

            const payload = {
                transaction: transactionId,
                amount: amountInKobo,
                currency: amount.getCurrency(),
                merchant_note: reason || 'Refund requested by merchant'
            };

            const response = await fetch(`${this.baseUrl}/refund`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json() as PaystackResponse<ProcessRefundResponse>;

            if (!response.ok || !data.status) {
                throw new PaymentGatewayException(
                    'Paystack',
                    data.message || 'Failed to process refund'
                );
            }

            return {
                success: true,
                refundId: data.data.id.toString(),
                amount: data.data.amount / 100,
                status: data.data.status
            };
        } catch (error) {
            if (error instanceof PaymentGatewayException) {
                throw error;
            }
            throw new PaymentGatewayException(
                'Paystack',
                error instanceof Error ? error.message : 'Unknown error'
            );
        }
    }

    public verifyWebhookSignature(payload: string, signature: string): boolean {
        const hash = crypto
            .createHmac('sha512', this.secretKey)
            .update(payload)
            .digest('hex');

        return hash === signature;
    }
}