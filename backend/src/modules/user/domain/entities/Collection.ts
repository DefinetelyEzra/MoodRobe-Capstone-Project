export interface CollectionProps {
    id: string;
    userId: string;
    name: string;
    description?: string;
    isPublic?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Collection {
    private constructor(
        public readonly id: string,
        public readonly userId: string,
        public name: string,
        public description: string,
        public isPublic: boolean,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) {}

    public static create(
        id: string,
        userId: string,
        name: string,
        description: string = '',
        isPublic: boolean = false
    ): Collection {
        this.validateName(name);
        return new Collection(id, userId, name.trim(), description.trim(), isPublic, new Date(), new Date());
    }

    public static reconstitute(props: CollectionProps): Collection {
        return new Collection(
            props.id,
            props.userId,
            props.name,
            props.description || '',
            props.isPublic || false,
            props.createdAt || new Date(),
            props.updatedAt || new Date()
        );
    }

    public updateName(name: string): void {
        Collection.validateName(name);
        this.name = name.trim();
        this.updatedAt = new Date();
    }

    public updateDescription(description: string): void {
        this.description = description.trim();
        this.updatedAt = new Date();
    }

    public toggleVisibility(): void {
        this.isPublic = !this.isPublic;
        this.updatedAt = new Date();
    }

    private static validateName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new Error('Collection name cannot be empty');
        }
        if (name.length > 255) {
            throw new Error('Collection name cannot exceed 255 characters');
        }
    }
}