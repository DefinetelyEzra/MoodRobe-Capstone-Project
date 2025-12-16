import { IPaymentRepository } from '../../domain/repositories/IPaymentRepository';
import { IOrderRepository } from '../../../order/domain/repositories/IOrderRepository';
import { PaymentResponseDto } from '../dto/PaymentResponseDto';
import { OrderNotFoundException } from '../../domain/exceptions/PaymentExceptions';

export class GetPaymentsByOrderIdUseCase {
    constructor(
        private readonly paymentRepository: IPaymentRepository,
        private readonly orderRepository: IOrderRepository
    ) {}

    public async execute(orderId: string, userId: string): Promise<PaymentResponseDto[]> {
        const order = await this.orderRepository.findById(orderId);
        
        if (!order) {
            throw new OrderNotFoundException(orderId);
        }

        if (order.userId !== userId) {
            throw new Error('Unauthorized: Order does not belong to user');
        }

        const payments = await this.paymentRepository.findByOrderId(orderId);

        return payments.map(payment => ({
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
        }));
    }
}