import { v4 as uuidv4 } from 'uuid';
import { User } from '../../domain/entities/User';
import { UserProfile } from '../../domain/entities/UserProfile';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IUserProfileRepository } from '../../domain/repositories/IUserProfileRepository';
import { UserAlreadyExistsException } from '../../domain/exceptions/UserExceptions';
import { RegisterUserDto, RegisterUserResponseDto } from '../dto/RegisterUserDto';
import * as bcrypt from 'bcryptjs';

export class RegisterUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly userProfileRepository: IUserProfileRepository
    ) { }

    public async execute(dto: RegisterUserDto): Promise<RegisterUserResponseDto> {
        // Validate input
        this.validateInput(dto);

        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new UserAlreadyExistsException(dto.email);
        }

        // Hash password
        const passwordHash = await bcrypt.hash(dto.password, 10);

        // Create user entity
        const userId = uuidv4();
        const user = User.create(userId, dto.name, dto.email, passwordHash);

        // Save user
        const savedUser = await this.userRepository.save(user);

        // Create user profile
        const profileId = uuidv4();
        const profile = UserProfile.create(profileId, userId);
        await this.userProfileRepository.save(profile);

        return {
            id: savedUser.id,
            name: savedUser.name,
            email: savedUser.getEmail(),
            createdAt: savedUser.createdAt,
        };
    }

    private validateInput(dto: RegisterUserDto): void {
        if (!dto.name || dto.name.trim().length === 0) {
            throw new Error('Name is required');
        }
        if (!dto.email || dto.email.trim().length === 0) {
            throw new Error('Email is required');
        }
        if (!dto.password || dto.password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
    }
}