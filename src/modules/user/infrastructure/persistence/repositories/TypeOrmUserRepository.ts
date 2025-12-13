import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../config/database';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { UserEntity } from '../../entities/UserEntity';
import { UserMapper } from '../mappers/UserMapper';

export class TypeOrmUserRepository implements IUserRepository {
    private readonly repository: Repository<UserEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(UserEntity);
    }

    public async save(user: User): Promise<User> {
        const entity = UserMapper.toEntity(user);
        const savedEntity = await this.repository.save(entity);
        return UserMapper.toDomain(savedEntity);
    }

    public async findById(id: string): Promise<User | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? UserMapper.toDomain(entity) : null;
    }

    public async findByEmail(email: string): Promise<User | null> {
        const entity = await this.repository.findOne({
            where: { email: email.toLowerCase() }
        });
        return entity ? UserMapper.toDomain(entity) : null;
    }

    public async update(user: User): Promise<User> {
        const entity = UserMapper.toEntity(user);
        const updatedEntity = await this.repository.save(entity);
        return UserMapper.toDomain(updatedEntity);
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    public async existsByEmail(email: string): Promise<boolean> {
        const count = await this.repository.count({
            where: { email: email.toLowerCase() }
        });
        return count > 0;
    }
}