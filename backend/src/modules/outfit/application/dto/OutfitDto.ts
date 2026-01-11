import { OutfitType, OutfitItems } from '../../domain/entities/Outfit';

export interface CreateOutfitDto {
    name: string;
    description?: string;
    outfitType: OutfitType;
    items: OutfitItems;
    aestheticTags?: string[];
    isPublic?: boolean;
}

export interface UpdateOutfitDto {
    name?: string;
    description?: string;
    outfitType?: OutfitType;
    items?: OutfitItems;
    aestheticTags?: string[];
    isPublic?: boolean;
}

export interface OutfitResponseDto {
    id: string;
    userId: string;
    name: string;
    description: string;
    outfitType: OutfitType;
    items: OutfitItems;
    itemDetails?: OutfitItemDetail[];
    aestheticTags: string[];
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface OutfitItemDetail {
    slot: string;
    productId: string;
    productName: string;
    imageUrl?: string;
    category: string;
    price: {
        amount: number;
        currency: string;
    };
}