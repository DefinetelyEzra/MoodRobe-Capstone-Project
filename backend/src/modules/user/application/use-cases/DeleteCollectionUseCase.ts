import { ICollectionRepository } from '@modules/user/domain/repositories/ICollectionRepository';

export class DeleteCollectionUseCase {
    constructor(private readonly collectionRepository: ICollectionRepository) { }

    async execute(userId: string, collectionId: string): Promise<void> {
        const collection = await this.collectionRepository.findById(collectionId);

        if (!collection) {
            throw new Error('Collection not found');
        }

        if (collection.userId !== userId) {
            throw new Error('Unauthorized');
        }

        await this.collectionRepository.delete(collectionId);
    }
}