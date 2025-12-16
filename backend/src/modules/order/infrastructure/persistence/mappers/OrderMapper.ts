import { Order, OrderStatus, PaymentStatus, OrderProps } from '../../../domain/entities/Order';
import { Address } from '../../../domain/value-objects/Address';
import { Money } from '@shared/domain/value-objects/Money';
import { OrderTotal } from '../../../domain/value-objects/OrderTotal';
import { OrderEntity } from '../../entities/OrderEntity';

export class OrderMapper {
    public static toDomain(entity: OrderEntity): Order {
        const subtotal = new Money(entity.subtotal);
        const tax = new Money(entity.tax);
        const discount = new Money(entity.discount);
        const totalAmount = new Money(entity.totalAmount);
        const orderTotal = OrderTotal.reconstitute(subtotal, tax, discount, totalAmount);

        const shippingAddress = new Address(entity.shippingAddress);

        const orderProps: OrderProps = {
            id: entity.id,
            userId: entity.userId,
            orderNumber: entity.orderNumber,
            status: entity.status as OrderStatus,
            paymentStatus: this.extractPaymentStatus(entity.status),
            total: orderTotal,
            shippingAddress: shippingAddress,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };

        return Order.reconstitute(orderProps);
    }

    public static toEntity(domain: Order): OrderEntity {
        const entity = new OrderEntity();
        entity.id = domain.id;
        entity.userId = domain.userId;
        entity.orderNumber = domain.orderNumber;
        entity.status = domain.status;
        entity.subtotal = domain.getTotal().getSubtotal().getAmount();
        entity.tax = domain.getTotal().getTax().getAmount();
        entity.discount = domain.getTotal().getDiscount().getAmount();
        entity.totalAmount = domain.getTotal().getTotalAmount().getAmount();
        entity.shippingAddress = domain.shippingAddress.toJSON();
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }

    private static extractPaymentStatus(status: string): PaymentStatus {
        // In a real implementation, payment status would be stored separately
        // For now, we'll derive it from order status
        if (status === 'refunded') return 'refunded';
        if (['confirmed', 'processing', 'shipped', 'delivered'].includes(status)) return 'paid';
        return 'pending';
    }
}