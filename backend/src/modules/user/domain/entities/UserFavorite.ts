export class UserFavorite {
    private constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly productId: string,
        public readonly createdAt: Date = new Date()
    ) {}

    public static create(id: string, userId: string, productId: string): UserFavorite {
        if (!userId || !productId) {
            throw new Error('User ID and Product ID are required');
        }
        return new UserFavorite(id, userId, productId);
    }

    public static reconstitute(
        id: string,
        userId: string,
        productId: string,
        createdAt: Date
    ): UserFavorite {
        return new UserFavorite(id, userId, productId, createdAt);
    }
}