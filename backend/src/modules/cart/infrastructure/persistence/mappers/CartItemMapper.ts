import { CartItem } from '../../../domain/entities/CartItem';
import { Money } from '@shared/domain/value-objects/Money';
import { CartItemEntity } from '../../entities/CartItemEntity';
import { CartItemResponseDto } from '../../../application/dto/CartDto';

export class CartItemMapper {
    public static toDomain(entity: CartItemEntity): CartItem {
        const unitPrice = new Money(entity.unitPrice, entity.currency);

        return CartItem.reconstitute(
            entity.id,
            entity.cartId,
            entity.productVariantId,
            entity.productName,
            entity.quantity,
            unitPrice,
            entity.createdAt
        );
    }

    public static toEntity(domain: CartItem, cartId: string): CartItemEntity {
        const entity = new CartItemEntity();
        entity.id = domain.id;
        entity.cartId = cartId;
        entity.productVariantId = domain.productVariantId;
        entity.productName = domain.productName;
        entity.quantity = domain.quantity;
        entity.unitPrice = domain.getUnitPrice().getAmount();
        entity.currency = domain.getUnitPrice().getCurrency();
        entity.createdAt = domain.addedAt;
        return entity;
    }

    public static toResponseDto(entity: CartItemEntity): CartItemResponseDto {
        return {
            id: entity.id,
            productVariantId: entity.productVariantId,
            productName: entity.productName,
            quantity: entity.quantity,
            unitPrice: {
                amount: entity.unitPrice,
                currency: entity.currency
            },
            lineTotal: {
                amount: entity.unitPrice * entity.quantity,
                currency: entity.currency
            },
            addedAt: entity.createdAt,
            productId: entity.productId,
            imageUrl: entity.imageUrl,
            variantAttributes: entity.variantAttributes
        };
    }
}