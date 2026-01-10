import { IMerchantStaffRepository } from '../../domain/repositories/IMerchantStaffRepository';
import { StaffResponseDto } from '../dto/MerchantStaffDto';
import { MerchantStaff } from '../../domain/entities/MerchantStaff';
import { IUserRepository } from '@modules/user/domain/repositories/IUserRepository';

export class GetMerchantStaffUseCase {
    constructor(
        private readonly merchantStaffRepository: IMerchantStaffRepository,
        private readonly userRepository: IUserRepository,
    ) { }

    public async execute(merchantId: string): Promise<StaffResponseDto[]> {
        const staffMembers = await this.merchantStaffRepository.findByMerchantId(merchantId);

        // Fetch user information for each staff member
        const staffWithUsers = await Promise.all(
            staffMembers.map(async (staff) => {
                const user = await this.userRepository.findById(staff.userId);
                return this.toResponseDto(staff, user);
            })
        );

        return staffWithUsers;
    }

    private toResponseDto(staff: MerchantStaff, user: any): StaffResponseDto {
        return {
            id: staff.id,
            merchantId: staff.merchantId,
            userId: staff.userId,
            role: staff.role,
            permissions: staff.permissions,
            createdAt: staff.createdAt,
            updatedAt: staff.updatedAt,
            user: user ? {
                id: user.id,
                name: user.name,
                email: user.email
            } : null
        };
    }
}