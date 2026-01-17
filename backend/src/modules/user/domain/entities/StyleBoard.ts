export interface StyleBoardItem {
    productId: string;
    position?: { x: number; y: number };
    note?: string;
}

export interface StyleBoardProps {
    id: string;
    userId: string;
    name: string;
    description?: string;
    aestheticTags?: string[];
    items?: StyleBoardItem[];
    isPublic?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class StyleBoard {
    private constructor(
        public readonly id: string,
        public readonly userId: string,
        public name: string,
        public description: string,
        public aestheticTags: string[],
        public items: StyleBoardItem[],
        public isPublic: boolean,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) {}

    public static create(
        id: string,
        userId: string,
        name: string,
        description: string = '',
        aestheticTags: string[] = [],
        isPublic: boolean = false
    ): StyleBoard {
        this.validateName(name);
        return new StyleBoard(
            id,
            userId,
            name.trim(),
            description.trim(),
            aestheticTags,
            [],
            isPublic,
            new Date(),
            new Date()
        );
    }

    public static reconstitute(props: StyleBoardProps): StyleBoard {
        return new StyleBoard(
            props.id,
            props.userId,
            props.name,
            props.description || '',
            props.aestheticTags || [],
            props.items || [],
            props.isPublic || false,
            props.createdAt || new Date(),
            props.updatedAt || new Date()
        );
    }

    public updateName(name: string): void {
        StyleBoard.validateName(name);
        this.name = name.trim();
        this.updatedAt = new Date();
    }

    public updateDescription(description: string): void {
        this.description = description.trim();
        this.updatedAt = new Date();
    }

    public addItem(item: StyleBoardItem): void {
        if (this.items.some(i => i.productId === item.productId)) {
            throw new Error('Product already exists in style board');
        }
        this.items.push(item);
        this.updatedAt = new Date();
    }

    public removeItem(productId: string): void {
        const index = this.items.findIndex(i => i.productId === productId);
        if (index === -1) {
            throw new Error('Product not found in style board');
        }
        this.items.splice(index, 1);
        this.updatedAt = new Date();
    }

    public updateItem(productId: string, updates: Partial<StyleBoardItem>): void {
        const item = this.items.find(i => i.productId === productId);
        if (!item) {
            throw new Error('Product not found in style board');
        }
        Object.assign(item, updates);
        this.updatedAt = new Date();
    }

    public addAestheticTag(aestheticId: string): void {
        if (this.aestheticTags.includes(aestheticId)) {
            throw new Error('Aesthetic tag already exists');
        }
        this.aestheticTags.push(aestheticId);
        this.updatedAt = new Date();
    }

    public removeAestheticTag(aestheticId: string): void {
        const index = this.aestheticTags.indexOf(aestheticId);
        if (index === -1) {
            throw new Error('Aesthetic tag not found');
        }
        this.aestheticTags.splice(index, 1);
        this.updatedAt = new Date();
    }

    public toggleVisibility(): void {
        this.isPublic = !this.isPublic;
        this.updatedAt = new Date();
    }

    private static validateName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new Error('Style board name cannot be empty');
        }
        if (name.length > 255) {
            throw new Error('Style board name cannot exceed 255 characters');
        }
    }
}