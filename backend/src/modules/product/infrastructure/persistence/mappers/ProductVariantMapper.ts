import { ProductVariant } from '../../../domain/entities/ProductVariant';
import { Money } from '@shared/domain/value-objects/Money';
import { ProductVariantEntity } from '../../entities/ProductVariantEntity';

export class ProductVariantMapper {
    public static toDomain(entity: ProductVariantEntity): ProductVariant {
        const price = new Money(entity.price);

        return ProductVariant.reconstitute({
            id: entity.id,
            productId: entity.productId,
            sku: entity.sku,
            size: entity.size,
            color: entity.color,
            price: price,
            stockQuantity: entity.stockQuantity,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        });
    }

    public static toEntity(domain: ProductVariant): ProductVariantEntity {
        const entity = new ProductVariantEntity();
        entity.id = domain.id;
        entity.productId = domain.productId;
        entity.sku = domain.sku;
        entity.size = domain.size;
        entity.color = domain.color;
        entity.price = domain.getPrice().getAmount();
        entity.stockQuantity = domain.stockQuantity;
        entity.isActive = domain.isActive;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }
}