import { Money } from "@shared/domain/value-objects/Money";

export interface ProductVariantProps {
    id: string;
    productId: string;
    sku: string;
    size: string | null;
    color: string | null;
    price: Money;
    stockQuantity: number;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class ProductVariant {
    private constructor(
        public readonly id: string,
        public readonly productId: string,
        public readonly sku: string,
        public size: string | null,
        public color: string | null,
        private price: Money,
        public stockQuantity: number,
        public isActive: boolean = true,
        public readonly createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) { }

    public static create(props: Omit<ProductVariantProps, 'isActive' | 'createdAt' | 'updatedAt'>): ProductVariant {
        this.validateSku(props.sku);
        this.validateStockQuantity(props.stockQuantity);

        return new ProductVariant(
            props.id,
            props.productId,
            props.sku,
            props.size,
            props.color,
            props.price,
            props.stockQuantity
        );
    }

    public static reconstitute(props: ProductVariantProps): ProductVariant {
        const {
            id,
            productId,
            sku,
            size,
            color,
            price,
            stockQuantity,
            isActive = true,
            createdAt = new Date(),
            updatedAt = new Date()
        } = props;

        return new ProductVariant(
            id,
            productId,
            sku,
            size,
            color,
            price,
            stockQuantity,
            isActive,
            createdAt,
            updatedAt
        );
    }

    public updatePrice(price: Money): void {
        this.price = price;
        this.updatedAt = new Date();
    }

    public updateStock(quantity: number): void {
        ProductVariant.validateStockQuantity(quantity);
        this.stockQuantity = quantity;
        this.updatedAt = new Date();
    }

    public increaseStock(quantity: number): void {
        if (quantity <= 0) {
            throw new Error('Quantity must be positive');
        }
        this.stockQuantity += quantity;
        this.updatedAt = new Date();
    }

    public decreaseStock(quantity: number): void {
        if (quantity <= 0) {
            throw new Error('Quantity must be positive');
        }
        if (this.stockQuantity < quantity) {
            throw new Error('Insufficient stock');
        }
        this.stockQuantity -= quantity;
        this.updatedAt = new Date();
    }

    public isInStock(): boolean {
        return this.stockQuantity > 0;
    }

    public activate(): void {
        if (this.isActive) {
            throw new Error('Variant is already active');
        }
        this.isActive = true;
        this.updatedAt = new Date();
    }

    public deactivate(): void {
        if (!this.isActive) {
            throw new Error('Variant is already inactive');
        }
        this.isActive = false;
        this.updatedAt = new Date();
    }

    public getPrice(): Money {
        return this.price;
    }

    private static validateSku(sku: string): void {
        if (!sku || sku.trim().length === 0) {
            throw new Error('SKU cannot be empty');
        }
        if (sku.length > 100) {
            throw new Error('SKU cannot exceed 100 characters');
        }
    }

    private static validateStockQuantity(quantity: number): void {
        if (quantity < 0) {
            throw new Error('Stock quantity cannot be negative');
        }
    }
}