export class OrderNumber {
    private readonly value: string;

    constructor(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('Order number cannot be empty');
        }
        if (value.length > 50) {
            throw new Error('Order number cannot exceed 50 characters');
        }
        this.value = value.toUpperCase();
    }

    public toString(): string {
        return this.value;
    }

    public equals(other: OrderNumber): boolean {
        return this.value === other.value;
    }

    public static generate(): OrderNumber {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return new OrderNumber(`ORD-${timestamp}-${random}`);
    }
}