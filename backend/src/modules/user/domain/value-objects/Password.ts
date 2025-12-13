import * as bcrypt from 'bcryptjs';

export class Password {
    private readonly hashedValue: string;

    private constructor(hashedValue: string) {
        this.hashedValue = hashedValue;
    }

    public static async create(plainPassword: string): Promise<Password> {
        if (!plainPassword || plainPassword.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

        if (plainPassword.length > 72) {
            throw new Error('Password cannot exceed 72 characters');
        }

        // Password strength validation
        if (!this.isStrongEnough(plainPassword)) {
            throw new Error(
                'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            );
        }

        const hashedValue = await bcrypt.hash(plainPassword, 10);
        return new Password(hashedValue);
    }

    public static fromHash(hashedValue: string): Password {
        if (!hashedValue || hashedValue.trim().length === 0) {
            throw new Error('Hashed password cannot be empty');
        }
        return new Password(hashedValue);
    }

    private static isStrongEnough(password: string): boolean {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        return hasUpperCase && hasLowerCase && hasNumber;
    }

    public async compare(plainPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, this.hashedValue);
    }

    public getHash(): string {
        return this.hashedValue;
    }
}