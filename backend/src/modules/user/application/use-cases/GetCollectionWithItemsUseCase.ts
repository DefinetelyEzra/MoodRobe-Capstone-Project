import { ICollectionRepository } from '@modules/user/domain/repositories/ICollectionRepository';
import { ICollectionItemRepository } from '@modules/user/domain/repositories/ICollectionItemRepository';
import { CollectionWithItemsDto } from '../dto/CollectionDto';

export class GetCollectionWithItemsUseCase {
    constructor(
        private readonly collectionRepository: ICollectionRepository,
        private readonly collectionItemRepository: ICollectionItemRepository
    ) { }

    async execute(userId: string, collectionId: string): Promise<CollectionWithItemsDto> {
        const collection = await this.collectionRepository.findById(collectionId);

        if (!collection) {
            throw new Error('Collection not found');
        }

        if (collection.userId !== userId) {
            throw new Error('Unauthorized access to collection');
        }

        const items = await this.collectionItemRepository.findByCollectionId(collectionId);

        return {
            id: collection.id,
            userId: collection.userId,
            name: collection.name,
            description: collection.description,
            isPublic: collection.isPublic,
            itemCount: items.length,
            createdAt: collection.createdAt,
            updatedAt: collection.updatedAt,
            items: items.map(item => ({
                id: item.id,
                productId: item.productId,
                addedAt: item.addedAt
            }))
        };
    }
}