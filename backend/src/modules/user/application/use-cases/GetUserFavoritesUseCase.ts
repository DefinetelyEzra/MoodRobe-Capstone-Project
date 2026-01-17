import { IUserFavoriteRepository } from '@modules/user/domain/repositories/IUserFavoriteRepository';
import { FavoriteResponseDto } from '../dto/FavoriteDto';

export class GetUserFavoritesUseCase {
    constructor(private readonly favoriteRepository: IUserFavoriteRepository) { }

    async execute(userId: string): Promise<FavoriteResponseDto[]> {
        const favorites = await this.favoriteRepository.findByUserId(userId);

        return favorites.map(fav => ({
            id: fav.id,
            userId: fav.userId,
            productId: fav.productId,
            createdAt: fav.createdAt
        }));
    }
}