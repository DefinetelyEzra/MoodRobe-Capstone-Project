import { StyleBoardItem } from '@modules/user/domain/entities/StyleBoard';

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

export interface StyleBoardResponseDto {
    id: string;
    userId: string;
    name: string;
    description: string;
    aestheticTags: string[];
    items: StyleBoardItem[];
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}