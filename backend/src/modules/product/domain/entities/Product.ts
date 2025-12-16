import { Money } from '@shared/domain/value-objects/Money';
import { ProductVariant } from './ProductVariant';
import { ProductImage } from './ProductImage';

export interface ProductProps {
    id: string;
    merchantId: string;
    name: string;
    description: string;
    category: string;
    basePrice: Money;
    aestheticTags: string[];
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Product {
    private variants: ProductVariant[] = [];
    private images: ProductImage[] = [];

    private constructor(
        public readonly id: string,
        public readonly merchantId: string,
        public name: string,
        public description: string,
        public category: string,
        private basePrice: Money,
        public aestheticTags: string[],
        public isActive: boolean = true,
        public readonly createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) { }

    public static create(props: Omit<ProductProps, 'isActive' | 'createdAt' | 'updatedAt'>): Product {
        this.validateName(props.name);
        this.validateCategory(props.category);

        return new Product(
            props.id,
            props.merchantId,
            props.name.trim(),
            props.description.trim(),
            props.category,
            props.basePrice,
            props.aestheticTags
        );
    }

    public static reconstitute(props: ProductProps): Product {
        const {
            id,
            merchantId,
            name,
            description,
            category,
            basePrice,
            aestheticTags,
            isActive = true,
            createdAt = new Date(),
            updatedAt = new Date()
        } = props;

        return new Product(
            id,
            merchantId,
            name,
            description,
            category,
            basePrice,
            aestheticTags,
            isActive,
            createdAt,
            updatedAt
        );
    }

    public updateName(name: string): void {
        Product.validateName(name);
        this.name = name.trim();
        this.updatedAt = new Date();
    }

    public updateDescription(description: string): void {
        this.description = description.trim();
        this.updatedAt = new Date();
    }

    public updateCategory(category: string): void {
        Product.validateCategory(category);
        this.category = category;
        this.updatedAt = new Date();
    }

    public updateBasePrice(basePrice: Money): void {
        this.basePrice = basePrice;
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

    public setAestheticTags(aestheticIds: string[]): void {
        this.aestheticTags = [...aestheticIds];
        this.updatedAt = new Date();
    }

    public activate(): void {
        if (this.isActive) {
            throw new Error('Product is already active');
        }
        this.isActive = true;
        this.updatedAt = new Date();
    }

    public deactivate(): void {
        if (!this.isActive) {
            throw new Error('Product is already inactive');
        }
        this.isActive = false;
        this.updatedAt = new Date();
    }

    public setVariants(variants: ProductVariant[]): void {
        this.variants = variants;
    }

    public getVariants(): ProductVariant[] {
        return [...this.variants];
    }

    public setImages(images: ProductImage[]): void {
        this.images = images;
    }

    public getImages(): ProductImage[] {
        return [...this.images];
    }

    public getBasePrice(): Money {
        return this.basePrice;
    }

    public hasAestheticTag(aestheticId: string): boolean {
        return this.aestheticTags.includes(aestheticId);
    }

    private static validateName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new Error('Product name cannot be empty');
        }
        if (name.length > 255) {
            throw new Error('Product name cannot exceed 255 characters');
        }
    }

    private static validateCategory(category: string): void {
        if (!category || category.trim().length === 0) {
            throw new Error('Product category cannot be empty');
        }
        if (category.length > 100) {
            throw new Error('Product category cannot exceed 100 characters');
        }
    }
}