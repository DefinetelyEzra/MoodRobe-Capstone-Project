export class CollectionItem {
    private constructor(
        public readonly id: string,
        public readonly collectionId: string,
        public readonly productId: string,
        public readonly addedAt: Date = new Date()
    ) {}

    public static create(id: string, collectionId: string, productId: string): CollectionItem {
        if (!collectionId || !productId) {
            throw new Error('Collection ID and Product ID are required');
        }
        return new CollectionItem(id, collectionId, productId);
    }

    public static reconstitute(
        id: string,
        collectionId: string,
        productId: string,
        addedAt: Date
    ): CollectionItem {
        return new CollectionItem(id, collectionId, productId, addedAt);
    }
}