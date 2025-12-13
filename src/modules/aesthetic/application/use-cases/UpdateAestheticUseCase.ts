import { IAestheticRepository } from '../../domain/repositories/IAestheticRepository';
import { AestheticNotFoundException, AestheticAlreadyExistsException } from '../../domain/exceptions/AestheticExceptions';
import { UpdateAestheticDto } from '../dto/UpdateAestheticDto';
import { AestheticResponseDto } from '../dto/CreateAestheticDto';
import { ThemeProperties } from '../../domain/value-objects/ThemeProperties';
import { Aesthetic } from '@modules/aesthetic/domain/entities/Aeshtetic';

export class UpdateAestheticUseCase {
    constructor(private readonly aestheticRepository: IAestheticRepository) { }

    public async execute(
        aestheticId: string,
        dto: UpdateAestheticDto
    ): Promise<AestheticResponseDto> {
        // Find aesthetic
        const aesthetic = await this.aestheticRepository.findById(aestheticId);
        if (!aesthetic) {
            throw new AestheticNotFoundException(aestheticId);
        }

        // Update name if provided
        if (dto.name && dto.name !== aesthetic.name) {
            const existingAesthetic = await this.aestheticRepository.findByName(dto.name);
            if (existingAesthetic && existingAesthetic.id !== aestheticId) {
                throw new AestheticAlreadyExistsException(dto.name);
            }
            aesthetic.updateName(dto.name);
        }

        // Update description if provided
        if (dto.description) {
            aesthetic.updateDescription(dto.description);
        }

        // Update theme properties if provided
        if (dto.themeProperties) {
            const themeProperties = new ThemeProperties(dto.themeProperties);
            aesthetic.updateThemeProperties(themeProperties);
        }

        // Update image URL if provided
        if (dto.imageUrl !== undefined) {
            aesthetic.updateImageUrl(dto.imageUrl);
        }

        // Save updated aesthetic
        const updatedAesthetic = await this.aestheticRepository.update(aesthetic);

        return this.toResponseDto(updatedAesthetic);
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