import { MerchantStaff } from '../entities/MerchantStaff';

export interface IMerchantStaffRepository {
    save(staff: MerchantStaff): Promise<MerchantStaff>;
    findById(id: string): Promise<MerchantStaff | null>;
    findByMerchantId(merchantId: string): Promise<MerchantStaff[]>;
    findByUserId(userId: string): Promise<MerchantStaff[]>;
    findByMerchantAndUser(merchantId: string, userId: string): Promise<MerchantStaff | null>;
    update(staff: MerchantStaff): Promise<MerchantStaff>;
    delete(id: string): Promise<void>;
    existsByMerchantAndUser(merchantId: string, userId: string): Promise<boolean>;
    countByMerchant(merchantId: string): Promise<number>;
}