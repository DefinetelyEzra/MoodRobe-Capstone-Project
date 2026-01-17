import { IUserFavoriteRepository } from '@modules/user/domain/repositories/IUserFavoriteRepository';

export class CheckFavoriteUseCase {
    constructor(private readonly favoriteRepository: IUserFavoriteRepository) { }

    async execute(userId: string, productId: string): Promise<boolean> {
        return await this.favoriteRepository.exists(userId, productId);
    }
}