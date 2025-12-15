import { v4 as uuidv4 } from 'uuid';
import { Merchant } from '../../domain/entities/Merchant';
import { MerchantStaff } from '../../domain/entities/MerchantStaff';
import { BusinessDetails } from '../../domain/value-objects/BusinessDetails';
import { IMerchantRepository } from '../../domain/repositories/IMerchantRepository';
import { IMerchantStaffRepository } from '../../domain/repositories/IMerchantStaffRepository';
import { MerchantAlreadyExistsException } from '../../domain/exceptions/MerchantExceptions';
import { CreateMerchantDto, MerchantResponseDto } from '../dto/CreateMerchantDto';

export class CreateMerchantUseCase {
    constructor(
        private readonly merchantRepository: IMerchantRepository,
        private readonly merchantStaffRepository: IMerchantStaffRepository
    ) { }

    public async execute(
        dto: CreateMerchantDto,
        ownerId: string
    ): Promise<MerchantResponseDto> {
        // Check if merchant with same email exists
        const existingMerchant = await this.merchantRepository.findByEmail(dto.email);
        if (existingMerchant) {
            throw new MerchantAlreadyExistsException(dto.email);
        }

        // Create business details value object
        const businessDetails = new BusinessDetails(dto.businessDetails);

        // Create merchant entity
        const merchantId = uuidv4();
        const merchant = Merchant.create(merchantId, dto.name, dto.email, businessDetails);

        // Save merchant
        const savedMerchant = await this.merchantRepository.save(merchant);

        // Add owner as staff
        const staffId = uuidv4();
        const ownerStaff = MerchantStaff.create(staffId, merchantId, ownerId, 'owner');
        await this.merchantStaffRepository.save(ownerStaff);

        return this.toResponseDto(savedMerchant);
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