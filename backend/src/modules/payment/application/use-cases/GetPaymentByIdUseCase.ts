import { IPaymentRepository } from '../../domain/repositories/IPaymentRepository';
import { PaymentResponseDto } from '../dto/PaymentResponseDto';
import { PaymentNotFoundException } from '../../domain/exceptions/PaymentExceptions';

export class GetPaymentByIdUseCase {
    constructor(private readonly paymentRepository: IPaymentRepository) {}

    public async execute(paymentId: string, userId: string): Promise<PaymentResponseDto> {
        const payment = await this.paymentRepository.findById(paymentId);
        
        if (!payment) {
            throw new PaymentNotFoundException(paymentId);
        }

        // Verify user owns the payment's order
        const orderUserId = payment.metadata.get('userId');
        if (orderUserId !== userId) {
            throw new Error('Unauthorized: Payment does not belong to user');
        }

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