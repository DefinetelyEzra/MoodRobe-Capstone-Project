import { IOutfitRepository } from '../../domain/repositories/IOutfitRepository';
import { OutfitNotFoundException, UnauthorizedOutfitAccessException } from '../../domain/exceptions/OutfitExceptions';

export class DeleteOutfitUseCase {
    constructor(private readonly outfitRepository: IOutfitRepository) { }

    public async execute(outfitId: string, userId: string): Promise<void> {
        const outfit = await this.outfitRepository.findById(outfitId);

        if (!outfit) {
            throw new OutfitNotFoundException(outfitId);
        }

        if (outfit.userId !== userId) {
            throw new UnauthorizedOutfitAccessException();
        }

        await this.outfitRepository.delete(outfitId);
    }
}