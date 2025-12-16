import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../config/database';
import { ICartItemRepository } from '../../../domain/repositories/ICartItemRepository';
import { CartItem } from '../../../domain/entities/CartItem';
import { CartItemEntity } from '../../entities/CartItemEntity';
import { CartItemMapper } from '../mappers/CartItemMapper';
import { ProductEntity } from '@modules/product/infrastructure/entities/ProductEntity';
import { ProductVariantEntity } from '@modules/product/infrastructure/entities/ProductVariantEntity';

export class TypeOrmCartItemRepository implements ICartItemRepository {
    private readonly repository: Repository<CartItemEntity>;
    private readonly productRepository: Repository<ProductEntity>;
    private readonly variantRepository: Repository<ProductVariantEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(CartItemEntity);
        this.productRepository = AppDataSource.getRepository(ProductEntity);
        this.variantRepository = AppDataSource.getRepository(ProductVariantEntity);
    }

    public async save(item: CartItem): Promise<CartItem> {
        const entity = CartItemMapper.toEntity(item);
        const savedEntity = await this.repository.save(entity);
        return CartItemMapper.toDomain(savedEntity, item.productName);
    }

    public async saveMany(items: CartItem[]): Promise<CartItem[]> {
        const entities = items.map((item) => CartItemMapper.toEntity(item));
        const savedEntities = await this.repository.save(entities);
        return Promise.all(
            savedEntities.map(async (entity, index) =>
                CartItemMapper.toDomain(entity, items[index].productName)
            )
        );
    }

    public async findById(id: string): Promise<CartItem | null> {
        const entity = await this.repository.findOne({ where: { id } });
        if (!entity) return null;

        const productName = await this.getProductName(entity.productVariantId);
        return CartItemMapper.toDomain(entity, productName);
    }

    public async findByCartId(cartId: string): Promise<CartItem[]> {
        const entities = await this.repository.find({
            where: { cartId },
            order: { addedAt: 'ASC' },
        });

        return Promise.all(
            entities.map(async (entity) => {
                const productName = await this.getProductName(entity.productVariantId);
                return CartItemMapper.toDomain(entity, productName);
            })
        );
    }

    public async findByCartAndVariant(
        cartId: string,
        productVariantId: string
    ): Promise<CartItem | null> {
        const entity = await this.repository.findOne({
            where: { cartId, productVariantId },
        });

        if (!entity) return null;

        const productName = await this.getProductName(entity.productVariantId);
        return CartItemMapper.toDomain(entity, productName);
    }

    public async update(item: CartItem): Promise<CartItem> {
        const entity = CartItemMapper.toEntity(item);
        const updatedEntity = await this.repository.save(entity);
        return CartItemMapper.toDomain(updatedEntity, item.productName);
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

    private async getProductName(productVariantId: string): Promise<string> {
        const variant = await this.variantRepository.findOne({
            where: { id: productVariantId },
        });

        if (!variant) {
            return 'Unknown Product';
        }

        const product = await this.productRepository.findOne({
            where: { id: variant.productId },
        });

        return product?.name || 'Unknown Product';
    }
}