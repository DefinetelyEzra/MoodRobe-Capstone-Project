import { Collection } from '../entities/Collection';

export interface ICollectionRepository {
    save(collection: Collection): Promise<void>;
    findById(id: string): Promise<Collection | null>;
    findByUserId(userId: string): Promise<Collection[]>;
    delete(id: string): Promise<void>;
}