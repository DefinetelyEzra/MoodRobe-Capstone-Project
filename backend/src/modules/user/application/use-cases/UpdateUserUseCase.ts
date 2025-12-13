import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserNotFoundException, UserAlreadyExistsException } from '../../domain/exceptions/UserExceptions';
import { UpdateUserDto, UpdateUserResponseDto } from '../dto/UpdateUserDto';

export class UpdateUserUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    public async execute(
        userId: string,
        dto: UpdateUserDto
    ): Promise<UpdateUserResponseDto> {
        // Find user
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new UserNotFoundException(userId);
        }

        // Update name if provided
        if (dto.name) {
            user.updateName(dto.name);
        }

        // Update email if provided
        if (dto.email && dto.email !== user.getEmail()) {
            // Check if new email is already taken
            const existingUser = await this.userRepository.findByEmail(dto.email);
            if (existingUser && existingUser.id !== userId) {
                throw new UserAlreadyExistsException(dto.email);
            }
            user.updateEmail(dto.email);
        }

        // Save updated user
        const updatedUser = await this.userRepository.update(user);

        return {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.getEmail(),
            selectedAestheticId: updatedUser.selectedAestheticId,
            updatedAt: updatedUser.updatedAt,
        };
    }
}