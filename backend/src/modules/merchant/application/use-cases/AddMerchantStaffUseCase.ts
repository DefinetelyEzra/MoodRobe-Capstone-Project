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
import { IUserRepository } from '@modules/user/domain/repositories/IUserRepository';

export class AddMerchantStaffUseCase {
    constructor(
        private readonly merchantRepository: IMerchantRepository,
        private readonly merchantStaffRepository: IMerchantStaffRepository,
        private readonly userRepository: IUserRepository,
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

        // Resolve userId from email if email was provided
        let targetUserId = dto.userId;
        if (dto.email && !targetUserId) {
            const user = await this.userRepository.findByEmail(dto.email);
            if (!user) {
                throw new Error(`User with email ${dto.email} not found`);
            }
            targetUserId = user.id;
        }

        if (!targetUserId) {
            throw new Error('User ID could not be determined');
        }

        // Check if user is already staff
        const existingStaff = await this.merchantStaffRepository.findByMerchantAndUser(
            merchantId,
            targetUserId
        );
        if (existingStaff) {
            throw new StaffAlreadyExistsException(merchantId, targetUserId);
        }

        // Create staff member
        const staffId = uuidv4();
        const staff = MerchantStaff.create(staffId, merchantId, targetUserId, dto.role);

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