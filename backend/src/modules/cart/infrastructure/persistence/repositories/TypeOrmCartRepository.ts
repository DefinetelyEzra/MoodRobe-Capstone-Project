import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../config/database';
import { ICartRepository } from '../../../domain/repositories/ICartRepository';
import { Cart } from '../../../domain/entities/Cart';
import { CartEntity } from '../../entities/CartEntity';
import { CartMapper } from '../mappers/CartMapper';

export class TypeOrmCartRepository implements ICartRepository {
    private readonly repository: Repository<CartEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(CartEntity);
    }

    public async save(cart: Cart): Promise<Cart> {
        const entity = CartMapper.toEntity(cart);
        const savedEntity = await this.repository.save(entity);
        return CartMapper.toDomain(savedEntity);
    }

    public async findById(id: string): Promise<Cart | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? CartMapper.toDomain(entity) : null;
    }

    public async findByUserId(userId: string): Promise<Cart | null> {
        const entity = await this.repository.findOne({ where: { userId } });
        return entity ? CartMapper.toDomain(entity) : null;
    }

    public async update(cart: Cart): Promise<Cart> {
        const entity = CartMapper.toEntity(cart);
        const updatedEntity = await this.repository.save(entity);
        return CartMapper.toDomain(updatedEntity);
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    public async clearCart(userId: string): Promise<void> {
        const cart = await this.findByUserId(userId);
        if (cart) {
            // Delete all cart items - this will be handled by CartItemRepository
            cart.updatedAt = new Date();
            await this.update(cart);
        }
    }

    public async existsByUserId(userId: string): Promise<boolean> {
        const count = await this.repository.count({ where: { userId } });
        return count > 0;
    }
}