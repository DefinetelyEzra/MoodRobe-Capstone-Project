import { IMerchantRepository } from '../../domain/repositories/IMerchantRepository';
import { MerchantNotFoundException } from '../../domain/exceptions/MerchantExceptions';
import { MerchantResponseDto } from '../dto/CreateMerchantDto';
import { Merchant } from '../../domain/entities/Merchant';

export class GetMerchantByIdUseCase {
    constructor(private readonly merchantRepository: IMerchantRepository) { }

    public async execute(merchantId: string): Promise<MerchantResponseDto> {
        const merchant = await this.merchantRepository.findById(merchantId);
        if (!merchant) {
            throw new MerchantNotFoundException(merchantId);
        }

        return this.toResponseDto(merchant);
    }

    private toResponseDto(merchant: Merchant): MerchantResponseDto {
        return {
            id: merchant.id,
            name: merchant.name,
            email: merchant.getEmail(),
            businessDetails: merchant.businessDetails.toJSON(),
            isActive: merchant.isActive,
            createdAt: merchant.createdAt,
            updatedAt: merchant.updatedAt,
        };
    }
}