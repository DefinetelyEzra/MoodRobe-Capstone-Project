import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../config/database';
import { ICartItemRepository } from '../../../domain/repositories/ICartItemRepository';
import { CartItem } from '../../../domain/entities/CartItem';
import { CartItemEntity } from '../../entities/CartItemEntity';
import { CartItemMapper } from '../mappers/CartItemMapper';

export class TypeOrmCartItemRepository implements ICartItemRepository {
    private readonly repository: Repository<CartItemEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(CartItemEntity);
    }

    public async save(item: CartItem): Promise<CartItem> {
        console.log('💾 Saving cart item:', {
            id: item.id,
            cartId: item.cartId,
            productVariantId: item.productVariantId,
            productName: item.productName,
            quantity: item.quantity
        });

        const entity = CartItemMapper.toEntity(item, item.cartId);
        const savedEntity = await this.repository.save(entity);

        console.log('✅ Cart item saved to DB:', {
            id: savedEntity.id,
            cartId: savedEntity.cartId,
            productName: savedEntity.productName
        });

        return CartItemMapper.toDomain(savedEntity);
    }

    public async saveMany(items: CartItem[]): Promise<CartItem[]> {
        const entities = items.map((item) => CartItemMapper.toEntity(item, item.cartId));
        const savedEntities = await this.repository.save(entities);
        return savedEntities.map(entity => CartItemMapper.toDomain(entity));
    }

    public async findById(id: string): Promise<CartItem | null> {
        const entity = await this.repository.findOne({ where: { id } });
        if (!entity) return null;

        return CartItemMapper.toDomain(entity);
    }

    public async findByCartId(cartId: string): Promise<CartItem[]> {
        console.log('🔍 Finding cart items for cartId:', cartId);

        const entities = await this.repository.find({
            where: { cartId },
            order: { createdAt: 'ASC' },
        });

        console.log('📋 Found cart items:', {
            cartId,
            count: entities.length,
            items: entities.map(e => ({
                id: e.id,
                productName: e.productName,
                quantity: e.quantity
            }))
        });

        return entities.map(entity => CartItemMapper.toDomain(entity));
    }

    public async findByCartAndVariant(
        cartId: string,
        productVariantId: string
    ): Promise<CartItem | null> {
        const entity = await this.repository.findOne({
            where: { cartId, productVariantId },
        });

        if (!entity) return null;

        return CartItemMapper.toDomain(entity);
    }

    public async update(item: CartItem): Promise<CartItem> {
        const entity = CartItemMapper.toEntity(item, item.cartId);
        const updatedEntity = await this.repository.save(entity);
        return CartItemMapper.toDomain(updatedEntity);
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    public async deleteByCartId(cartId: string): Promise<void> {
        await this.repository.delete({ cartId });
    }

    public async deleteByCartAndVariant(
        cartId: string,
        productVariantId: string
    ): Promise<void> {
        await this.repository.delete({ cartId, productVariantId });
    }
}