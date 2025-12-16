import { CartItem } from './CartItem';

export class Cart {
    private items: CartItem[] = [];

    private constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) { }

    public static create(id: string, userId: string): Cart {
        return new Cart(id, userId);
    }

    public static reconstitute(
        id: string,
        userId: string,
        createdAt: Date,
        updatedAt: Date
    ): Cart {
        return new Cart(id, userId, createdAt, updatedAt);
    }

    public addItem(item: CartItem): void {
        const existingItem = this.items.find(
            (i) => i.productVariantId === item.productVariantId
        );

        if (existingItem) {
            existingItem.increaseQuantity(item.quantity);
        } else {
            this.items.push(item);
        }

        this.updatedAt = new Date();
    }

    public removeItem(productVariantId: string): void {
        const index = this.items.findIndex(
            (item) => item.productVariantId === productVariantId
        );

        if (index === -1) {
            throw new Error('Item not found in cart');
        }

        this.items.splice(index, 1);
        this.updatedAt = new Date();
    }

    public updateItemQuantity(productVariantId: string, quantity: number): void {
        const item = this.items.find((i) => i.productVariantId === productVariantId);

        if (!item) {
            throw new Error('Item not found in cart');
        }

        item.updateQuantity(quantity);
        this.updatedAt = new Date();
    }

    public clearItems(): void {
        this.items = [];
        this.updatedAt = new Date();
    }

    public getItems(): CartItem[] {
        return [...this.items];
    }

    public setItems(items: CartItem[]): void {
        this.items = items;
    }

    public getItemCount(): number {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    public isEmpty(): boolean {
        return this.items.length === 0;
    }

    public hasItem(productVariantId: string): boolean {
        return this.items.some((item) => item.productVariantId === productVariantId);
    }

    public calculateSubtotal(): number {
        return this.items.reduce((sum, item) => {
            return sum + item.getUnitPrice().getAmount() * item.quantity;
        }, 0);
    }
}