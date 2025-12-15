export type StaffRole = 'owner' | 'admin' | 'manager' | 'staff';

export interface StaffPermissions {
    canManageProducts: boolean;
    canManageOrders: boolean;
    canManageStaff: boolean;
    canViewAnalytics: boolean;
    canManageSettings: boolean;
}

export class MerchantStaff {
    private constructor(
        public readonly id: string,
        public readonly merchantId: string,
        public readonly userId: string,
        public role: StaffRole,
        public permissions: StaffPermissions,
        public readonly createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) { }

    public static create(
        id: string,
        merchantId: string,
        userId: string,
        role: StaffRole
    ): MerchantStaff {
        const permissions = this.getDefaultPermissions(role);
        return new MerchantStaff(id, merchantId, userId, role, permissions);
    }

    public static reconstitute(
        id: string,
        merchantId: string,
        userId: string,
        role: StaffRole,
        permissions: StaffPermissions,
        createdAt: Date,
        updatedAt: Date
    ): MerchantStaff {
        return new MerchantStaff(
            id,
            merchantId,
            userId,
            role,
            permissions,
            createdAt,
            updatedAt
        );
    }

    public updateRole(role: StaffRole): void {
        if (this.role === 'owner') {
            throw new Error('Cannot change owner role');
        }
        this.role = role;
        this.permissions = MerchantStaff.getDefaultPermissions(role);
        this.updatedAt = new Date();
    }

    public updatePermissions(permissions: Partial<StaffPermissions>): void {
        if (this.role === 'owner') {
            throw new Error('Cannot modify owner permissions');
        }
        this.permissions = {
            ...this.permissions,
            ...permissions,
        };
        this.updatedAt = new Date();
    }

    public hasPermission(permission: keyof StaffPermissions): boolean {
        return this.permissions[permission];
    }

    public isOwner(): boolean {
        return this.role === 'owner';
    }

    public canManageStaff(): boolean {
        return this.role === 'owner' || this.permissions.canManageStaff;
    }

    private static getDefaultPermissions(role: StaffRole): StaffPermissions {
        switch (role) {
            case 'owner':
                return {
                    canManageProducts: true,
                    canManageOrders: true,
                    canManageStaff: true,
                    canViewAnalytics: true,
                    canManageSettings: true,
                };
            case 'admin':
                return {
                    canManageProducts: true,
                    canManageOrders: true,
                    canManageStaff: true,
                    canViewAnalytics: true,
                    canManageSettings: false,
                };
            case 'manager':
                return {
                    canManageProducts: true,
                    canManageOrders: true,
                    canManageStaff: false,
                    canViewAnalytics: true,
                    canManageSettings: false,
                };
            case 'staff':
                return {
                    canManageProducts: false,
                    canManageOrders: true,
                    canManageStaff: false,
                    canViewAnalytics: false,
                    canManageSettings: false,
                };
            default:
                throw new Error(`Unknown role: ${role}`);
        }
    }
}