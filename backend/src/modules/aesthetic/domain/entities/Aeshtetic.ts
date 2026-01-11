import { ThemeProperties } from "../value-objects/ThemeProperties";

export class Aesthetic {
    private constructor(
        public readonly id: string,
        public name: string,
        public description: string,
        public themeProperties: ThemeProperties,
        public imageUrl?: string,
        public readonly createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) { }

    public static create(
        id: string,
        name: string,
        description: string,
        themeProperties: ThemeProperties,
        imageUrl?: string
    ): Aesthetic {
        this.validateName(name);
        this.validateDescription(description);

        return new Aesthetic(id, name, description, themeProperties, imageUrl);
    }

    public static reconstitute(
        id: string,
        name: string,
        description: string,
        themeProperties: ThemeProperties,
        imageUrl: string | undefined,
        createdAt: Date,
        updatedAt: Date
    ): Aesthetic {
        return new Aesthetic(
            id,
            name,
            description,
            themeProperties,
            imageUrl,
            createdAt,
            updatedAt
        );
    }

    public updateName(name: string): void {
        Aesthetic.validateName(name);
        this.name = name.trim();
        this.updatedAt = new Date();
    }

    public updateDescription(description: string): void {
        Aesthetic.validateDescription(description);
        this.description = description.trim();
        this.updatedAt = new Date();
    }

    public updateThemeProperties(themeProperties: ThemeProperties): void {
        this.themeProperties = themeProperties;
        this.updatedAt = new Date();
    }

    public updateImageUrl(imageUrl: string): void {
        if (imageUrl && imageUrl.length > 500) {
            throw new Error('Image URL cannot exceed 500 characters');
        }
        this.imageUrl = imageUrl;
        this.updatedAt = new Date();
    }

    public getImageUrl(): string | undefined {
        return this.imageUrl;
    }

    private static validateName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new Error('Aesthetic name cannot be empty');
        }
        if (name.length > 100) {
            throw new Error('Aesthetic name cannot exceed 100 characters');
        }
    }

    private static validateDescription(description: string): void {
        if (!description || description.trim().length === 0) {
            throw new Error('Aesthetic description cannot be empty');
        }
        if (description.length > 1000) {
            throw new Error('Aesthetic description cannot exceed 1000 characters');
        }
    }
}