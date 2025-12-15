import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../config/database';
import { IMerchantStaffRepository } from '../../../domain/repositories/IMerchantStaffRepository';
import { MerchantStaff } from '../../../domain/entities/MerchantStaff';
import { MerchantStaffEntity } from '../../entities/MerchantStaffEntity';
import { MerchantStaffMapper } from '../mappers/MerchantStaffMapper';

export class TypeOrmMerchantStaffRepository implements IMerchantStaffRepository {
    private readonly repository: Repository<MerchantStaffEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(MerchantStaffEntity);
    }

    public async save(staff: MerchantStaff): Promise<MerchantStaff> {
        const entity = MerchantStaffMapper.toEntity(staff);
        const savedEntity = await this.repository.save(entity);
        return MerchantStaffMapper.toDomain(savedEntity);
    }

    public async findById(id: string): Promise<MerchantStaff | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? MerchantStaffMapper.toDomain(entity) : null;
    }

    public async findByMerchantId(merchantId: string): Promise<MerchantStaff[]> {
        const entities = await this.repository.find({
            where: { merchantId },
            order: { createdAt: 'ASC' },
        });
        return entities.map((entity) => MerchantStaffMapper.toDomain(entity));
    }

    public async findByUserId(userId: string): Promise<MerchantStaff[]> {
        const entities = await this.repository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        return entities.map((entity) => MerchantStaffMapper.toDomain(entity));
    }

    public async findByMerchantAndUser(
        merchantId: string,
        userId: string
    ): Promise<MerchantStaff | null> {
        const entity = await this.repository.findOne({
            where: { merchantId, userId },
        });
        return entity ? MerchantStaffMapper.toDomain(entity) : null;
    }

    public async update(staff: MerchantStaff): Promise<MerchantStaff> {
        const entity = MerchantStaffMapper.toEntity(staff);
        const updatedEntity = await this.repository.save(entity);
        return MerchantStaffMapper.toDomain(updatedEntity);
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    public async existsByMerchantAndUser(
        merchantId: string,
        userId: string
    ): Promise<boolean> {
        const count = await this.repository.count({
            where: { merchantId, userId },
        });
        return count > 0;
    }

    public async countByMerchant(merchantId: string): Promise<number> {
        return this.repository.count({ where: { merchantId } });
    }
}