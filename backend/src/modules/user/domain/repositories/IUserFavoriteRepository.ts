import { UserFavorite } from '../entities/UserFavorite';

export interface IUserFavoriteRepository {
    save(favorite: UserFavorite): Promise<void>;
    delete(userId: string, productId: string): Promise<void>;
    findByUserId(userId: string): Promise<UserFavorite[]>;
    findByUserAndProduct(userId: string, productId: string): Promise<UserFavorite | null>;
    exists(userId: string, productId: string): Promise<boolean>;
}