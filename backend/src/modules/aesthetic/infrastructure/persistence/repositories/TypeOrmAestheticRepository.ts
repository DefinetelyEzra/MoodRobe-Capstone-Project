import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../config/database';
import { IAestheticRepository } from '../../../domain/repositories/IAestheticRepository';
import { Aesthetic } from '@modules/aesthetic/domain/entities/Aeshtetic';
import { AestheticEntity } from '../../entities/AestheticEntity';
import { AestheticMapper } from '../mappers/AestheticMapper';

export class TypeOrmAestheticRepository implements IAestheticRepository {
    private readonly repository: Repository<AestheticEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(AestheticEntity);
    }

    public async save(aesthetic: Aesthetic): Promise<Aesthetic> {
        const entity = AestheticMapper.toEntity(aesthetic);
        const savedEntity = await this.repository.save(entity);
        return AestheticMapper.toDomain(savedEntity);
    }

    public async findById(id: string): Promise<Aesthetic | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? AestheticMapper.toDomain(entity) : null;
    }

    public async findByName(name: string): Promise<Aesthetic | null> {
        const entity = await this.repository.findOne({
            where: { name: name.toLowerCase() }
        });
        return entity ? AestheticMapper.toDomain(entity) : null;
    }

    public async findAll(): Promise<Aesthetic[]> {
        const entities = await this.repository.find({
            order: { name: 'ASC' },
        });
        return entities.map((entity) => AestheticMapper.toDomain(entity));
    }

    public async update(aesthetic: Aesthetic): Promise<Aesthetic> {
        const entity = AestheticMapper.toEntity(aesthetic);
        const updatedEntity = await this.repository.save(entity);
        return AestheticMapper.toDomain(updatedEntity);
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    public async existsByName(name: string): Promise<boolean> {
        const count = await this.repository.count({
            where: { name: name.toLowerCase() }
        });
        return count > 0;
    }

    public async searchByKeyword(keyword: string): Promise<Aesthetic[]> {
        const entities = await this.repository
            .createQueryBuilder('aesthetic')
            .where('LOWER(aesthetic.name) LIKE LOWER(:keyword)', {
                keyword: `%${keyword}%`,
            })
            .orWhere('LOWER(aesthetic.description) LIKE LOWER(:keyword)', {
                keyword: `%${keyword}%`,
            })
            .orWhere(
                "aesthetic.theme_properties::text LIKE :keyword",
                { keyword: `%${keyword}%` }
            )
            .orderBy('aesthetic.name', 'ASC')
            .getMany();

        return entities.map((entity) => AestheticMapper.toDomain(entity));
    }
}