import { IOutfitRepository } from '../../domain/repositories/IOutfitRepository';
import { OutfitNotFoundException, UnauthorizedOutfitAccessException } from '../../domain/exceptions/OutfitExceptions';
import { UpdateOutfitDto, OutfitResponseDto } from '../dto/OutfitDto';
import { Outfit } from '@modules/outfit/domain/entities/Outfit';

export class UpdateOutfitUseCase {
    constructor(private readonly outfitRepository: IOutfitRepository) { }

    public async execute(
        outfitId: string,
        dto: UpdateOutfitDto,
        userId: string
    ): Promise<OutfitResponseDto> {
        const outfit = await this.outfitRepository.findById(outfitId);

        if (!outfit) {
            throw new OutfitNotFoundException(outfitId);
        }

        if (outfit.userId !== userId) {
            throw new UnauthorizedOutfitAccessException();
        }

        // Update fields
        if (dto.name) {
            outfit.updateName(dto.name);
        }

        if (dto.description !== undefined) {
            outfit.updateDescription(dto.description);
        }

        if (dto.items) {
            outfit.updateItems(dto.items);
        }

        if (dto.aestheticTags !== undefined) {
            outfit.setAestheticTags(dto.aestheticTags);
        }

        if (dto.isPublic !== undefined) {
            if (dto.isPublic) {
                outfit.makePublic();
            } else {
                outfit.makePrivate();
            }
        }

        const updatedOutfit = await this.outfitRepository.update(outfit);

        return this.toResponseDto(updatedOutfit);
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