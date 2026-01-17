export interface Collection {
    id: string;
    userId: string;
    name: string;
    description: string;
    isPublic: boolean;
    itemCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CollectionWithItems extends Collection {
    items: CollectionItem[];
}

export interface CollectionItem {
    id: string;
    productId: string;
    addedAt: string;
}

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