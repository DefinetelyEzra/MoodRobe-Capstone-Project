import { v4 as uuidv4 } from 'uuid';
import { Aesthetic } from '@modules/aesthetic/domain/entities/Aeshtetic';
import { ThemeProperties } from '../../domain/value-objects/ThemeProperties';
import { IAestheticRepository } from '../../domain/repositories/IAestheticRepository';
import { AestheticAlreadyExistsException } from '../../domain/exceptions/AestheticExceptions';
import { CreateAestheticDto, AestheticResponseDto } from '../dto/CreateAestheticDto';

export class CreateAestheticUseCase {
    constructor(private readonly aestheticRepository: IAestheticRepository) { }

    public async execute(dto: CreateAestheticDto): Promise<AestheticResponseDto> {
        // Check if aesthetic with same name exists
        const existingAesthetic = await this.aestheticRepository.findByName(dto.name);
        if (existingAesthetic) {
            throw new AestheticAlreadyExistsException(dto.name);
        }

        // Create theme properties value object
        const themeProperties = new ThemeProperties(dto.themeProperties);

        // Create aesthetic entity
        const aestheticId = uuidv4();
        const aesthetic = Aesthetic.create(
            aestheticId,
            dto.name,
            dto.description,
            themeProperties,
            dto.imageUrl
        );

        // Save aesthetic
        const savedAesthetic = await this.aestheticRepository.save(aesthetic);

        return this.toResponseDto(savedAesthetic);
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