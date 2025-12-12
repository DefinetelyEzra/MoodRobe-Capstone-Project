import { UserProfile } from '../entities/UserProfile';

export interface IUserProfileRepository {
    save(profile: UserProfile): Promise<UserProfile>;
    findByUserId(userId: string): Promise<UserProfile | null>;
    update(profile: UserProfile): Promise<UserProfile>;
    delete(userId: string): Promise<void>;
}