import { v4 as uuidv4 } from 'uuid';
import { ICollectionRepository } from '@modules/user/domain/repositories/ICollectionRepository';
import { Collection } from '@modules/user/domain/entities/Collection';
import { CreateCollectionDto, CollectionResponseDto } from '../dto/CollectionDto';

export class CreateCollectionUseCase {
    constructor(private readonly collectionRepository: ICollectionRepository) { }

    async execute(userId: string, dto: CreateCollectionDto): Promise<CollectionResponseDto> {
        const collection = Collection.create(
            uuidv4(),
            userId,
            dto.name,
            dto.description,
            dto.isPublic
        );

        await this.collectionRepository.save(collection);

        return {
            id: collection.id,
            userId: collection.userId,
            name: collection.name,
            description: collection.description,
            isPublic: collection.isPublic,
            itemCount: 0,
            createdAt: collection.createdAt,
            updatedAt: collection.updatedAt
        };
    }
}