export type StaffRole = 'owner' | 'admin' | 'manager' | 'staff';

export interface StaffPermissions {
    canManageProducts: boolean;
    canManageOrders: boolean;
    canManageStaff: boolean;
    canViewAnalytics: boolean;
    canManageSettings: boolean;
}

export interface BusinessDetails {
    businessName?: string;
    businessType?: string;
    registrationNumber?: string;
    taxId?: string;
    website?: string;
    description?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
    };
    contactPhone?: string;
}

export interface Merchant {
    id: string;
    name: string;
    email: string;
    businessDetails: BusinessDetails;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MerchantStaff {
    id: string;
    merchantId: string;
    userId: string;
    role: StaffRole;
    permissions: StaffPermissions;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        name: string;
        email: string;
    } | null;
}

export interface CreateMerchantDto {
    name: string;
    email: string;
    businessDetails: BusinessDetails;
}

export interface UpdateMerchantDto {
    name?: string;
    email?: string;
    businessDetails?: BusinessDetails;
}

export interface AddStaffDto {
    userId?: string;
    email?: string;
    role: StaffRole;
}

export interface UpdateStaffDto {
    role?: StaffRole;
    permissions?: Partial<StaffPermissions>;
}

export interface GetMerchantsParams {
    limit?: number;
    offset?: number;
    activeOnly?: boolean;
}

export interface MerchantListResponse {
    merchants: Merchant[];
    total: number;
    limit: number;
    offset: number;
}