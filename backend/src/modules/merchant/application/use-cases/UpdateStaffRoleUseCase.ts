import { IMerchantStaffRepository } from '../../domain/repositories/IMerchantStaffRepository';
import {
    StaffNotFoundException,
    UnauthorizedMerchantAccessException,
} from '../../domain/exceptions/MerchantExceptions';
import { UpdateStaffDto, StaffResponseDto } from '../dto/MerchantStaffDto';
import { MerchantStaff } from '../../domain/entities/MerchantStaff';

export class UpdateStaffRoleUseCase {
    constructor(private readonly merchantStaffRepository: IMerchantStaffRepository) { }

    public async execute(
        staffId: string,
        dto: UpdateStaffDto,
        requestingUserId: string
    ): Promise<StaffResponseDto> {
        // Find staff member
        const staff = await this.merchantStaffRepository.findById(staffId);
        if (!staff) {
            throw new StaffNotFoundException(staffId);
        }

        // Verify requesting user has permission
        await this.verifyUserPermission(staff.merchantId, requestingUserId);

        // Update role if provided
        if (dto.role) {
            staff.updateRole(dto.role);
        }

        // Update permissions if provided
        if (dto.permissions) {
            staff.updatePermissions(dto.permissions);
        }

        // Save updated staff
        const updatedStaff = await this.merchantStaffRepository.update(staff);

        return this.toResponseDto(updatedStaff);
    }

    private async verifyUserPermission(
        merchantId: string,
        userId: string
    ): Promise<void> {
        const requestingStaff = await this.merchantStaffRepository.findByMerchantAndUser(
            merchantId,
            userId
        );
        if (!requestingStaff?.canManageStaff()) {
            throw new UnauthorizedMerchantAccessException(
                'You do not have permission to manage staff'
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