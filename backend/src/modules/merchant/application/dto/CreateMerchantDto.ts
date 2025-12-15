import { BusinessDetailsData } from '../../domain/value-objects/BusinessDetails';

export interface CreateMerchantDto {
    name: string;
    email: string;
    businessDetails: BusinessDetailsData;
}

export interface MerchantResponseDto {
    id: string;
    name: string;
    email: string;
    businessDetails: BusinessDetailsData;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}