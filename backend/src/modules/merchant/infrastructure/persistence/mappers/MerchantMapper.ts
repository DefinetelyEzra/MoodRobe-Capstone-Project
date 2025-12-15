import { Merchant } from '../../../domain/entities/Merchant';
import { BusinessDetails } from '../../../domain/value-objects/BusinessDetails';
import { MerchantEntity } from '../../entities/MerchantEntity';

export class MerchantMapper {
    public static toDomain(entity: MerchantEntity): Merchant {
        const businessDetails = new BusinessDetails(entity.businessDetails);

        return Merchant.reconstitute(
            entity.id,
            entity.name,
            entity.email,
            businessDetails,
            entity.isActive,
            entity.createdAt,
            entity.updatedAt
        );
    }

    public static toEntity(domain: Merchant): MerchantEntity {
        const entity = new MerchantEntity();
        entity.id = domain.id;
        entity.name = domain.name;
        entity.email = domain.getEmail();
        entity.businessDetails = domain.businessDetails.toJSON();
        entity.isActive = domain.isActive;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }
}