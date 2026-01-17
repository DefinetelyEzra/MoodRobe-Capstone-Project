export interface CreateCollectionDto {
    name: string;
    description?: string;
    isPublic?: boolean;
}

export interface UpdateCollectionDto {
    name?: string;
    description?: string;
    isPublic?: boolean;
}

export interface AddToCollectionDto {
    productId: string;
}

export interface CollectionResponseDto {
    id: string;
    userId: string;
    name: string;
    description: string;
    isPublic: boolean;
    itemCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CollectionWithItemsDto extends CollectionResponseDto {
    items: {
        id: string;
        productId: string;
        addedAt: Date;
    }[];
}