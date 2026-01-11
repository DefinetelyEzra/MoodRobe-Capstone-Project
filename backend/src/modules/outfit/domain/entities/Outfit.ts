export type OutfitType = 'full' | 'dress' | 'casual' | 'formal';

export type ClothingSlot =
    | 'headwear'
    | 'top'
    | 'bottom'
    | 'dress'
    | 'footwear'
    | 'accessories'
    | 'outerwear';

export interface OutfitItems {
    headwear?: string;
    top?: string;
    bottom?: string;
    dress?: string;
    footwear?: string;
    accessories?: string;
    outerwear?: string;
}

export interface OutfitProps {
    id: string;
    userId: string;
    name: string;
    description?: string;
    outfitType: OutfitType;
    items: OutfitItems;
    aestheticTags: string[];
    isPublic: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Outfit {
    private constructor(
        public readonly id: string,
        public readonly userId: string,
        public name: string,
        public description: string,
        public outfitType: OutfitType,
        private items: OutfitItems,
        public aestheticTags: string[],
        public isPublic: boolean,
        public readonly createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) { }

    public static create(props: Omit<OutfitProps, 'createdAt' | 'updatedAt'>): Outfit {
        this.validateName(props.name);
        this.validateItems(props.items);

        const cleanedItems = this.cleanItems(props.items);

        return new Outfit(
            props.id,
            props.userId,
            props.name.trim(),
            props.description?.trim() || '',
            props.outfitType,
            cleanedItems,
            props.aestheticTags || [],
            props.isPublic
        );
    }

    public static reconstitute(props: OutfitProps): Outfit {
        const cleanedItems = this.cleanItems(props.items);

        return new Outfit(
            props.id,
            props.userId,
            props.name,
            props.description || '',
            props.outfitType,
            cleanedItems,
            props.aestheticTags,
            props.isPublic,
            props.createdAt,
            props.updatedAt
        );
    }

    public updateName(name: string): void {
        Outfit.validateName(name);
        this.name = name.trim();
        this.updatedAt = new Date();
    }

    public updateDescription(description: string): void {
        this.description = description.trim();
        this.updatedAt = new Date();
    }

    public updateItems(items: OutfitItems): void {
        Outfit.validateItems(items);
        this.items = Outfit.cleanItems(items);
        this.updatedAt = new Date();
    }

    public addItem(slot: ClothingSlot, productId: string): void {
        if (typeof productId !== 'string' || productId.trim() === '') {
            throw new Error(`Invalid productId for slot ${slot}: must be a non-empty string`);
        }
        this.items[slot] = productId;
        this.updatedAt = new Date();
    }

    public removeItem(slot: ClothingSlot): void {
        delete this.items[slot];
        this.updatedAt = new Date();
    }

    public setAestheticTags(tags: string[]): void {
        this.aestheticTags = [...tags];
        this.updatedAt = new Date();
    }

    public makePublic(): void {
        this.isPublic = true;
        this.updatedAt = new Date();
    }

    public makePrivate(): void {
        this.isPublic = false;
        this.updatedAt = new Date();
    }

    public getItems(): Record<string, string> {
        const { headwear, top, bottom, dress, footwear, accessories, outerwear } = this.items;
        const items: Record<string, string> = {};
        if (headwear !== undefined) items.headwear = headwear;
        if (top !== undefined) items.top = top;
        if (bottom !== undefined) items.bottom = bottom;
        if (dress !== undefined) items.dress = dress;
        if (footwear !== undefined) items.footwear = footwear;
        if (accessories !== undefined) items.accessories = accessories;
        if (outerwear !== undefined) items.outerwear = outerwear;
        return items;
    }

    public hasItem(slot: ClothingSlot): boolean {
        return this.items[slot] !== undefined;
    }

    public getItemCount(): number {
        return Object.values(this.items).filter(value => value !== undefined).length;
    }

    private static validateName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new Error('Outfit name cannot be empty');
        }
        if (name.length > 255) {
            throw new Error('Outfit name cannot exceed 255 characters');
        }
    }

    private static validateItems(items: OutfitItems): void {
        const validSlots = new Set<ClothingSlot>(['headwear', 'top', 'bottom', 'dress', 'footwear', 'accessories', 'outerwear']);

        const definedEntries = Object.entries(items).filter(
            ([_, value]) => value !== undefined && typeof value === 'string' && value.trim() !== ''
        );

        if (definedEntries.length === 0) {
            throw new Error('Outfit must have at least one valid item');
        }

        for (const [slot] of definedEntries) {
            if (!validSlots.has(slot as ClothingSlot)) {
                throw new Error(`Invalid clothing slot: ${slot}`);
            }
        }
    }

    private static cleanItems(items: OutfitItems): OutfitItems {
        const cleaned: OutfitItems = {};
        const validSlots = new Set<ClothingSlot>(['headwear', 'top', 'bottom', 'dress', 'footwear', 'accessories', 'outerwear']);

        for (const [slot, value] of Object.entries(items)) {
            if (validSlots.has(slot as ClothingSlot) && typeof value === 'string' && value.trim() !== '') {
                cleaned[slot as ClothingSlot] = value;
            }
        }
        return cleaned;
    }
}