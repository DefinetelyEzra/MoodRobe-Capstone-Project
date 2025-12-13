import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserNotFoundException } from '../../domain/exceptions/UserExceptions';

export class SelectAestheticUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    public async execute(userId: string, aestheticId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new UserNotFoundException(userId);
        }

        user.selectAesthetic(aestheticId);
        await this.userRepository.update(user);
    }
}