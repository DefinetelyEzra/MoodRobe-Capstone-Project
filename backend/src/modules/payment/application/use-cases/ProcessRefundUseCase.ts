import { IPaymentRepository } from '../../domain/repositories/IPaymentRepository';
import { IPaymentGateway } from '@modules/payment/domain/repositories/IPaymentGateway';
import { IOrderRepository } from '../../../order/domain/repositories/IOrderRepository';
import { Money } from '../../../../shared/domain/value-objects/Money';
import { RefundPaymentDto, RefundPaymentResponseDto } from '../dto/RefundPaymentDto';
import { PaymentNotFoundException } from '../../domain/exceptions/PaymentExceptions';

export class ProcessRefundUseCase {
    constructor(
        private readonly paymentRepository: IPaymentRepository,
        private readonly orderRepository: IOrderRepository,
        private readonly paymentGateway: IPaymentGateway
    ) { }

    public async execute(
        paymentId: string,
        dto: RefundPaymentDto
    ): Promise<RefundPaymentResponseDto> {
        const payment = await this.paymentRepository.findById(paymentId);

        if (!payment) {
            throw new PaymentNotFoundException(paymentId);
        }

        if (!payment.isRefundable()) {
            throw new Error('Payment is not refundable');
        }

        const transactionId = payment.getTransactionIdValue();
        if (!transactionId) {
            throw new Error('Payment has no transaction ID');
        }

        const refundAmount = new Money(dto.amount, payment.amount.getCurrency());

        // Validate refund amount
        if (refundAmount.isGreaterThan(payment.getRemainingRefundableAmount())) {
            throw new Error('Refund amount exceeds remaining refundable amount');
        }

        // Process refund with gateway
        const refundResult = await this.paymentGateway.processRefund(
            transactionId,
            refundAmount,
            dto.reason
        );

        // Update payment
        payment.processRefund(refundAmount);
        await this.paymentRepository.update(payment);

        // Update order
        const order = await this.orderRepository.findById(payment.orderId);
        if (order) {
            if (payment.status === 'refunded') {
                order.refund();
            }
            await this.orderRepository.update(order);
        }

        return {
            paymentId: payment.id,
            refundId: refundResult.refundId,
            amount: {
                amount: refundAmount.getAmount(),
                currency: refundAmount.getCurrency()
            },
            status: refundResult.status,
            message: 'Refund processed successfully'
        };
    }
}