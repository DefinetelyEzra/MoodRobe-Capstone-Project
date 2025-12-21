import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../config/database';
import { ICartRepository } from '../../../domain/repositories/ICartRepository';
import { Cart } from '../../../domain/entities/Cart';
import { CartEntity } from '../../entities/CartEntity';
import { CartMapper } from '../mappers/CartMapper';
import { CartItemEntity } from '../../entities/CartItemEntity';

export class TypeOrmCartRepository implements ICartRepository {
    private readonly repository: Repository<CartEntity>;
    private readonly cartItemRepository: Repository<CartItemEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(CartEntity);
        this.cartItemRepository = AppDataSource.getRepository(CartItemEntity);
    }

    public async save(cart: Cart): Promise<Cart> {
        console.log('💾 TypeOrmCartRepository.save - cart:', cart.id, 'items:', cart.getItems().length);

        // Only save the cart entity itself
        const entity = new CartEntity();
        entity.id = cart.id;
        entity.userId = cart.userId;
        entity.createdAt = cart.createdAt;
        entity.updatedAt = cart.updatedAt;

        const savedEntity = await this.repository.save(entity);
        console.log('✅ Cart saved:', savedEntity.id);

        // Reload with relations to get any existing cart items
        const reloadedEntity = await this.repository.findOne({
            where: { id: savedEntity.id },
            relations: ['items']
        });

        console.log('📦 Reloaded cart with items:', reloadedEntity?.items?.length || 0);

        return reloadedEntity ? CartMapper.toDomain(reloadedEntity) : CartMapper.toDomain(savedEntity);
    }

    public async findById(id: string): Promise<Cart | null> {
        console.log('🔍 TypeOrmCartRepository.findById:', id);

        const entity = await this.repository.findOne({
            where: { id },
            relations: ['items']
        });

        console.log('📋 Found cart:', entity?.id, 'items:', entity?.items?.length || 0);

        return entity ? CartMapper.toDomain(entity) : null;
    }

    public async findByUserId(userId: string): Promise<Cart | null> {
        console.log('🔍 TypeOrmCartRepository.findByUserId:', userId);

        const entity = await this.repository.findOne({
            where: { userId },
            relations: ['items']
        });

        console.log('📋 Found cart for user:', entity?.id, 'items:', entity?.items?.length || 0);

        return entity ? CartMapper.toDomain(entity) : null;
    }

    public async update(cart: Cart): Promise<Cart> {
        console.log('🔄 TypeOrmCartRepository.update - cart:', cart.id);

        // Only update the cart entity itself, NOT the items
        // Items should be updated separately via CartItemRepository
        const entity = new CartEntity();
        entity.id = cart.id;
        entity.userId = cart.userId;
        entity.createdAt = cart.createdAt;
        entity.updatedAt = cart.updatedAt;

        const updatedEntity = await this.repository.save(entity);
        console.log('✅ Cart updated:', updatedEntity.id);

        // Reload with relations to get current cart items
        const reloadedEntity = await this.repository.findOne({
            where: { id: updatedEntity.id },
            relations: ['items']
        });

        console.log('📦 Reloaded cart with items:', reloadedEntity?.items?.length || 0);

        return reloadedEntity ? CartMapper.toDomain(reloadedEntity) : CartMapper.toDomain(updatedEntity);
    }

    public async delete(id: string): Promise<void> {
        console.log('🗑️ TypeOrmCartRepository.delete:', id);
        await this.repository.delete(id);
    }

    public async clearCart(userId: string): Promise<void> {
        console.log('🧹 TypeOrmCartRepository.clearCart for user:', userId);

        const cart = await this.findByUserId(userId);
        if (cart) {
            // Delete all cart items from database
            await this.cartItemRepository.delete({ cartId: cart.id });
            console.log('✅ Cart items deleted for cart:', cart.id);

            // Update the cart timestamp
            cart.updatedAt = new Date();

            // Save just the cart entity 
            const entity = new CartEntity();
            entity.id = cart.id;
            entity.userId = cart.userId;
            entity.createdAt = cart.createdAt;
            entity.updatedAt = cart.updatedAt;

            await this.repository.save(entity);
            console.log('✅ Cart timestamp updated');
        }
    }

    public async existsByUserId(userId: string): Promise<boolean> {
        const count = await this.repository.count({ where: { userId } });
        return count > 0;
    }
}