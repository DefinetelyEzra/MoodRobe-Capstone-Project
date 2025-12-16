export class TransactionId {
    private readonly value: string;

    constructor(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('Transaction ID cannot be empty');
        }
        this.value = value.trim();
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: TransactionId): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return this.value;
    }
}