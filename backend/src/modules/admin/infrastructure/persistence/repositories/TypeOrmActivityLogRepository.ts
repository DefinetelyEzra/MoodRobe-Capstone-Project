import { Repository } from 'typeorm';
import { AppDataSource } from '@config/database';
import { AdminActivityLogEntity } from '../../entities/AdminActivityLogEntity';
import { v4 as uuidv4 } from 'uuid';

export class TypeOrmActivityLogRepository {
    private readonly repository: Repository<AdminActivityLogEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(AdminActivityLogEntity);
    }

    async create(data: Omit<AdminActivityLogEntity, 'id' | 'createdAt'>): Promise<AdminActivityLogEntity> {
        const log = this.repository.create({
            id: uuidv4(),
            adminEmail: data.adminEmail,
            action: data.action,
            resourceType: data.resourceType,
            resourceId: data.resourceId,
            details: data.details,
            createdAt: new Date()
        });
        return this.repository.save(log);
    }

    async findRecent(limit: number = 50): Promise<AdminActivityLogEntity[]> {
        return this.repository.find({
            order: { createdAt: 'DESC' },
            take: limit
        });
    }

    async findByEmail(adminEmail: string, limit: number = 50): Promise<AdminActivityLogEntity[]> {
        return this.repository.find({
            where: { adminEmail },
            order: { createdAt: 'DESC' },
            take: limit
        });
    }
}