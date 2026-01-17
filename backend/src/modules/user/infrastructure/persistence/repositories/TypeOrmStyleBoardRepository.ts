import { AppDataSource } from '@config/database';
import { Repository } from 'typeorm';
import { IStyleBoardRepository } from '@modules/user/domain/repositories/IStyleBoardRepository';
import { StyleBoard } from '@modules/user/domain/entities/StyleBoard';
import { StyleBoardEntity } from '../../entities/StyleBoardEntity';
import { StyleBoardMapper } from '../mappers/StyleBoardMapper';

export class TypeOrmStyleBoardRepository implements IStyleBoardRepository {
    private readonly repository: Repository<StyleBoardEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(StyleBoardEntity);
    }

    async save(board: StyleBoard): Promise<void> {
        const entity = StyleBoardMapper.toEntity(board);
        await this.repository.save(entity);
    }

    async findById(id: string): Promise<StyleBoard | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? StyleBoardMapper.toDomain(entity) : null;
    }

    async findByUserId(userId: string): Promise<StyleBoard[]> {
        const entities = await this.repository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
        return entities.map(StyleBoardMapper.toDomain);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}