import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserNotFoundException } from '../../domain/exceptions/UserExceptions';
import { UpdateUserResponseDto } from '../dto/UpdateUserDto';

export class GetUserByIdUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    public async execute(userId: string): Promise<UpdateUserResponseDto> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new UserNotFoundException(userId);
        }

        return {
            id: user.id,
            name: user.name,
            email: user.getEmail(),
            selectedAestheticId: user.selectedAestheticId,
            updatedAt: user.updatedAt,
        };
    }
}