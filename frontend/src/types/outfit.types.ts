export type OutfitType = 'full' | 'dress' | 'casual' | 'formal';

export type OutfitSlotType =
    | 'headwear'
    | 'top'
    | 'bottom'
    | 'dress'
    | 'footwear'
    | 'accessories'
    | 'outerwear'
    | 'suit';

export interface OutfitItems {
    headwear?: string;
    top?: string;
    bottom?: string;
    dress?: string;
    footwear?: string;
    accessories?: string;
    outerwear?: string;
    suit?: string;
}

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
    createdAt: string;
    updatedAt: string;
}

export interface OutfitTemplate {
    type: OutfitType;
    label: string;
    description: string;
    slots: OutfitSlotType[];
}

export const OUTFIT_TEMPLATES: OutfitTemplate[] = [
    {
        type: 'full',
        label: 'Full Outfit',
        description: 'Complete look with all pieces',
        slots: ['headwear', 'top', 'bottom', 'footwear', 'accessories']
    },
    {
        type: 'dress',
        label: 'Dress Outfit',
        description: 'Dress-based ensemble',
        slots: ['headwear', 'dress', 'footwear', 'accessories']
    },
    {
        type: 'casual',
        label: 'Casual',
        description: 'Everyday casual wear',
        slots: ['top', 'bottom', 'footwear']
    },
    {
        type: 'formal',
        label: 'Formal',
        description: 'Professional or formal attire',
        slots: ['suit', 'footwear', 'accessories']
    }
];

export const SLOT_LABELS: Record<OutfitSlotType, string> = {
    headwear: 'headwear / Headwear',
    top: 'Top',
    bottom: 'Bottom',
    dress: 'Dress',
    footwear: 'footwear',
    accessories: 'Accessories',
    outerwear: 'Outerwear',
    suit: 'Suit / Formal Wear'
};

export const SLOT_CATEGORIES: Record<OutfitSlotType, string[]> = {
    headwear: ['Headwear', 'Accessories'],
    top: ['Tops'],
    bottom: ['Bottoms'],
    dress: ['Dresses'],
    footwear: ['Footwear'],
    accessories: ['Accessories', 'Jewelry', 'Bags'],
    outerwear: ['Outerwear', 'Jackets'],
    suit: ['Suits', 'Formal']
};