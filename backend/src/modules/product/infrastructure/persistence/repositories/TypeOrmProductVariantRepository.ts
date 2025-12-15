import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../config/database';
import { IProductVariantRepository } from '../../../domain/repositories/IProductVariantRepository';
import { ProductVariant } from '../../../domain/entities/ProductVariant';
import { ProductVariantEntity } from '../../entities/ProductVariantEntity';
import { ProductVariantMapper } from '../mappers/ProductVariantMapper';

export class TypeOrmProductVariantRepository implements IProductVariantRepository {
    private readonly repository: Repository<ProductVariantEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(ProductVariantEntity);
    }

    public async save(variant: ProductVariant): Promise<ProductVariant> {
        const entity = ProductVariantMapper.toEntity(variant);
        const savedEntity = await this.repository.save(entity);
        return ProductVariantMapper.toDomain(savedEntity);
    }

    public async saveMany(variants: ProductVariant[]): Promise<ProductVariant[]> {
        const entities = variants.map((v) => ProductVariantMapper.toEntity(v));
        const savedEntities = await this.repository.save(entities);
        return savedEntities.map((entity) => ProductVariantMapper.toDomain(entity));
    }

    public async findById(id: string): Promise<ProductVariant | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? ProductVariantMapper.toDomain(entity) : null;
    }

    public async findByProductId(productId: string): Promise<ProductVariant[]> {
        const entities = await this.repository.find({
            where: { productId },
            order: { createdAt: 'ASC' },
        });
        return entities.map((entity) => ProductVariantMapper.toDomain(entity));
    }

    public async findBySku(sku: string): Promise<ProductVariant | null> {
        const entity = await this.repository.findOne({ where: { sku } });
        return entity ? ProductVariantMapper.toDomain(entity) : null;
    }

    public async update(variant: ProductVariant): Promise<ProductVariant> {
        const entity = ProductVariantMapper.toEntity(variant);
        const updatedEntity = await this.repository.save(entity);
        return ProductVariantMapper.toDomain(updatedEntity);
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    public async deleteByProductId(productId: string): Promise<void> {
        await this.repository.delete({ productId });
    }

    public async existsBySku(sku: string): Promise<boolean> {
        const count = await this.repository.count({ where: { sku } });
        return count > 0;
    }
}