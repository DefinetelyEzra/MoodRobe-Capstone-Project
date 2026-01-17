import { IUserFavoriteRepository } from '@modules/user/domain/repositories/IUserFavoriteRepository';

export class RemoveFavoriteUseCase {
    constructor(private readonly favoriteRepository: IUserFavoriteRepository) { }

    async execute(userId: string, productId: string): Promise<void> {
        const favorite = await this.favoriteRepository.findByUserAndProduct(userId, productId);
        if (!favorite) {
            throw new Error('Favorite not found');
        }
        await this.favoriteRepository.delete(userId, productId);
    }
}