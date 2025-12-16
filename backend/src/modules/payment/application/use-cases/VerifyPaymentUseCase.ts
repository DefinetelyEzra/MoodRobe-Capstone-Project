import { IPaymentRepository } from '../../domain/repositories/IPaymentRepository';
import { IPaymentGateway } from '@modules/payment/domain/repositories/IPaymentGateway';
import { IOrderRepository } from '../../../order/domain/repositories/IOrderRepository';
import { TransactionId } from '../../domain/value-objects/TransactionId';
import { PaymentMethod } from '../../domain/value-objects/PaymentMethod';
import { VerifyPaymentDto } from '../dto/VerifyPaymentDto';
import { PaymentResponseDto } from '../dto/PaymentResponseDto';
import {
    PaymentNotFoundException,
    PaymentVerificationFailedException,
    PaymentAlreadyProcessedException
} from '../../domain/exceptions/PaymentExceptions';
import { Payment } from '../../domain/entities/Payment';

export class VerifyPaymentUseCase {
    constructor(
        private readonly paymentRepository: IPaymentRepository,
        private readonly orderRepository: IOrderRepository,
        private readonly paymentGateway: IPaymentGateway
    ) { }

    public async execute(dto: VerifyPaymentDto): Promise<PaymentResponseDto> {
        // Verify payment with gateway
        const verificationResult = await this.paymentGateway.verifyPayment(dto.reference);

        if (!verificationResult.success) {
            throw new PaymentVerificationFailedException(
                `Payment verification failed with status: ${verificationResult.status}`
            );
        }

        // Find payment by transaction reference (stored in metadata)
        const payments = await this.paymentRepository.search({
            orderId: undefined
        });

        const payment = payments.find(p => {
            const ref = p.metadata.get('reference');
            return ref === dto.reference;
        });

        if (!payment) {
            throw new PaymentNotFoundException(dto.reference);
        }

        // Check if already processed
        if (payment.isSuccessful()) {
            throw new PaymentAlreadyProcessedException(payment.id);
        }

        // Update payment with transaction details
        const transactionId = new TransactionId(verificationResult.transactionId);

        // Create updated payment with actual payment method details
        let updatedPaymentMethod = payment.paymentMethod;
        
        if (verificationResult.cardBrand && verificationResult.last4) {
            updatedPaymentMethod = PaymentMethod.fromCard(
                verificationResult.cardBrand,
                verificationResult.last4
            );
        } else if (verificationResult.bankName) {
            updatedPaymentMethod = PaymentMethod.fromBankTransfer(
                verificationResult.bankName
            );
        }
        // If no specific payment method details, keep the original

        // Recreate payment with updated payment method
        const verifiedPayment = Payment.reconstitute({
            ...payment,
            paymentMethod: updatedPaymentMethod,
            transactionId,
            status: 'success' as const,
            updatedAt: new Date()
        });

        await this.paymentRepository.update(verifiedPayment);

        // Update order status
        const order = await this.orderRepository.findById(payment.orderId);
        if (order) {
            order.markAsPaid();
            order.confirm();
            await this.orderRepository.update(order);
        }

        return this.toResponseDto(verifiedPayment);
    }

    private toResponseDto(payment: Payment): PaymentResponseDto {
        return {
            id: payment.id,
            orderId: payment.orderId,
            provider: payment.provider,
            transactionId: payment.getTransactionIdValue(),
            status: payment.status,
            amount: {
                amount: payment.amount.getAmount(),
                currency: payment.amount.getCurrency()
            },
            refundedAmount: {
                amount: payment.refundedAmount.getAmount(),
                currency: payment.refundedAmount.getCurrency()
            },
            paymentMethod: payment.paymentMethod.toJSON(),
            metadata: payment.metadata.toJSON(),
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt
        };
    }
}