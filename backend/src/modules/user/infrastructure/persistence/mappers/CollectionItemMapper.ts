import { CollectionItem } from '@modules/user/domain/entities/CollectionItem';
import { CollectionItemEntity } from '../../entities/CollectionItemEntity';

export class CollectionItemMapper {
    public static toDomain(entity: CollectionItemEntity): CollectionItem {
        return CollectionItem.reconstitute(
            entity.id,
            entity.collectionId,
            entity.productId,
            entity.addedAt
        );
    }

    public static toEntity(domain: CollectionItem): CollectionItemEntity {
        const entity = new CollectionItemEntity();
        entity.id = domain.id;
        entity.collectionId = domain.collectionId;
        entity.productId = domain.productId;
        entity.addedAt = domain.addedAt;
        return entity;
    }
}