import { Outfit, OutfitType, OutfitItems } from '../../../domain/entities/Outfit';
import { OutfitEntity } from '../../entities/OutfitEntity';

export class OutfitMapper {
    public static toDomain(entity: OutfitEntity): Outfit {
        return Outfit.reconstitute({
            id: entity.id,
            userId: entity.userId,
            name: entity.name,
            description: entity.description || undefined,
            outfitType: entity.outfitType as OutfitType,
            items: entity.items as OutfitItems,
            aestheticTags: entity.aestheticTags,
            isPublic: entity.isPublic,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }

    public static toEntity(domain: Outfit): OutfitEntity {
        const entity = new OutfitEntity();
        entity.id = domain.id;
        entity.userId = domain.userId;
        entity.name = domain.name;
        entity.description = domain.description || null;
        entity.outfitType = domain.outfitType;
        entity.items = domain.getItems();
        entity.aestheticTags = domain.aestheticTags;
        entity.isPublic = domain.isPublic;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }
}