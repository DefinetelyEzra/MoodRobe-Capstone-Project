export interface AddFavoriteDto {
    productId: string;
}

export interface FavoriteResponseDto {
    id: string;
    userId: string;
    productId: string;
    createdAt: Date;
}