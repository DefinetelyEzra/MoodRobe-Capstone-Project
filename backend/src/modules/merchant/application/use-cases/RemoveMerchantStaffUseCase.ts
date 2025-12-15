import { IMerchantStaffRepository } from '../../domain/repositories/IMerchantStaffRepository';
import {
    StaffNotFoundException,
    UnauthorizedMerchantAccessException,
    CannotRemoveOwnerException,
} from '../../domain/exceptions/MerchantExceptions';
export class RemoveMerchantStaffUseCase {
    constructor(private readonly merchantStaffRepository: IMerchantStaffRepository) { }
    public async execute(staffId: string, requestingUserId: string): Promise<void> {
        // Find staff member
        const staff = await this.merchantStaffRepository.findById(staffId);
        if (!staff) {
            throw new StaffNotFoundException(staffId);
        }
        // Cannot remove owner
        if (staff.isOwner()) {
            throw new CannotRemoveOwnerException();
        }

        // Verify requesting user has permission
        await this.verifyUserPermission(staff.merchantId, requestingUserId);

        // Delete staff
        await this.merchantStaffRepository.delete(staffId);
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
                'You do not have permission to remove staff members'
            );
        }
    }
}