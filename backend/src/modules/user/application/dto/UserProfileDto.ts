import { UserPreferences } from '../../domain/entities/UserProfile';

export interface UpdateUserProfileDto {
    preferences?: Partial<UserPreferences>;
}

export interface UserProfileResponseDto {
    id: string;
    userId: string;
    preferences: UserPreferences;
    savedAesthetics: string[];
    updatedAt: Date;
}