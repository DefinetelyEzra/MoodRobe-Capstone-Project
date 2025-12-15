export class ProductNotFoundException extends Error {
    constructor(identifier: string) {
        super(`Product not found: ${identifier}`);
        this.name = 'ProductNotFoundException';
    }
}

export class ProductVariantNotFoundException extends Error {
    constructor(identifier: string) {
        super(`Product variant not found: ${identifier}`);
        this.name = 'ProductVariantNotFoundException';
    }
}

export class ProductImageNotFoundException extends Error {
    constructor(identifier: string) {
        super(`Product image not found: ${identifier}`);
        this.name = 'ProductImageNotFoundException';
    }
}

export class DuplicateSkuException extends Error {
    constructor(sku: string) {
        super(`SKU already exists: ${sku}`);
        this.name = 'DuplicateSkuException';
    }
}

export class UnauthorizedProductAccessException extends Error {
    constructor(message: string = 'Unauthorized access to product') {
        super(message);
        this.name = 'UnauthorizedProductAccessException';
    }
}

export class InsufficientStockException extends Error {
    constructor(productName: string, requested: number, available: number) {
        super(`Insufficient stock for ${productName}. Requested: ${requested}, Available: ${available}`);
        this.name = 'InsufficientStockException';
    }
}