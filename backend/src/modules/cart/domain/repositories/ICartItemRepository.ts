import { CartItemEntity } from '@modules/cart/infrastructure/entities/CartItemEntity';
import { CartItem } from '../entities/CartItem';

export interface ICartItemRepository {
    save(item: CartItem): Promise<CartItem>;
    saveEntity(entity: CartItemEntity): Promise<CartItem>;
    saveMany(items: CartItem[]): Promise<CartItem[]>;
    findById(id: string): Promise<CartItem | null>;
    findByCartId(cartId: string): Promise<CartItem[]>;
    findByCartAndVariant(cartId: string, productVariantId: string): Promise<CartItem | null>;
    findEntitiesByCartId(cartId: string): Promise<CartItemEntity[]>;
    findEntityByCartAndVariant(cartId: string, productVariantId: string): Promise<CartItemEntity | null>;
    update(item: CartItem): Promise<CartItem>;
    delete(id: string): Promise<void>;
    deleteByCartId(cartId: string): Promise<void>;
    deleteByCartAndVariant(cartId: string, productVariantId: string): Promise<void>;
}