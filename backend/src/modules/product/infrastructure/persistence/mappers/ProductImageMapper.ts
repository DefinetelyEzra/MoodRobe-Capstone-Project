import { ProductImage } from '../../../domain/entities/ProductImage';
import { ProductImageEntity } from '../../entities/ProductImageEntity';

export class ProductImageMapper {
    public static toDomain(entity: ProductImageEntity): ProductImage {
        return ProductImage.reconstitute(
            entity.id,
            entity.productId,
            entity.url,
            entity.isPrimary,
            entity.displayOrder,
            entity.createdAt
        );
    }

    public static toEntity(domain: ProductImage): ProductImageEntity {
        const entity = new ProductImageEntity();
        entity.id = domain.id;
        entity.productId = domain.productId;
        entity.url = domain.url;
        entity.isPrimary = domain.isPrimary;
        entity.displayOrder = domain.displayOrder;
        entity.createdAt = domain.createdAt;
        return entity;
    }
}