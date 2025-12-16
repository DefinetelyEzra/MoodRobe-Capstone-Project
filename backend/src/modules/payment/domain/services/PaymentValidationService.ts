import { Payment } from '../entities/Payment';
import { Order } from '../../../order/domain/entities/Order';
import { PaymentAmountMismatchException } from '../exceptions/PaymentExceptions';

export class PaymentValidationService {
    public validatePaymentAmount(payment: Payment, order: Order): void {
        const paymentAmount = payment.amount.getAmount();
        const orderAmount = order.getTotal().getTotalAmount().getAmount();

        if (Math.abs(paymentAmount - orderAmount) > 0.01) {
            throw new PaymentAmountMismatchException(orderAmount, paymentAmount);
        }
    }

    public validateRefundAmount(payment: Payment, refundAmount: number): void {
        const remainingAmount = payment.getRemainingRefundableAmount().getAmount();

        if (refundAmount > remainingAmount) {
            throw new Error(
                `Refund amount ${refundAmount} exceeds remaining refundable amount ${remainingAmount}`
            );
        }
    }

    public canInitiatePayment(order: Order): boolean {
        return order.status === 'pending' && order.paymentStatus === 'pending';
    }

    public canProcessRefund(payment: Payment, order: Order): boolean {
        return payment.isRefundable() && order.canBeRefunded();
    }
}