export interface Favorite {
    id: string;
    userId: string;
    productId: string;
    createdAt: string;
}

export interface AddFavoriteDto {
    productId: string;
}