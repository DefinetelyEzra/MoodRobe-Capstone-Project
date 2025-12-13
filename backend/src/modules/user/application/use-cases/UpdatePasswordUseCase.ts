import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserNotFoundException, InvalidCredentialsException } from '../../domain/exceptions/UserExceptions';

export interface UpdatePasswordDto {
    currentPassword: string;
    newPassword: string;
}

export class UpdatePasswordUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    public async execute(userId: string, dto: UpdatePasswordDto): Promise<void> {
        // Find user
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new UserNotFoundException(userId);
        }

        // Verify current password
        const isPasswordValid = await user.verifyPassword(dto.currentPassword);
        if (!isPasswordValid) {
            throw new InvalidCredentialsException();
        }

        // Update password
        await user.updatePassword(dto.newPassword);

        // Save user
        await this.userRepository.update(user);
    }
}