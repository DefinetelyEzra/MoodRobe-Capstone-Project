import { StyleBoard } from '@modules/user/domain/entities/StyleBoard';
import { StyleBoardEntity } from '../../entities/StyleBoardEntity';

export class StyleBoardMapper {
    public static toDomain(entity: StyleBoardEntity): StyleBoard {
        return StyleBoard.reconstitute({
            id: entity.id,
            userId: entity.userId,
            name: entity.name,
            description: entity.description,
            aestheticTags: entity.aestheticTags,
            items: entity.items,
            isPublic: entity.isPublic,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        });
    }

    public static toEntity(domain: StyleBoard): StyleBoardEntity {
        const entity = new StyleBoardEntity();
        entity.id = domain.id;
        entity.userId = domain.userId;
        entity.name = domain.name;
        entity.description = domain.description;
        entity.aestheticTags = domain.aestheticTags;
        entity.items = domain.items;
        entity.isPublic = domain.isPublic;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }
}