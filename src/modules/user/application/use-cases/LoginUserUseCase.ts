import * as jwt from 'jsonwebtoken';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { InvalidCredentialsException } from '../../domain/exceptions/UserExceptions';
import { LoginUserDto, LoginUserResponseDto } from '../dto/LoginUserDto';

export class LoginUserUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    public async execute(dto: LoginUserDto): Promise<LoginUserResponseDto> {
        // Find user by email
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new InvalidCredentialsException();
        }

        // Verify password
        const isPasswordValid = await user.verifyPassword(dto.password);
        if (!isPasswordValid) {
            throw new InvalidCredentialsException();
        }

        // Generate JWT token
        const token = this.generateToken(user.id);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.getEmail(),
                selectedAestheticId: user.selectedAestheticId,
            },
            token,
        };
    }

    private generateToken(userId: string): string {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not configured');
        }

        return jwt.sign(
            { userId },
            secret,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
        );
    }
}