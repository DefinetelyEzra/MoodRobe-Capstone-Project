import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../config/database';
import { IUserProfileRepository } from '../../../domain/repositories/IUserProfileRepository';
import { UserProfile } from '../../../domain/entities/UserProfile';
import { UserProfileEntity } from '../../entities/UserProfileEntity';
import { UserProfileMapper } from '../mappers/UserProfileMapper';

export class TypeOrmUserProfileRepository implements IUserProfileRepository {
    private readonly repository: Repository<UserProfileEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(UserProfileEntity);
    }

    public async save(profile: UserProfile): Promise<UserProfile> {
        const entity = UserProfileMapper.toEntity(profile);
        const savedEntity = await this.repository.save(entity);
        return UserProfileMapper.toDomain(savedEntity);
    }

    public async findByUserId(userId: string): Promise<UserProfile | null> {
        const entity = await this.repository.findOne({ where: { userId } });
        return entity ? UserProfileMapper.toDomain(entity) : null;
    }

    public async update(profile: UserProfile): Promise<UserProfile> {
        const entity = UserProfileMapper.toEntity(profile);
        const updatedEntity = await this.repository.save(entity);
        return UserProfileMapper.toDomain(updatedEntity);
    }

    public async delete(userId: string): Promise<void> {
        await this.repository.delete({ userId });
    }
}