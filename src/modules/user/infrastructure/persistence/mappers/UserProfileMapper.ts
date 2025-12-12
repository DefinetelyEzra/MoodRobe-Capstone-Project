import { UserProfile } from '../../../domain/entities/UserProfile';
import { UserProfileEntity } from '../entities/UserProfileEntity';

export class UserProfileMapper {
    public static toDomain(entity: UserProfileEntity): UserProfile {
        return UserProfile.reconstitute(
            entity.id,
            entity.userId,
            entity.preferences,
            entity.savedAesthetics,
            entity.createdAt,
            entity.updatedAt
        );
    }

    public static toEntity(domain: UserProfile): UserProfileEntity {
        const entity = new UserProfileEntity();
        entity.id = domain.id;
        entity.userId = domain.userId;
        entity.preferences = domain.preferences;
        entity.savedAesthetics = domain.savedAesthetics;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }
}