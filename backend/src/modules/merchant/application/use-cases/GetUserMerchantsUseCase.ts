import { IMerchantRepository } from '../../domain/repositories/IMerchantRepository';
import { IMerchantStaffRepository } from '../../domain/repositories/IMerchantStaffRepository';
import { MerchantResponseDto } from '../dto/CreateMerchantDto';
import { Merchant } from '../../domain/entities/Merchant';

export class GetUserMerchantsUseCase {
    constructor(
        private readonly merchantRepository: IMerchantRepository,
        private readonly merchantStaffRepository: IMerchantStaffRepository
    ) { }

    public async execute(userId: string): Promise<MerchantResponseDto[]> {
        // Get all staff records for user
        const staffRecords = await this.merchantStaffRepository.findByUserId(userId);

        // Get merchants for these records
        const merchants = await Promise.all(
            staffRecords.map((staff) => this.merchantRepository.findById(staff.merchantId))
        );

        // Filter out nulls and convert to DTOs
        return merchants
            .filter((merchant): merchant is Merchant => merchant !== null)
            .map(this.toResponseDto);
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