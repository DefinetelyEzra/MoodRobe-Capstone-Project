import { AppDataSource } from '@config/database';
import { Repository } from 'typeorm';
import { ICollectionRepository } from '@modules/user/domain/repositories/ICollectionRepository';
import { Collection } from '@modules/user/domain/entities/Collection';
import { CollectionEntity } from '../../entities/CollectionEntity';
import { CollectionMapper } from '../mappers/CollectionMapper';

export class TypeOrmCollectionRepository implements ICollectionRepository {
    private readonly repository: Repository<CollectionEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(CollectionEntity);
    }

    async save(collection: Collection): Promise<void> {
        const entity = CollectionMapper.toEntity(collection);
        await this.repository.save(entity);
    }

    async findById(id: string): Promise<Collection | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? CollectionMapper.toDomain(entity) : null;
    }

    async findByUserId(userId: string): Promise<Collection[]> {
        const entities = await this.repository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
        return entities.map(CollectionMapper.toDomain);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}