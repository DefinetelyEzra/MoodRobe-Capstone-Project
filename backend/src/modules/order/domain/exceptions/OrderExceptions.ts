export class OrderNotFoundException extends Error {
    constructor(identifier: string) {
        super(`Order not found: ${identifier}`);
        this.name = 'OrderNotFoundException';
    }
}

export class OrderAlreadyExistsException extends Error {
    constructor(orderNumber: string) {
        super(`Order with number ${orderNumber} already exists`);
        this.name = 'OrderAlreadyExistsException';
    }
}

export class InvalidOrderStateException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidOrderStateException';
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

export class EmptyCartException extends Error {
    constructor() {
        super('Cannot create order from empty cart');
        this.name = 'EmptyCartException';
    }
}