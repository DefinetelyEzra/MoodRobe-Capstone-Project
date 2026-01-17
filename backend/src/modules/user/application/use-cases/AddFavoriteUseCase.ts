import { v4 as uuidv4 } from 'uuid';
import { IUserFavoriteRepository } from '@modules/user/domain/repositories/IUserFavoriteRepository';
import { IProductRepository } from '@modules/product/domain/repositories/IProductRepository';
import { UserFavorite } from '@modules/user/domain/entities/UserFavorite';
import { AddFavoriteDto, FavoriteResponseDto } from '../dto/FavoriteDto';

export class AddFavoriteUseCase {
    constructor(
        private readonly favoriteRepository: IUserFavoriteRepository,
        private readonly productRepository: IProductRepository
    ) {}

    async execute(userId: string, dto: AddFavoriteDto): Promise<FavoriteResponseDto> {
        // Verify product exists
        const product = await this.productRepository.findById(dto.productId);
        if (!product) {
            throw new Error('Product not found');
        }

        // Check if already favorited
        const exists = await this.favoriteRepository.exists(userId, dto.productId);
        if (exists) {
            throw new Error('Product already in favorites');
        }

        const favorite = UserFavorite.create(uuidv4(), userId, dto.productId);
        await this.favoriteRepository.save(favorite);

        return {
            id: favorite.id,
            userId: favorite.userId,
            productId: favorite.productId,
            createdAt: favorite.createdAt
        };
    }
}