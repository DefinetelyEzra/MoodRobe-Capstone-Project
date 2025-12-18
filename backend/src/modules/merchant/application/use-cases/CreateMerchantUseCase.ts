import { v4 as uuidv4 } from 'uuid';
import { IMerchantRepository } from '../../domain/repositories/IMerchantRepository';
import { IMerchantStaffRepository } from '../../domain/repositories/IMerchantStaffRepository';
import { Merchant } from '../../domain/entities/Merchant';
import { MerchantStaff } from '../../domain/entities/MerchantStaff';
import { BusinessDetails } from '../../domain/value-objects/BusinessDetails';
import { CreateMerchantDto, MerchantResponseDto } from '../dto/CreateMerchantDto';
import { MerchantAlreadyExistsException } from '../../domain/exceptions/MerchantExceptions';

export class CreateMerchantUseCase {
    constructor(
        private readonly merchantRepository: IMerchantRepository,
        private readonly merchantStaffRepository: IMerchantStaffRepository
    ) { }

    public async execute(dto: CreateMerchantDto, userId: string): Promise<MerchantResponseDto> {
        // Check if merchant with email already exists
        const existingMerchant = await this.merchantRepository.findByEmail(dto.email);
        if (existingMerchant) {
            throw new MerchantAlreadyExistsException(dto.email);
        }

        // Create business details value object
        const businessDetails = new BusinessDetails(dto.businessDetails);

        // Create merchant entity
        const merchantId = uuidv4();
        const merchant = Merchant.create(
            merchantId,
            dto.name,
            dto.email,
            businessDetails
        );

        // Save merchant
        const savedMerchant = await this.merchantRepository.save(merchant);

        // Create owner staff entry for the user who created the merchant
        const staffId = uuidv4();
        const ownerStaff = MerchantStaff.create(
            staffId,
            merchantId,
            userId,  // The logged-in user becomes the owner
            'owner'  // Highest permission level
        );

        // Save the owner staff entry
        await this.merchantStaffRepository.save(ownerStaff);

        // Return the merchant response
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
            updatedAt: merchant.updatedAt
        };
    }
}