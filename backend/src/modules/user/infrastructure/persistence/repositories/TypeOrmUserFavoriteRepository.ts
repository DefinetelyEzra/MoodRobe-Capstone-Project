import { AppDataSource } from '@config/database';
import { Repository } from 'typeorm';
import { IUserFavoriteRepository } from '@modules/user/domain/repositories/IUserFavoriteRepository';
import { UserFavorite } from '@modules/user/domain/entities/UserFavorite';
import { UserFavoriteEntity } from '../../entities/UserFavoriteEntity';
import { UserFavoriteMapper } from '../mappers/UserFavoriteMapper';

export class TypeOrmUserFavoriteRepository implements IUserFavoriteRepository {
    private readonly repository: Repository<UserFavoriteEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(UserFavoriteEntity);
    }

    async save(favorite: UserFavorite): Promise<void> {
        const entity = UserFavoriteMapper.toEntity(favorite);
        await this.repository.save(entity);
    }

    async delete(userId: string, productId: string): Promise<void> {
        await this.repository.delete({ userId, productId });
    }

    async findByUserId(userId: string): Promise<UserFavorite[]> {
        const entities = await this.repository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
        return entities.map(UserFavoriteMapper.toDomain);
    }

    async findByUserAndProduct(userId: string, productId: string): Promise<UserFavorite | null> {
        const entity = await this.repository.findOne({
            where: { userId, productId }
        });
        return entity ? UserFavoriteMapper.toDomain(entity) : null;
    }

    async exists(userId: string, productId: string): Promise<boolean> {
        const count = await this.repository.count({
            where: { userId, productId }
        });
        return count > 0;
    }
}