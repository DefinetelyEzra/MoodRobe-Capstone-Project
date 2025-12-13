export class AestheticScore {
    private readonly value: number;

    constructor(score: number) {
        if (score < 0 || score > 100) {
            throw new Error('Aesthetic score must be between 0 and 100');
        }
        this.value = score;
    }

    public getValue(): number {
        return this.value;
    }

    public isHighMatch(): boolean {
        return this.value >= 70;
    }

    public isMediumMatch(): boolean {
        return this.value >= 40 && this.value < 70;
    }

    public isLowMatch(): boolean {
        return this.value < 40;
    }

    public getMatchLevel(): 'high' | 'medium' | 'low' {
        if (this.isHighMatch()) return 'high';
        if (this.isMediumMatch()) return 'medium';
        return 'low';
    }

    public equals(other: AestheticScore): boolean {
        return this.value === other.value;
    }

    public isGreaterThan(other: AestheticScore): boolean {
        return this.value > other.value;
    }
}