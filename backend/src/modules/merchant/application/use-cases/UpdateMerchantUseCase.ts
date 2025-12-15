import { IMerchantRepository } from '../../domain/repositories/IMerchantRepository';
import { IMerchantStaffRepository } from '../../domain/repositories/IMerchantStaffRepository';
import {
    MerchantNotFoundException,
    MerchantAlreadyExistsException,
    UnauthorizedMerchantAccessException,
} from '../../domain/exceptions/MerchantExceptions';
import { UpdateMerchantDto } from '../dto/UpdantMerchantDto';
import { MerchantResponseDto } from '../dto/CreateMerchantDto';
import { BusinessDetails } from '../../domain/value-objects/BusinessDetails';
import { Merchant } from '../../domain/entities/Merchant';

export class UpdateMerchantUseCase {
    constructor(
        private readonly merchantRepository: IMerchantRepository,
        private readonly merchantStaffRepository: IMerchantStaffRepository
    ) { }

    public async execute(
        merchantId: string,
        dto: UpdateMerchantDto,
        userId: string
    ): Promise<MerchantResponseDto> {
        // Verify user has permission to update merchant
        await this.verifyUserPermission(merchantId, userId);

        // Find merchant
        const merchant = await this.merchantRepository.findById(merchantId);
        if (!merchant) {
            throw new MerchantNotFoundException(merchantId);
        }

        // Update name if provided
        if (dto.name) {
            merchant.updateName(dto.name);
        }

        // Update email if provided
        if (dto.email && dto.email !== merchant.getEmail()) {
            const existingMerchant = await this.merchantRepository.findByEmail(dto.email);
            if (existingMerchant && existingMerchant.id !== merchantId) {
                throw new MerchantAlreadyExistsException(dto.email);
            }
            merchant.updateEmail(dto.email);
        }

        // Update business details if provided
        if (dto.businessDetails) {
            const businessDetails = new BusinessDetails(dto.businessDetails);
            merchant.updateBusinessDetails(businessDetails);
        }

        // Save updated merchant
        const updatedMerchant = await this.merchantRepository.update(merchant);

        return this.toResponseDto(updatedMerchant);
    }

    private async verifyUserPermission(merchantId: string, userId: string): Promise<void> {
        const staff = await this.merchantStaffRepository.findByMerchantAndUser(
            merchantId,
            userId
        );
        if (!staff?.hasPermission('canManageSettings')) {
            throw new UnauthorizedMerchantAccessException(
                'You do not have permission to update this merchant'
            );
        }
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