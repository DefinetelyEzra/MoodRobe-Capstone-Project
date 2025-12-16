export class CartNotFoundException extends Error {
    constructor(identifier: string) {
        super(`Cart not found: ${identifier}`);
        this.name = 'CartNotFoundException';
    }
}

export class CartItemNotFoundException extends Error {
    constructor(identifier: string) {
        super(`Cart item not found: ${identifier}`);
        this.name = 'CartItemNotFoundException';
    }
}

export class ProductNotAvailableException extends Error {
    constructor(productName: string) {
        super(`Product not available: ${productName}`);
        this.name = 'ProductNotAvailableException';
    }
}

export class InsufficientStockException extends Error {
    constructor(productName: string, requested: number, available: number) {
        super(
            `Insufficient stock for ${productName}. Requested: ${requested}, Available: ${available}`
        );
        this.name = 'InsufficientStockException';
    }
}

export class InvalidQuantityException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidQuantityException';
    }
}