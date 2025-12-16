import { Product } from '../../../domain/entities/Product';
import { Money } from '@shared/domain/value-objects/Money';
import { ProductEntity } from '../../entities/ProductEntity';

export class ProductMapper {
    public static toDomain(entity: ProductEntity): Product {
        const basePrice = new Money(entity.basePrice);

        return Product.reconstitute({
            id: entity.id,
            merchantId: entity.merchantId,
            name: entity.name,
            description: entity.description,
            category: entity.category,
            basePrice: basePrice,
            aestheticTags: entity.aestheticTags,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        });
    }

    public static toEntity(domain: Product): ProductEntity {
        const entity = new ProductEntity();
        entity.id = domain.id;
        entity.merchantId = domain.merchantId;
        entity.name = domain.name;
        entity.description = domain.description;
        entity.category = domain.category;
        entity.basePrice = domain.getBasePrice().getAmount();
        entity.aestheticTags = domain.aestheticTags;
        entity.isActive = domain.isActive;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }
}