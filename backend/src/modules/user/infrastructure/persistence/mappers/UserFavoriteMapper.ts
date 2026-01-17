import { UserFavorite } from '@modules/user/domain/entities/UserFavorite';
import { UserFavoriteEntity } from '../../entities/UserFavoriteEntity';

export class UserFavoriteMapper {
    public static toDomain(entity: UserFavoriteEntity): UserFavorite {
        return UserFavorite.reconstitute(
            entity.id,
            entity.userId,
            entity.productId,
            entity.createdAt
        );
    }

    public static toEntity(domain: UserFavorite): UserFavoriteEntity {
        const entity = new UserFavoriteEntity();
        entity.id = domain.id;
        entity.userId = domain.userId;
        entity.productId = domain.productId;
        entity.createdAt = domain.createdAt;
        return entity;
    }
}