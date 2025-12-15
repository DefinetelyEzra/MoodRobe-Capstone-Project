import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../config/database';
import { IMerchantRepository } from '../../../domain/repositories/IMerchantRepository';
import { Merchant } from '../../../domain/entities/Merchant';
import { MerchantEntity } from '../../entities/MerchantEntity';
import { MerchantMapper } from '../mappers/MerchantMapper';

export class TypeOrmMerchantRepository implements IMerchantRepository {
    private readonly repository: Repository<MerchantEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(MerchantEntity);
    }

    public async save(merchant: Merchant): Promise<Merchant> {
        const entity = MerchantMapper.toEntity(merchant);
        const savedEntity = await this.repository.save(entity);
        return MerchantMapper.toDomain(savedEntity);
    }

    public async findById(id: string): Promise<Merchant | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? MerchantMapper.toDomain(entity) : null;
    }

    public async findByEmail(email: string): Promise<Merchant | null> {
        const entity = await this.repository.findOne({
            where: { email: email.toLowerCase() },
        });
        return entity ? MerchantMapper.toDomain(entity) : null;
    }

    public async findAll(limit: number = 20, offset: number = 0): Promise<Merchant[]> {
        const entities = await this.repository.find({
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
        return entities.map((entity) => MerchantMapper.toDomain(entity));
    }

    public async update(merchant: Merchant): Promise<Merchant> {
        const entity = MerchantMapper.toEntity(merchant);
        const updatedEntity = await this.repository.save(entity);
        return MerchantMapper.toDomain(updatedEntity);
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    public async existsByEmail(email: string): Promise<boolean> {
        const count = await this.repository.count({
            where: { email: email.toLowerCase() },
        });
        return count > 0;
    }

    public async findActiveOnly(
        limit: number = 20,
        offset: number = 0
    ): Promise<Merchant[]> {
        const entities = await this.repository.find({
            where: { isActive: true },
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
        return entities.map((entity) => MerchantMapper.toDomain(entity));
    }

    public async count(): Promise<number> {
        return this.repository.count();
    }
}