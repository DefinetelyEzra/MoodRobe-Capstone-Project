import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../config/database';
import { IOutfitRepository } from '../../../domain/repositories/IOutfitRepository';
import { Outfit } from '../../../domain/entities/Outfit';
import { OutfitEntity } from '../../entities/OutfitEntity';
import { OutfitMapper } from '../mappers/OutfitMapper';

export class TypeOrmOutfitRepository implements IOutfitRepository {
    private readonly repository: Repository<OutfitEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(OutfitEntity);
    }

    public async save(outfit: Outfit): Promise<Outfit> {
        const entity = OutfitMapper.toEntity(outfit);
        const savedEntity = await this.repository.save(entity);
        return OutfitMapper.toDomain(savedEntity);
    }

    public async findById(id: string): Promise<Outfit | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? OutfitMapper.toDomain(entity) : null;
    }

    public async findByUserId(userId: string): Promise<Outfit[]> {
        const entities = await this.repository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        return entities.map((entity) => OutfitMapper.toDomain(entity));
    }

    public async findPublicOutfits(limit: number = 20, offset: number = 0): Promise<Outfit[]> {
        const entities = await this.repository.find({
            where: { isPublic: true },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });
        return entities.map((entity) => OutfitMapper.toDomain(entity));
    }

    public async update(outfit: Outfit): Promise<Outfit> {
        const entity = OutfitMapper.toEntity(outfit);
        const updatedEntity = await this.repository.save(entity);
        return OutfitMapper.toDomain(updatedEntity);
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    public async count(userId?: string): Promise<number> {
        if (userId) {
            return this.repository.count({ where: { userId } });
        }
        return this.repository.count({ where: { isPublic: true } });
    }
}