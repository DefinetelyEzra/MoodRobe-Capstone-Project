import { Collection } from '@modules/user/domain/entities/Collection';
import { CollectionEntity } from '../../entities/CollectionEntity';

export class CollectionMapper {
    public static toDomain(entity: CollectionEntity): Collection {
        return Collection.reconstitute({
            id: entity.id,
            userId: entity.userId,
            name: entity.name,
            description: entity.description,
            isPublic: entity.isPublic,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        });
    }

    public static toEntity(domain: Collection): CollectionEntity {
        const entity = new CollectionEntity();
        entity.id = domain.id;
        entity.userId = domain.userId;
        entity.name = domain.name;
        entity.description = domain.description;
        entity.isPublic = domain.isPublic;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }
}