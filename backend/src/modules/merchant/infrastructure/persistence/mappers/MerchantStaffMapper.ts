import { MerchantStaff } from '../../../domain/entities/MerchantStaff';
import { MerchantStaffEntity } from '../../entities/MerchantStaffEntity';

export class MerchantStaffMapper {
    public static toDomain(entity: MerchantStaffEntity): MerchantStaff {
        return MerchantStaff.reconstitute(
            entity.id,
            entity.merchantId,
            entity.userId,
            entity.role,
            entity.permissions,
            entity.createdAt,
            entity.updatedAt
        );
    }

    public static toEntity(domain: MerchantStaff): MerchantStaffEntity {
        const entity = new MerchantStaffEntity();
        entity.id = domain.id;
        entity.merchantId = domain.merchantId;
        entity.userId = domain.userId;
        entity.role = domain.role;
        entity.permissions = domain.permissions;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }
}