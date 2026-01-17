import { AppDataSource } from '@config/database';
import { Repository } from 'typeorm';
import { ICollectionItemRepository } from '@modules/user/domain/repositories/ICollectionItemRepository';
import { CollectionItem } from '@modules/user/domain/entities/CollectionItem';
import { CollectionItemEntity } from '../../entities/CollectionItemEntity';
import { CollectionItemMapper } from '../mappers/CollectionItemMapper';

export class TypeOrmCollectionItemRepository implements ICollectionItemRepository {
    private readonly repository: Repository<CollectionItemEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(CollectionItemEntity);
    }

    async save(item: CollectionItem): Promise<void> {
        const entity = CollectionItemMapper.toEntity(item);
        await this.repository.save(entity);
    }

    async delete(collectionId: string, productId: string): Promise<void> {
        await this.repository.delete({ collectionId, productId });
    }

    async findByCollectionId(collectionId: string): Promise<CollectionItem[]> {
        const entities = await this.repository.find({
            where: { collectionId },
            order: { addedAt: 'DESC' }
        });
        return entities.map(CollectionItemMapper.toDomain);
    }

    async exists(collectionId: string, productId: string): Promise<boolean> {
        const count = await this.repository.count({
            where: { collectionId, productId }
        });
        return count > 0;
    }
}