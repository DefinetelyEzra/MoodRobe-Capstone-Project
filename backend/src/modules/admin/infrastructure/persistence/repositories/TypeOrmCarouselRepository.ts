import { Repository } from 'typeorm';
import { AppDataSource } from '@config/database';
import { HomepageCarouselEntity } from '../../entities/HomepageCarouselEntity';
import { v4 as uuidv4 } from 'uuid';

export class TypeOrmCarouselRepository {
    private readonly repository: Repository<HomepageCarouselEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(HomepageCarouselEntity);
    }

    async findAll(): Promise<HomepageCarouselEntity[]> {
        return this.repository.find({
            order: { displayOrder: 'ASC' }
        });
    }

    async findActive(): Promise<HomepageCarouselEntity[]> {
        return this.repository.find({
            where: { isActive: true },
            order: { displayOrder: 'ASC' }
        });
    }

    async findById(id: string): Promise<HomepageCarouselEntity | null> {
        return this.repository.findOne({ where: { id } });
    }

    async create(data: Partial<HomepageCarouselEntity>): Promise<HomepageCarouselEntity> {
        const carousel = this.repository.create({
            id: uuidv4(),
            imageUrl: data.imageUrl!,
            title: data.title,
            subtitle: data.subtitle,
            linkUrl: data.linkUrl,
            displayOrder: data.displayOrder ?? 0,
            isActive: data.isActive ?? true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return this.repository.save(carousel);
    }

    async update(id: string, data: Partial<HomepageCarouselEntity>): Promise<HomepageCarouselEntity | null> {
        const entity = await this.findById(id);
        if (!entity) return null;

        // Update only provided fields
        if (data.imageUrl !== undefined) entity.imageUrl = data.imageUrl;
        if (data.title !== undefined) entity.title = data.title;
        if (data.subtitle !== undefined) entity.subtitle = data.subtitle;
        if (data.linkUrl !== undefined) entity.linkUrl = data.linkUrl;
        if (data.displayOrder !== undefined) entity.displayOrder = data.displayOrder;
        if (data.isActive !== undefined) entity.isActive = data.isActive;

        entity.updatedAt = new Date();

        return this.repository.save(entity);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return (result.affected ?? 0) > 0;
    }
}