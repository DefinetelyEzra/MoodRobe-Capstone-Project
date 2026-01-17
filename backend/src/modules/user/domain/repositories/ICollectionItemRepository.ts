import { CollectionItem } from '../entities/CollectionItem';

export interface ICollectionItemRepository {
    save(item: CollectionItem): Promise<void>;
    delete(collectionId: string, productId: string): Promise<void>;
    findByCollectionId(collectionId: string): Promise<CollectionItem[]>;
    exists(collectionId: string, productId: string): Promise<boolean>;
}