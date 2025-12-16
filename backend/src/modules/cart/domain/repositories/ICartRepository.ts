import { Cart } from '../entities/Cart';

export interface ICartRepository {
    save(cart: Cart): Promise<Cart>;
    findById(id: string): Promise<Cart | null>;
    findByUserId(userId: string): Promise<Cart | null>;
    update(cart: Cart): Promise<Cart>;
    delete(id: string): Promise<void>;
    clearCart(userId: string): Promise<void>;
    existsByUserId(userId: string): Promise<boolean>;
}