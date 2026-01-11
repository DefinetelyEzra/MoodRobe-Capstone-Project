import { Outfit } from '../entities/Outfit';

export interface IOutfitRepository {
    save(outfit: Outfit): Promise<Outfit>;
    findById(id: string): Promise<Outfit | null>;
    findByUserId(userId: string): Promise<Outfit[]>;
    findPublicOutfits(limit?: number, offset?: number): Promise<Outfit[]>;
    update(outfit: Outfit): Promise<Outfit>;
    delete(id: string): Promise<void>;
    count(userId?: string): Promise<number>;
}