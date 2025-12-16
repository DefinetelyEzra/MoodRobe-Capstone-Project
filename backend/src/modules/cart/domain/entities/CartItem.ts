import { Money } from "@shared/domain/value-objects/Money";

export class CartItem {
    private constructor(
        public readonly id: string,
        public readonly cartId: string,
        public readonly productVariantId: string,
        public readonly productName: string,
        public quantity: number,
        private unitPrice: Money,
        public readonly addedAt: Date = new Date()
    ) { }

    public static create(
        id: string,
        cartId: string,
        productVariantId: string,
        productName: string,
        quantity: number,
        unitPrice: Money
    ): CartItem {
        CartItem.validateQuantity(quantity);
        return new CartItem(id, cartId, productVariantId, productName, quantity, unitPrice);
    }

    public static reconstitute(
        id: string,
        cartId: string,
        productVariantId: string,
        productName: string,
        quantity: number,
        unitPrice: Money,
        addedAt: Date
    ): CartItem {
        return new CartItem(
            id,
            cartId,
            productVariantId,
            productName,
            quantity,
            unitPrice,
            addedAt
        );
    }

    public updateQuantity(quantity: number): void {
        CartItem.validateQuantity(quantity);
        this.quantity = quantity;
    }

    public increaseQuantity(amount: number = 1): void {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }
        this.quantity += amount;
    }

    public decreaseQuantity(amount: number = 1): void {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }
        if (this.quantity - amount < 1) {
            throw new Error('Quantity cannot be less than 1');
        }
        this.quantity -= amount;
    }

    public getUnitPrice(): Money {
        return this.unitPrice;
    }

    public getLineTotal(): Money {
        return this.unitPrice.multiply(this.quantity);
    }

    public updatePrice(unitPrice: Money): void {
        this.unitPrice = unitPrice;
    }

    private static validateQuantity(quantity: number): void {
        if (quantity <= 0) {
            throw new Error('Quantity must be positive');
        }
        if (!Number.isInteger(quantity)) {
            throw new TypeError('Quantity must be an integer');
        }
        if (quantity > 999) {
            throw new Error('Quantity cannot exceed 999');
        }
    }
}