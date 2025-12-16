import { CartItem } from '../entities/CartItem';

export interface ICartItemRepository {
    save(item: CartItem): Promise<CartItem>;
    saveMany(items: CartItem[]): Promise<CartItem[]>;
    findById(id: string): Promise<CartItem | null>;
    findByCartId(cartId: string): Promise<CartItem[]>;
    findByCartAndVariant(cartId: string, productVariantId: string): Promise<CartItem | null>;
    update(item: CartItem): Promise<CartItem>;
    delete(id: string): Promise<void>;
    deleteByCartId(cartId: string): Promise<void>;
    deleteByCartAndVariant(cartId: string, productVariantId: string): Promise<void>;
}