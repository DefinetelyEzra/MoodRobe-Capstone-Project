export class ProductImage {
    private constructor(
        public readonly id: string,
        public readonly productId: string,
        public url: string,
        public isPrimary: boolean,
        public displayOrder: number,
        public readonly createdAt: Date = new Date()
    ) { }

    public static create(
        id: string,
        productId: string,
        url: string,
        isPrimary: boolean = false,
        displayOrder: number = 0
    ): ProductImage {
        this.validateUrl(url);
        this.validateDisplayOrder(displayOrder);

        return new ProductImage(id, productId, url, isPrimary, displayOrder);
    }

    public static reconstitute(
        id: string,
        productId: string,
        url: string,
        isPrimary: boolean,
        displayOrder: number,
        createdAt: Date
    ): ProductImage {
        return new ProductImage(id, productId, url, isPrimary, displayOrder, createdAt);
    }

    public updateUrl(url: string): void {
        ProductImage.validateUrl(url);
        this.url = url;
    }

    public setAsPrimary(): void {
        this.isPrimary = true;
    }

    public unsetAsPrimary(): void {
        this.isPrimary = false;
    }

    public updateDisplayOrder(order: number): void {
        ProductImage.validateDisplayOrder(order);
        this.displayOrder = order;
    }

    private static validateUrl(url: string): void {
        if (!url || url.trim().length === 0) {
            throw new Error('Image URL cannot be empty');
        }
        if (url.length > 500) {
            throw new Error('Image URL cannot exceed 500 characters');
        }
    }

    private static validateDisplayOrder(order: number): void {
        if (order < 0) {
            throw new Error('Display order cannot be negative');
        }
    }
}