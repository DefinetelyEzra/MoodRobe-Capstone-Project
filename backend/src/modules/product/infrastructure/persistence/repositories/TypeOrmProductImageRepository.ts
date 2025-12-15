import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../config/database';
import { IProductImageRepository } from '../../../domain/repositories/IProductImageRepository';
import { ProductImage } from '../../../domain/entities/ProductImage';
import { ProductImageEntity } from '../../entities/ProductImageEntity';
import { ProductImageMapper } from '../mappers/ProductImageMapper';

export class TypeOrmProductImageRepository implements IProductImageRepository {
    private readonly repository: Repository<ProductImageEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(ProductImageEntity);
    }

    public async save(image: ProductImage): Promise<ProductImage> {
        const entity = ProductImageMapper.toEntity(image);
        const savedEntity = await this.repository.save(entity);
        return ProductImageMapper.toDomain(savedEntity);
    }

    public async saveMany(images: ProductImage[]): Promise<ProductImage[]> {
        const entities = images.map((img) => ProductImageMapper.toEntity(img));
        const savedEntities = await this.repository.save(entities);
        return savedEntities.map((entity) => ProductImageMapper.toDomain(entity));
    }

    public async findById(id: string): Promise<ProductImage | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? ProductImageMapper.toDomain(entity) : null;
    }

    public async findByProductId(productId: string): Promise<ProductImage[]> {
        const entities = await this.repository.find({
            where: { productId },
            order: { displayOrder: 'ASC' },
        });
        return entities.map((entity) => ProductImageMapper.toDomain(entity));
    }

    public async findPrimaryImage(productId: string): Promise<ProductImage | null> {
        const entity = await this.repository.findOne({
            where: { productId, isPrimary: true },
        });
        return entity ? ProductImageMapper.toDomain(entity) : null;
    }

    public async update(image: ProductImage): Promise<ProductImage> {
        const entity = ProductImageMapper.toEntity(image);
        const updatedEntity = await this.repository.save(entity);
        return ProductImageMapper.toDomain(updatedEntity);
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    public async deleteByProductId(productId: string): Promise<void> {
        await this.repository.delete({ productId });
    }

    public async setPrimaryImage(productId: string, imageId: string): Promise<void> {
        // Unset all primary images for this product
        await this.repository.update(
            { productId },
            { isPrimary: false }
        );

        // Set the specified image as primary if imageId is provided
        if (imageId) {
            await this.repository.update(
                { id: imageId, productId },
                { isPrimary: true }
            );
        }
    }
}