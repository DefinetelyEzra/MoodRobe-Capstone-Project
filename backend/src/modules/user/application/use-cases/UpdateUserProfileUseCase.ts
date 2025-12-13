import { IUserProfileRepository } from '../../domain/repositories/IUserProfileRepository';
import { UpdateUserProfileDto, UserProfileResponseDto } from '../dto/UserProfileDto';

export class UpdateUserProfileUseCase {
    constructor(private readonly userProfileRepository: IUserProfileRepository) { }

    public async execute(
        userId: string,
        dto: UpdateUserProfileDto
    ): Promise<UserProfileResponseDto> {
        let profile = await this.userProfileRepository.findByUserId(userId);

        if (!profile) {
            throw new Error('User profile not found');
        }

        if (dto.preferences) {
            profile.updatePreferences(dto.preferences);
        }

        const updatedProfile = await this.userProfileRepository.update(profile);

        return {
            id: updatedProfile.id,
            userId: updatedProfile.userId,
            preferences: updatedProfile.preferences,
            savedAesthetics: updatedProfile.savedAesthetics,
            updatedAt: updatedProfile.updatedAt,
        };
    }
}