import { Repository } from 'typeorm';
import { AppDataSource } from '@config/database';
import { HomepageContentEntity } from '../../entities/HomepageContentEntity';

export class TypeOrmContentRepository {
    private readonly repository: Repository<HomepageContentEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(HomepageContentEntity);
    }

    async findAll(): Promise<HomepageContentEntity[]> {
        return this.repository.find();
    }

    async findBySectionKey(sectionKey: string): Promise<HomepageContentEntity | null> {
        return this.repository.findOne({ where: { sectionKey } });
    }

    async updateBySectionKey(sectionKey: string, content: string, metadata?: Record<string, any>): Promise<HomepageContentEntity | null> {
        const entity = await this.findBySectionKey(sectionKey);
        if (!entity) return null;

        entity.content = content;
        if (metadata) {
            entity.metadata = { ...entity.metadata, ...metadata };
        }
        entity.updatedAt = new Date();

        return this.repository.save(entity);
    }
}
