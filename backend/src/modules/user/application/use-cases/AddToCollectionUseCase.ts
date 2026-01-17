import { v4 as uuidv4 } from 'uuid';
import { ICollectionRepository } from '@modules/user/domain/repositories/ICollectionRepository';
import { ICollectionItemRepository } from '@modules/user/domain/repositories/ICollectionItemRepository';
import { IProductRepository } from '@modules/product/domain/repositories/IProductRepository';
import { CollectionItem } from '@modules/user/domain/entities/CollectionItem';
import { AddToCollectionDto } from '../dto/CollectionDto';

export class AddToCollectionUseCase {
    constructor(
        private readonly collectionRepository: ICollectionRepository,
        private readonly collectionItemRepository: ICollectionItemRepository,
        private readonly productRepository: IProductRepository
    ) { }

    async execute(userId: string, collectionId: string, dto: AddToCollectionDto): Promise<void> {
        const collection = await this.collectionRepository.findById(collectionId);

        if (!collection) {
            throw new Error('Collection not found');
        }

        if (collection.userId !== userId) {
            throw new Error('Unauthorized');
        }

        const product = await this.productRepository.findById(dto.productId);
        if (!product) {
            throw new Error('Product not found');
        }

        const exists = await this.collectionItemRepository.exists(collectionId, dto.productId);
        if (exists) {
            throw new Error('Product already in collection');
        }

        const item = CollectionItem.create(uuidv4(), collectionId, dto.productId);
        await this.collectionItemRepository.save(item);
    }
}