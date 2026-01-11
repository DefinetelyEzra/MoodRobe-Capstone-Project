export type OutfitType = 'full' | 'dress' | 'casual' | 'formal';

export type OutfitSlotType = 
    | 'hat' 
    | 'top' 
    | 'bottom' 
    | 'dress' 
    | 'shoes' 
    | 'accessories'
    | 'outerwear'
    | 'suit';

export interface OutfitItems {
    hat?: string;
    top?: string;
    bottom?: string;
    dress?: string;
    shoes?: string;
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
        slots: ['hat', 'top', 'bottom', 'shoes', 'accessories']
    },
    {
        type: 'dress',
        label: 'Dress Outfit',
        description: 'Dress-based ensemble',
        slots: ['hat', 'dress', 'shoes', 'accessories']
    },
    {
        type: 'casual',
        label: 'Casual',
        description: 'Everyday casual wear',
        slots: ['top', 'bottom', 'shoes']
    },
    {
        type: 'formal',
        label: 'Formal',
        description: 'Professional or formal attire',
        slots: ['suit', 'shoes', 'accessories']
    }
];

export const SLOT_LABELS: Record<OutfitSlotType, string> = {
    hat: 'Hat / Headwear',
    top: 'Top',
    bottom: 'Bottom',
    dress: 'Dress',
    shoes: 'Shoes',
    accessories: 'Accessories',
    outerwear: 'Outerwear',
    suit: 'Suit / Formal Wear'
};

export const SLOT_CATEGORIES: Record<OutfitSlotType, string[]> = {
    hat: ['Accessories', 'Headwear'],
    top: ['Tops', 'Outerwear'],
    bottom: ['Bottoms'],
    dress: ['Dresses'],
    shoes: ['Shoes', 'Footwear'],
    accessories: ['Accessories', 'Jewelry', 'Bags'],
    outerwear: ['Outerwear', 'Jackets'],
    suit: ['Formal', 'Suits', 'Dresses']
};