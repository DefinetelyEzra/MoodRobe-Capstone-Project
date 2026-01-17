export interface StyleBoardItem {
    productId: string;
    position?: { x: number; y: number };
    note?: string;
}

export interface StyleBoard {
    id: string;
    userId: string;
    name: string;
    description: string;
    aestheticTags: string[];
    items: StyleBoardItem[];
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateStyleBoardDto {
    name: string;
    description?: string;
    aestheticTags?: string[];
    isPublic?: boolean;
}

export interface UpdateStyleBoardDto {
    name?: string;
    description?: string;
    aestheticTags?: string[];
    isPublic?: boolean;
}

export interface AddStyleBoardItemDto {
    productId: string;
    position?: { x: number; y: number };
    note?: string;
}

export interface UpdateStyleBoardItemDto {
    position?: { x: number; y: number };
    note?: string;
}