import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../config/database';
import { IProductRepository, ProductSearchCriteria } from '../../../domain/repositories/IProductRepository';
import { Product } from '../../../domain/entities/Product';
import { ProductEntity } from '../../entities/ProductEntity';
import { ProductMapper } from '../mappers/ProductMapper';

export class TypeOrmProductRepository implements IProductRepository {
    private readonly repository: Repository<ProductEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(ProductEntity);
    }

    public async save(product: Product): Promise<Product> {
        const entity = ProductMapper.toEntity(product);
        const savedEntity = await this.repository.save(entity);
        return ProductMapper.toDomain(savedEntity);
    }

    public async findById(id: string): Promise<Product | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? ProductMapper.toDomain(entity) : null;
    }

    public async findByMerchantId(
        merchantId: string,
        limit: number = 20,
        offset: number = 0
    ): Promise<Product[]> {
        const entities = await this.repository.find({
            where: { merchantId },
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
        return entities.map((entity) => ProductMapper.toDomain(entity));
    }

    public async findAll(limit: number = 20, offset: number = 0): Promise<Product[]> {
        const entities = await this.repository.find({
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
        return entities.map((entity) => ProductMapper.toDomain(entity));
    }

    public async search(
        criteria: ProductSearchCriteria,
        limit: number = 20,
        offset: number = 0
    ): Promise<Product[]> {
        const query = this.repository.createQueryBuilder('product');

        if (criteria.merchantId) {
            query.andWhere('product.merchant_id = :merchantId', {
                merchantId: criteria.merchantId,
            });
        }

        if (criteria.category) {
            query.andWhere('LOWER(product.category) = LOWER(:category)', {
                category: criteria.category,
            });
        }

        if (criteria.aestheticTags && criteria.aestheticTags.length > 0) {
            query.andWhere('product.aesthetic_tags && :aestheticTags', {
                aestheticTags: criteria.aestheticTags,
            });
        }

        if (criteria.minPrice !== undefined) {
            query.andWhere('product.base_price >= :minPrice', {
                minPrice: criteria.minPrice,
            });
        }

        if (criteria.maxPrice !== undefined) {
            query.andWhere('product.base_price <= :maxPrice', {
                maxPrice: criteria.maxPrice,
            });
        }

        if (criteria.isActive !== undefined) {
            query.andWhere('product.is_active = :isActive', {
                isActive: criteria.isActive,
            });
        }

        if (criteria.searchTerm) {
            query.andWhere(
                '(LOWER(product.name) LIKE LOWER(:searchTerm) OR LOWER(product.description) LIKE LOWER(:searchTerm))',
                { searchTerm: `%${criteria.searchTerm}%` }
            );
        }

        query.take(limit).skip(offset).orderBy('product.created_at', 'DESC');

        const entities = await query.getMany();
        return entities.map((entity) => ProductMapper.toDomain(entity));
    }

    public async update(product: Product): Promise<Product> {
        const entity = ProductMapper.toEntity(product);
        const updatedEntity = await this.repository.save(entity);
        return ProductMapper.toDomain(updatedEntity);
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    public async count(criteria?: ProductSearchCriteria): Promise<number> {
        if (!criteria) {
            return this.repository.count();
        }

        const query = this.repository.createQueryBuilder('product');

        if (criteria.merchantId) {
            query.andWhere('product.merchant_id = :merchantId', {
                merchantId: criteria.merchantId,
            });
        }

        if (criteria.category) {
            query.andWhere('LOWER(product.category) = LOWER(:category)', {
                category: criteria.category,
            });
        }

        if (criteria.aestheticTags && criteria.aestheticTags.length > 0) {
            query.andWhere('product.aesthetic_tags && :aestheticTags', {
                aestheticTags: criteria.aestheticTags,
            });
        }

        if (criteria.minPrice !== undefined) {
            query.andWhere('product.base_price >= :minPrice', {
                minPrice: criteria.minPrice,
            });
        }

        if (criteria.maxPrice !== undefined) {
            query.andWhere('product.base_price <= :maxPrice', {
                maxPrice: criteria.maxPrice,
            });
        }

        if (criteria.isActive !== undefined) {
            query.andWhere('product.is_active = :isActive', {
                isActive: criteria.isActive,
            });
        }

        if (criteria.searchTerm) {
            query.andWhere(
                '(LOWER(product.name) LIKE LOWER(:searchTerm) OR LOWER(product.description) LIKE LOWER(:searchTerm))',
                { searchTerm: `%${criteria.searchTerm}%` }
            );
        }

        return query.getCount();
    }

    public async findByAestheticTag(
        aestheticId: string,
        limit: number = 20,
        offset: number = 0
    ): Promise<Product[]> {
        const entities = await this.repository
            .createQueryBuilder('product')
            .where(':aestheticId = ANY(product.aesthetic_tags)', { aestheticId })
            .andWhere('product.is_active = :isActive', { isActive: true })
            .take(limit)
            .skip(offset)
            .orderBy('product.created_at', 'DESC')
            .getMany();

        return entities.map((entity) => ProductMapper.toDomain(entity));
    }
}