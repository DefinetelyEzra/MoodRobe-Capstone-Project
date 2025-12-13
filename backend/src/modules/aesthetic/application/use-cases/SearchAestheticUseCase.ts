import { IAestheticRepository } from '../../domain/repositories/IAestheticRepository';
import { AestheticResponseDto } from '../dto/CreateAestheticDto';
import { Aesthetic } from '@modules/aesthetic/domain/entities/Aeshtetic';

export class SearchAestheticsUseCase {
    constructor(private readonly aestheticRepository: IAestheticRepository) { }

    public async execute(keyword: string): Promise<AestheticResponseDto[]> {
        if (!keyword || keyword.trim().length === 0) {
            return [];
        }

        const aesthetics = await this.aestheticRepository.searchByKeyword(keyword);
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