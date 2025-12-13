import { Aesthetic } from '@modules/aesthetic/domain/entities/Aeshtetic';
import { ThemeProperties } from '../../../domain/value-objects/ThemeProperties';
import { AestheticEntity } from '../../entities/AestheticEntity';

export class AestheticMapper {
    public static toDomain(entity: AestheticEntity): Aesthetic {
        const themeProperties = new ThemeProperties(entity.themeProperties);

        return Aesthetic.reconstitute(
            entity.id,
            entity.name,
            entity.description,
            themeProperties,
            entity.imageUrl,
            entity.createdAt,
            entity.updatedAt
        );
    }

    public static toEntity(domain: Aesthetic): AestheticEntity {
        const entity = new AestheticEntity();
        entity.id = domain.id;
        entity.name = domain.name;
        entity.description = domain.description;
        entity.themeProperties = domain.themeProperties.toJSON();
        entity.imageUrl = domain.imageUrl;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }
}