import { Cart } from '../../../domain/entities/Cart';
import { CartEntity } from '../../entities/CartEntity';

export class CartMapper {
    public static toDomain(entity: CartEntity): Cart {
        return Cart.reconstitute(entity.id, entity.userId, entity.createdAt, entity.updatedAt);
    }

    public static toEntity(domain: Cart): CartEntity {
        const entity = new CartEntity();
        entity.id = domain.id;
        entity.userId = domain.userId;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }
}