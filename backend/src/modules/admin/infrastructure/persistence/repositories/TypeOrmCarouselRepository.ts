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
        return this.repository.find({ order: { displayOrder: 'ASC' } });
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
            ...data
        });
        return this.repository.save(carousel);
    }

    async update(id: string, data: Partial<HomepageCarouselEntity>): Promise<HomepageCarouselEntity | null> {
        await this.repository.update(id, data);
        return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return (result.affected ?? 0) > 0;
    }
}