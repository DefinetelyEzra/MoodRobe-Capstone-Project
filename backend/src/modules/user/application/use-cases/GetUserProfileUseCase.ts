import { IUserProfileRepository } from '../../domain/repositories/IUserProfileRepository';
import { UserProfileResponseDto } from '../dto/UserProfileDto';

export class GetUserProfileUseCase {
    constructor(private readonly userProfileRepository: IUserProfileRepository) { }

    public async execute(userId: string): Promise<UserProfileResponseDto | null> {
        const profile = await this.userProfileRepository.findByUserId(userId);
        if (!profile) {
            return null;
        }

        return {
            id: profile.id,
            userId: profile.userId,
            preferences: profile.preferences,
            savedAesthetics: profile.savedAesthetics,
            updatedAt: profile.updatedAt,
        };
    }
}