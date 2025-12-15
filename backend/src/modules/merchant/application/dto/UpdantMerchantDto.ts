import { BusinessDetailsData } from '../../domain/value-objects/BusinessDetails';

export interface UpdateMerchantDto {
    name?: string;
    email?: string;
    businessDetails?: BusinessDetailsData;
}