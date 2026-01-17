import { ICollectionRepository } from '@modules/user/domain/repositories/ICollectionRepository';
import { ICollectionItemRepository } from '@modules/user/domain/repositories/ICollectionItemRepository';
import { CollectionResponseDto } from '../dto/CollectionDto';

export class GetUserCollectionsUseCase {
    constructor(
        private readonly collectionRepository: ICollectionRepository,
        private readonly collectionItemRepository: ICollectionItemRepository
    ) { }

    async execute(userId: string): Promise<CollectionResponseDto[]> {
        const collections = await this.collectionRepository.findByUserId(userId);

        const collectionsWithCounts = await Promise.all(
            collections.map(async (collection) => {
                const items = await this.collectionItemRepository.findByCollectionId(collection.id);

                return {
                    id: collection.id,
                    userId: collection.userId,
                    name: collection.name,
                    description: collection.description,
                    isPublic: collection.isPublic,
                    itemCount: items.length,
                    createdAt: collection.createdAt,
                    updatedAt: collection.updatedAt
                };
            })
        );

        return collectionsWithCounts;
    }
}