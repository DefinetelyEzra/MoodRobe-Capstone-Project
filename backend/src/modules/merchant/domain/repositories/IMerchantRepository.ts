import { Merchant } from '../entities/Merchant';

export interface IMerchantRepository {
    save(merchant: Merchant): Promise<Merchant>;
    findById(id: string): Promise<Merchant | null>;
    findByEmail(email: string): Promise<Merchant | null>;
    findAll(limit?: number, offset?: number): Promise<Merchant[]>;
    update(merchant: Merchant): Promise<Merchant>;
    delete(id: string): Promise<void>;
    existsByEmail(email: string): Promise<boolean>;
    findActiveOnly(limit?: number, offset?: number): Promise<Merchant[]>;
    count(): Promise<number>;
}