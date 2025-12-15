import { v4 as uuidv4 } from 'uuid';
import { MerchantStaff } from '../../domain/entities/MerchantStaff';
import { IMerchantRepository } from '../../domain/repositories/IMerchantRepository';
import { IMerchantStaffRepository } from '../../domain/repositories/IMerchantStaffRepository';
import {
    MerchantNotFoundException,
    StaffAlreadyExistsException,
    UnauthorizedMerchantAccessException,
} from '../../domain/exceptions/MerchantExceptions';
import { AddStaffDto, StaffResponseDto } from '../dto/MerchantStaffDto';

export class AddMerchantStaffUseCase {
    constructor(
        private readonly merchantRepository: IMerchantRepository,
        private readonly merchantStaffRepository: IMerchantStaffRepository
    ) { }

    public async execute(
        merchantId: string,
        dto: AddStaffDto,
        requestingUserId: string
    ): Promise<StaffResponseDto> {
        // Verify merchant exists
        const merchant = await this.merchantRepository.findById(merchantId);
        if (!merchant) {
            throw new MerchantNotFoundException(merchantId);
        }

        // Verify requesting user has permission
        await this.verifyUserPermission(merchantId, requestingUserId);

        // Check if user is already staff
        const existingStaff = await this.merchantStaffRepository.findByMerchantAndUser(
            merchantId,
            dto.userId
        );
        if (existingStaff) {
            throw new StaffAlreadyExistsException(merchantId, dto.userId);
        }

        // Create staff member
        const staffId = uuidv4();
        const staff = MerchantStaff.create(staffId, merchantId, dto.userId, dto.role);

        // Save staff
        const savedStaff = await this.merchantStaffRepository.save(staff);

        return this.toResponseDto(savedStaff);
    }

    private async verifyUserPermission(
        merchantId: string,
        userId: string
    ): Promise<void> {
        const staff = await this.merchantStaffRepository.findByMerchantAndUser(
            merchantId,
            userId
        );
        if (!staff?.canManageStaff()) {
            throw new UnauthorizedMerchantAccessException(
                'You do not have permission to manage staff for this merchant'
            );
        }
    }

    private toResponseDto(staff: MerchantStaff): StaffResponseDto {
        return {
            id: staff.id,
            merchantId: staff.merchantId,
            userId: staff.userId,
            role: staff.role,
            permissions: staff.permissions,
            createdAt: staff.createdAt,
            updatedAt: staff.updatedAt,
        };
    }
}