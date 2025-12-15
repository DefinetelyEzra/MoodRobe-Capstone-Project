import { StaffRole, StaffPermissions } from '../../domain/entities/MerchantStaff';

export interface AddStaffDto {
    userId: string;
    role: StaffRole;
}

export interface UpdateStaffDto {
    role?: StaffRole;
    permissions?: Partial<StaffPermissions>;
}

export interface StaffResponseDto {
    id: string;
    merchantId: string;
    userId: string;
    role: StaffRole;
    permissions: StaffPermissions;
    createdAt: Date;
    updatedAt: Date;
}