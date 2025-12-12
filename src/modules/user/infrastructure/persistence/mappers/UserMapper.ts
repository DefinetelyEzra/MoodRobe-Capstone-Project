import { User } from '../../../domain/entities/User';
import { UserEntity } from '../entities/UserEntity';

export class UserMapper {
    public static toDomain(entity: UserEntity): User {
        return User.reconstitute(
            entity.id,
            entity.name,
            entity.email,
            entity.passwordHash,
            entity.selectedAestheticId,
            entity.createdAt,
            entity.updatedAt
        );
    }

    public static toEntity(domain: User): UserEntity {
        const entity = new UserEntity();
        entity.id = domain.id;
        entity.name = domain.name;
        entity.email = domain.getEmail();
        entity.passwordHash = domain.getPasswordHash();
        entity.selectedAestheticId = domain.selectedAestheticId;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }
}