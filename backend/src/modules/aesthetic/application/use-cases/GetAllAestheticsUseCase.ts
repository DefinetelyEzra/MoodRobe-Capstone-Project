import { IAestheticRepository } from '../../domain/repositories/IAestheticRepository';
import { AestheticResponseDto } from '../dto/CreateAestheticDto';
import { Aesthetic } from '@modules/aesthetic/domain/entities/Aeshtetic';

export class GetAllAestheticsUseCase {
    constructor(private readonly aestheticRepository: IAestheticRepository) { }

    public async execute(): Promise<AestheticResponseDto[]> {
        const aesthetics = await this.aestheticRepository.findAll();
        return aesthetics.map(this.toResponseDto);
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