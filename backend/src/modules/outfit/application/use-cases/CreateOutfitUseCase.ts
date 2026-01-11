import { v4 as uuidv4 } from 'uuid';
import { IOutfitRepository } from '../../domain/repositories/IOutfitRepository';
import { Outfit } from '../../domain/entities/Outfit';
import { CreateOutfitDto, OutfitResponseDto } from '../dto/OutfitDto';

export class CreateOutfitUseCase {
    constructor(private readonly outfitRepository: IOutfitRepository) { }

    public async execute(dto: CreateOutfitDto, userId: string): Promise<OutfitResponseDto> {
        const outfitId = uuidv4();

        const outfit = Outfit.create({
            id: outfitId,
            userId,
            name: dto.name,
            description: dto.description,
            outfitType: dto.outfitType,
            items: dto.items,
            aestheticTags: dto.aestheticTags || [],
            isPublic: dto.isPublic || false,
        });

        const savedOutfit = await this.outfitRepository.save(outfit);

        return this.toResponseDto(savedOutfit);
    }

    private toResponseDto(outfit: Outfit): OutfitResponseDto {
        return {
            id: outfit.id,
            userId: outfit.userId,
            name: outfit.name,
            description: outfit.description,
            outfitType: outfit.outfitType,
            items: outfit.getItems(),
            aestheticTags: outfit.aestheticTags,
            isPublic: outfit.isPublic,
            createdAt: outfit.createdAt,
            updatedAt: outfit.updatedAt,
        };
    }
}