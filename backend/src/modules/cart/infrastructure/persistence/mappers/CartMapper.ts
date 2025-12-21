import { Cart } from '../../../domain/entities/Cart';
import { CartEntity } from '../../entities/CartEntity';
import { CartItemMapper } from './CartItemMapper';

export class CartMapper {
    public static toDomain(entity: CartEntity): Cart {
        console.log('🔄 CartMapper.toDomain - entity:', entity.id, 'items:', entity.items?.length || 0);

        const cart = Cart.reconstitute(
            entity.id,
            entity.userId,
            entity.createdAt,
            entity.updatedAt
        );

        // Map cart items if they exist
        if (entity.items && Array.isArray(entity.items) && entity.items.length > 0) {
            console.log('📦 CartMapper.toDomain - mapping items:', entity.items.length);

            const domainItems = entity.items.map(itemEntity => {
                console.log('  - Mapping item:', itemEntity.id, itemEntity.productName);
                return CartItemMapper.toDomain(itemEntity);
            });

            cart.setItems(domainItems);
            console.log('✅ Cart items mapped:', domainItems.length);
        } else {
            console.log('⚠️ CartMapper.toDomain - no items to map');
            cart.setItems([]); 
        }

        return cart;
    }

    public static toEntity(domain: Cart): CartEntity {
        const entity = new CartEntity();
        entity.id = domain.id;
        entity.userId = domain.userId;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;

        entity.items = [];

        return entity;
    }
}