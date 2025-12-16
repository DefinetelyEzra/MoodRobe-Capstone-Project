import { IPaymentRepository } from '../../domain/repositories/IPaymentRepository';
import { IPaymentGateway } from '@modules/payment/domain/repositories/IPaymentGateway';
import { IOrderRepository } from '../../../order/domain/repositories/IOrderRepository';
import { TransactionId } from '../../domain/value-objects/TransactionId';
import { PaymentMethod } from '../../domain/value-objects/PaymentMethod';
import { WebhookPayloadDto } from '../dto/WebhookPayloadDto';
import {
    InvalidWebhookSignatureException,
    PaymentNotFoundException
} from '../../domain/exceptions/PaymentExceptions';
import { Payment } from '../../domain/entities/Payment';

export class HandlePaymentWebhookUseCase {
    constructor(
        private readonly paymentRepository: IPaymentRepository,
        private readonly orderRepository: IOrderRepository,
        private readonly paymentGateway: IPaymentGateway
    ) { }

    public async execute(
        payload: string,
        signature: string
    ): Promise<{ success: boolean; message: string }> {
        // Verify webhook signature
        const isValid = this.paymentGateway.verifyWebhookSignature(payload, signature);

        if (!isValid) {
            throw new InvalidWebhookSignatureException();
        }

        const webhookData: WebhookPayloadDto = JSON.parse(payload);

        // Handle different webhook events
        switch (webhookData.event) {
            case 'charge.success':
                return await this.handleChargeSuccess(webhookData);

            case 'charge.failed':
                return await this.handleChargeFailed(webhookData);

            case 'refund.processed':
                return await this.handleRefundProcessed(webhookData);

            default:
                return {
                    success: true,
                    message: `Unhandled event: ${webhookData.event}`
                };
        }
    }

    private async handleChargeSuccess(
        webhookData: WebhookPayloadDto
    ): Promise<{ success: boolean; message: string }> {
        const { reference, authorization } = webhookData.data;

        // Find payment by reference
        const payments = await this.paymentRepository.search({});
        const payment = payments.find(p => p.metadata.get('reference') === reference);

        if (!payment) {
            throw new PaymentNotFoundException(reference);
        }

        // Skip if already processed
        if (payment.isSuccessful()) {
            return {
                success: true,
                message: 'Payment already processed'
            };
        }

        // Create updated payment with actual payment method details
        let updatedPaymentMethod = payment.paymentMethod;
        if (authorization?.card_type && authorization?.last4) {
            updatedPaymentMethod = PaymentMethod.fromCard(
                authorization.card_type,
                authorization.last4
            );
        } else if (authorization?.bank) {
            updatedPaymentMethod = PaymentMethod.fromBankTransfer(authorization.bank);
        }

        // Update payment with transaction details
        const transactionId = new TransactionId(webhookData.data.id.toString());

        // Recreate payment with updated payment method
        const updatedPayment = Payment.reconstitute({
            ...payment,
            paymentMethod: updatedPaymentMethod,
            transactionId,
            status: 'success' as const,
            updatedAt: new Date()
        });

        await this.paymentRepository.update(updatedPayment);

        // Update order
        const order = await this.orderRepository.findById(payment.orderId);
        if (order) {
            order.markAsPaid();
            order.confirm();
            await this.orderRepository.update(order);
        }

        return {
            success: true,
            message: 'Payment processed successfully'
        };
    }

    private async handleChargeFailed(
        webhookData: WebhookPayloadDto
    ): Promise<{ success: boolean; message: string }> {
        const { reference } = webhookData.data;

        const payments = await this.paymentRepository.search({});
        const payment = payments.find(p => p.metadata.get('reference') === reference);

        if (!payment) {
            return {
                success: true,
                message: 'Payment not found, skipping'
            };
        }

        if (payment.isPending() || payment.status === 'processing') {
            const failedPayment = Payment.reconstitute({
                ...payment,
                status: 'failed' as const,
                updatedAt: new Date()
            });

            await this.paymentRepository.update(failedPayment);

            // Update order
            const order = await this.orderRepository.findById(payment.orderId);
            if (order) {
                order.markPaymentFailed();
                await this.orderRepository.update(order);
            }
        }

        return {
            success: true,
            message: 'Payment failure recorded'
        };
    }

    private async handleRefundProcessed(
        webhookData: WebhookPayloadDto
    ): Promise<{ success: boolean; message: string }> {
        // Refund webhook handling
        return {
            success: true,
            message: 'Refund webhook processed'
        };
    }
}