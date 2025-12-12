import { IUserProfileRepository } from '../../domain/repositories/IUserProfileRepository';

export class SaveAestheticUseCase {
    constructor(private readonly userProfileRepository: IUserProfileRepository) { }

    public async execute(userId: string, aestheticId: string): Promise<void> {
        const profile = await this.userProfileRepository.findByUserId(userId);
        if (!profile) {
            throw new Error('User profile not found');
        }

        profile.saveAesthetic(aestheticId);
        await this.userProfileRepository.update(profile);
    }
}