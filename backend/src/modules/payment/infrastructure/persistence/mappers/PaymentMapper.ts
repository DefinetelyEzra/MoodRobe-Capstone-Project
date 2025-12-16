import { Payment, PaymentProvider, PaymentStatus } from '../../../domain/entities/Payment';
import { PaymentEntity } from '../../entities/PaymentEntity';
import { Money } from '../../../../../shared/domain/value-objects/Money';
import { TransactionId } from '../../../domain/value-objects/TransactionId';
import { PaymentMethod } from '../../../domain/value-objects/PaymentMethod';
import { PaymentMetadata } from '../../../domain/value-objects/PaymentMetadata';

export class PaymentMapper {
    public static toDomain(entity: PaymentEntity): Payment {
        const amount = new Money(entity.amount, entity.currency);
        const refundedAmount = new Money(entity.refundedAmount || 0, entity.currency);
        const transactionId = entity.transactionId
            ? new TransactionId(entity.transactionId)
            : null;

        const paymentMethodData = entity.paymentMethod || { type: 'card' };
        const paymentMethod = new PaymentMethod(
            paymentMethodData.type,
            paymentMethodData
        );

        const metadata = PaymentMetadata.fromJSON(entity.metadata);

        return Payment.reconstitute({
            id: entity.id,
            orderId: entity.orderId,
            provider: entity.provider as PaymentProvider,
            transactionId,
            status: entity.status as PaymentStatus,
            amount,
            refundedAmount,
            paymentMethod,
            metadata,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        });
    }

    public static toEntity(domain: Payment): PaymentEntity {
        const entity = new PaymentEntity();

        entity.id = domain.id;
        entity.orderId = domain.orderId;
        entity.provider = domain.provider;
        entity.transactionId = domain.getTransactionIdValue();
        entity.status = domain.status;
        entity.amount = domain.amount.getAmount();
        entity.currency = domain.amount.getCurrency();
        entity.refundedAmount = domain.refundedAmount.getAmount();
        entity.paymentMethod = domain.paymentMethod.toJSON();
        entity.metadata = domain.metadata.toJSON();
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;

        return entity;
    }
}