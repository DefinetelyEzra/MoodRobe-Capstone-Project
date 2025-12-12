import { Email } from '../value-objects/Email';
import * as bcrypt from 'bcryptjs';

export class User {
    private constructor(
        public readonly id: string,
        public name: string,
        private email: Email,
        private passwordHash: string,
        public selectedAestheticId?: string,
        public readonly createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) { }

    public static create(
        id: string,
        name: string,
        email: string,
        passwordHash: string,
        selectedAestheticId?: string
    ): User {
        const emailVO = new Email(email);
        return new User(id, name, emailVO, passwordHash, selectedAestheticId);
    }

    public static reconstitute(
        id: string,
        name: string,
        email: string,
        passwordHash: string,
        selectedAestheticId: string | undefined,
        createdAt: Date,
        updatedAt: Date
    ): User {
        const emailVO = new Email(email);
        return new User(
            id,
            name,
            emailVO,
            passwordHash,
            selectedAestheticId,
            createdAt,
            updatedAt
        );
    }

    public updateName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new Error('Name cannot be empty');
        }
        if (name.length > 255) {
            throw new Error('Name cannot exceed 255 characters');
        }
        this.name = name.trim();
        this.updatedAt = new Date();
    }

    public updateEmail(email: string): void {
        this.email = new Email(email);
        this.updatedAt = new Date();
    }

    public selectAesthetic(aestheticId: string): void {
        if (!aestheticId || aestheticId.trim().length === 0) {
            throw new Error('Aesthetic ID cannot be empty');
        }
        this.selectedAestheticId = aestheticId;
        this.updatedAt = new Date();
    }

    public clearSelectedAesthetic(): void {
        this.selectedAestheticId = undefined;
        this.updatedAt = new Date();
    }

    public async verifyPassword(plainPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, this.passwordHash);
    }

    public async updatePassword(newPassword: string): Promise<void> {
        if (!newPassword || newPassword.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        if (newPassword.length > 72) {
            throw new Error('Password cannot exceed 72 characters');
        }
        this.passwordHash = await bcrypt.hash(newPassword, 10);
        this.updatedAt = new Date();
    }

    public getEmail(): string {
        return this.email.toString();
    }

    public getPasswordHash(): string {
        return this.passwordHash;
    }
}