import { ICollectionRepository } from '@modules/user/domain/repositories/ICollectionRepository';
import { ICollectionItemRepository } from '@modules/user/domain/repositories/ICollectionItemRepository';

export class RemoveFromCollectionUseCase {
    constructor(
        private readonly collectionRepository: ICollectionRepository,
        private readonly collectionItemRepository: ICollectionItemRepository
    ) {}

    async execute(userId: string, collectionId: string, productId: string): Promise<void> {
        const collection = await this.collectionRepository.findById(collectionId);
        
        if (!collection) {
            throw new Error('Collection not found');
        }

        if (collection.userId !== userId) {
            throw new Error('Unauthorized');
        }

        await this.collectionItemRepository.delete(collectionId, productId);
    }
}