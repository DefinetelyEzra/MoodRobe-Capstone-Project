import { CartItem } from '../../../domain/entities/CartItem';
import { Money } from '@shared/domain/value-objects/Money';
import { CartItemEntity } from '../../entities/CartItemEntity';

export class CartItemMapper {
    public static toDomain(entity: CartItemEntity, productName: string): CartItem {
        const unitPrice = new Money(entity.unitPrice);

        return CartItem.reconstitute(
            entity.id,
            entity.cartId,
            entity.productVariantId,
            productName,
            entity.quantity,
            unitPrice,
            entity.addedAt
        );
    }

    public static toEntity(domain: CartItem): CartItemEntity {
        const entity = new CartItemEntity();
        entity.id = domain.id;
        entity.cartId = domain.cartId;
        entity.productVariantId = domain.productVariantId;
        entity.quantity = domain.quantity;
        entity.unitPrice = domain.getUnitPrice().getAmount();
        entity.addedAt = domain.addedAt;
        return entity;
    }
}