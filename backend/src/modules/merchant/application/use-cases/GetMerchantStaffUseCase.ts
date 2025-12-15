import { IMerchantStaffRepository } from '../../domain/repositories/IMerchantStaffRepository';
import { StaffResponseDto } from '../dto/MerchantStaffDto';
import { MerchantStaff } from '../../domain/entities/MerchantStaff';

export class GetMerchantStaffUseCase {
    constructor(private readonly merchantStaffRepository: IMerchantStaffRepository) { }

    public async execute(merchantId: string): Promise<StaffResponseDto[]> {
        const staffMembers = await this.merchantStaffRepository.findByMerchantId(merchantId);
        return staffMembers.map(this.toResponseDto);
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