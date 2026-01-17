import { ICollectionRepository } from '@modules/user/domain/repositories/ICollectionRepository';
import { UpdateCollectionDto, CollectionResponseDto } from '../dto/CollectionDto';

export class UpdateCollectionUseCase {
    constructor(private readonly collectionRepository: ICollectionRepository) { }

    async execute(userId: string, collectionId: string, dto: UpdateCollectionDto): Promise<CollectionResponseDto> {
        const collection = await this.collectionRepository.findById(collectionId);

        if (!collection) {
            throw new Error('Collection not found');
        }

        if (collection.userId !== userId) {
            throw new Error('Unauthorized');
        }

        if (dto.name !== undefined) {
            collection.updateName(dto.name);
        }
        if (dto.description !== undefined) {
            collection.updateDescription(dto.description);
        }
        if (dto.isPublic !== undefined && dto.isPublic !== collection.isPublic) {
            collection.toggleVisibility();
        }

        await this.collectionRepository.save(collection);

        return {
            id: collection.id,
            userId: collection.userId,
            name: collection.name,
            description: collection.description,
            isPublic: collection.isPublic,
            itemCount: 0, // Would need to fetch separately
            createdAt: collection.createdAt,
            updatedAt: collection.updatedAt
        };
    }
}