import { OrderLine, OrderLineProps } from '../../../domain/entities/OrderLine';
import { Money } from '@shared/domain/value-objects/Money';
import { OrderLineEntity } from '../../entities/OrderLineEntity';

export class OrderLineMapper {
    public static toDomain(entity: OrderLineEntity): OrderLine {
        const unitPrice = new Money(entity.unitPrice);
        const lineTotal = new Money(entity.lineTotal);

        const orderLineProps: OrderLineProps = {
            id: entity.id,
            orderId: entity.orderId,
            productVariantId: entity.productVariantId,
            productName: entity.productName,
            variantDetails: entity.variantDetails,
            quantity: entity.quantity,
            unitPrice: unitPrice,
            lineTotal: lineTotal
        };

        return OrderLine.reconstitute(orderLineProps);
    }

    public static toEntity(domain: OrderLine): OrderLineEntity {
        const entity = new OrderLineEntity();
        entity.id = domain.id;
        entity.orderId = domain.orderId;
        entity.productVariantId = domain.productVariantId;
        entity.productName = domain.productName;
        entity.variantDetails = domain.variantDetails;
        entity.quantity = domain.quantity;
        entity.unitPrice = domain.getUnitPrice().getAmount();
        entity.lineTotal = domain.getLineTotal().getAmount();
        return entity;
    }
}