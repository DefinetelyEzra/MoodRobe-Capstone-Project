export class Money {
    private readonly amount: number;
    private readonly currency: string;

    constructor(amount: number, currency: string = 'USD') {
        if (amount < 0) {
            throw new Error('Amount cannot be negative');
        }
        if (!currency || currency.trim().length === 0) {
            throw new Error('Currency cannot be empty');
        }
        if (currency.length !== 3) {
            throw new Error('Currency must be a 3-letter code (e.g., USD, EUR)');
        }

        // Round to 2 decimal places
        this.amount = Math.round(amount * 100) / 100;
        this.currency = currency.toUpperCase();
    }

    public getAmount(): number {
        return this.amount;
    }

    public getCurrency(): string {
        return this.currency;
    }

    public add(other: Money): Money {
        this.ensureSameCurrency(other);
        return new Money(this.amount + other.amount, this.currency);
    }

    public subtract(other: Money): Money {
        this.ensureSameCurrency(other);
        return new Money(this.amount - other.amount, this.currency);
    }

    public multiply(factor: number): Money {
        return new Money(this.amount * factor, this.currency);
    }

    public equals(other: Money): boolean {
        return this.amount === other.amount && this.currency === other.currency;
    }

    public isGreaterThan(other: Money): boolean {
        this.ensureSameCurrency(other);
        return this.amount > other.amount;
    }

    public isLessThan(other: Money): boolean {
        this.ensureSameCurrency(other);
        return this.amount < other.amount;
    }

    public toString(): string {
        return `${this.currency} ${this.amount.toFixed(2)}`;
    }

    private ensureSameCurrency(other: Money): void {
        if (this.currency !== other.currency) {
            throw new Error(`Cannot operate on different currencies: ${this.currency} and ${other.currency}`);
        }
    }
}