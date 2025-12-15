export class MerchantNotFoundException extends Error {
    constructor(identifier: string) {
        super(`Merchant not found: ${identifier}`);
        this.name = 'MerchantNotFoundException';
    }
}

export class MerchantAlreadyExistsException extends Error {
    constructor(email: string) {
        super(`Merchant with email ${email} already exists`);
        this.name = 'MerchantAlreadyExistsException';
    }
}

export class StaffNotFoundException extends Error {
    constructor(identifier: string) {
        super(`Staff member not found: ${identifier}`);
        this.name = 'StaffNotFoundException';
    }
}

export class StaffAlreadyExistsException extends Error {
    constructor(merchantId: string, userId: string) {
        super(`User ${userId} is already a staff member of merchant ${merchantId}`);
        this.name = 'StaffAlreadyExistsException';
    }
}

export class UnauthorizedMerchantAccessException extends Error {
    constructor(message: string = 'Unauthorized access to merchant resources') {
        super(message);
        this.name = 'UnauthorizedMerchantAccessException';
    }
}

export class CannotRemoveOwnerException extends Error {
    constructor() {
        super('Cannot remove merchant owner');
        this.name = 'CannotRemoveOwnerException';
    }
}