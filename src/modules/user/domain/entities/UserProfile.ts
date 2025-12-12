export interface UserPreferences {
    notifications: {
        email: boolean;
        push: boolean;
        marketing: boolean;
    };
    privacy: {
        showProfile: boolean;
        showActivity: boolean;
    };
    theme: 'light' | 'dark' | 'auto';
}

export class UserProfile {
    private constructor(
        public readonly id: string,
        public readonly userId: string,
        public preferences: UserPreferences,
        public savedAesthetics: string[],
        public readonly createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) { }

    public static create(id: string, userId: string): UserProfile {
        const defaultPreferences: UserPreferences = {
            notifications: {
                email: true,
                push: true,
                marketing: false,
            },
            privacy: {
                showProfile: true,
                showActivity: false,
            },
            theme: 'auto',
        };

        return new UserProfile(id, userId, defaultPreferences, []);
    }

    public static reconstitute(
        id: string,
        userId: string,
        preferences: UserPreferences,
        savedAesthetics: string[],
        createdAt: Date,
        updatedAt: Date
    ): UserProfile {
        return new UserProfile(
            id,
            userId,
            preferences,
            savedAesthetics,
            createdAt,
            updatedAt
        );
    }

    public updatePreferences(preferences: Partial<UserPreferences>): void {
        this.preferences = {
            ...this.preferences,
            ...preferences,
        };
        this.updatedAt = new Date();
    }

    public saveAesthetic(aestheticId: string): void {
        if (!aestheticId || aestheticId.trim().length === 0) {
            throw new Error('Aesthetic ID cannot be empty');
        }
        if (this.savedAesthetics.includes(aestheticId)) {
            throw new Error('Aesthetic already saved');
        }
        this.savedAesthetics.push(aestheticId);
        this.updatedAt = new Date();
    }

    public removeSavedAesthetic(aestheticId: string): void {
        const index = this.savedAesthetics.indexOf(aestheticId);
        if (index === -1) {
            throw new Error('Aesthetic not found in saved list');
        }
        this.savedAesthetics.splice(index, 1);
        this.updatedAt = new Date();
    }

    public hasAestheticSaved(aestheticId: string): boolean {
        return this.savedAesthetics.includes(aestheticId);
    }
}