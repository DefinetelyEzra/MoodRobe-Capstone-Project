export class Email {
    private readonly value: string;

    constructor(email: string) {
        if (!email || email.trim().length === 0) {
            throw new Error('Email cannot be empty');
        }

        const trimmedEmail = email.trim();

        if (!this.isValid(trimmedEmail)) {
            throw new Error('Invalid email format');
        }

        if (trimmedEmail.length > 255) {
            throw new Error('Email cannot exceed 255 characters');
        }

        this.value = trimmedEmail.toLowerCase();
    }

    private isValid(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    public toString(): string {
        return this.value;
    }

    public equals(other: Email): boolean {
        return this.value === other.value;
    }

    public getDomain(): string {
        return this.value.split('@')[1];
    }
}