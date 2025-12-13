import { IAestheticRepository } from '../../domain/repositories/IAestheticRepository';
import { AestheticNotFoundException } from '../../domain/exceptions/AestheticExceptions';
import { AestheticResponseDto } from '../dto/CreateAestheticDto';
import { Aesthetic } from '@modules/aesthetic/domain/entities/Aeshtetic';

export class GetAestheticByIdUseCase {
    constructor(private readonly aestheticRepository: IAestheticRepository) { }

    public async execute(aestheticId: string): Promise<AestheticResponseDto> {
        const aesthetic = await this.aestheticRepository.findById(aestheticId);
        if (!aesthetic) {
            throw new AestheticNotFoundException(aestheticId);
        }

        return this.toResponseDto(aesthetic);
    }

    private toResponseDto(aesthetic: Aesthetic): AestheticResponseDto {
        return {
            id: aesthetic.id,
            name: aesthetic.name,
            description: aesthetic.description,
            themeProperties: aesthetic.themeProperties.toJSON(),
            imageUrl: aesthetic.imageUrl,
            createdAt: aesthetic.createdAt,
            updatedAt: aesthetic.updatedAt,
        };
    }
}