export interface Address {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export interface BusinessDetailsData {
    businessType?: string;
    taxId?: string;
    phone?: string;
    website?: string;
    address?: Address;
    description?: string;
}

export class BusinessDetails {
    private readonly details: BusinessDetailsData;

    constructor(details: BusinessDetailsData) {
        this.validateDetails(details);
        this.details = details;
    }

    private validateDetails(details: BusinessDetailsData): void {
        if (details.phone && !this.isValidPhone(details.phone)) {
            throw new Error('Invalid phone number format');
        }

        if (details.website && !this.isValidWebsite(details.website)) {
            throw new Error('Invalid website URL format');
        }

        if (details.taxId && details.taxId.length > 50) {
            throw new Error('Tax ID cannot exceed 50 characters');
        }
    }

    private isValidPhone(phone: string): boolean {
        // Basic phone validation - adjust regex based on your requirements
        const phoneRegex = /^\+?[\d\s\-()]+$/;
        return phoneRegex.test(phone) && phone.replaceAll(/\D/g, '').length >= 10;
    }

    private isValidWebsite(website: string): boolean {
        try {
            new URL(website);
            return true;
        } catch {
            return false;
        }
    }

    public getBusinessType(): string | undefined {
        return this.details.businessType;
    }

    public getTaxId(): string | undefined {
        return this.details.taxId;
    }

    public getPhone(): string | undefined {
        return this.details.phone;
    }

    public getWebsite(): string | undefined {
        return this.details.website;
    }

    public getAddress(): Address | undefined {
        return this.details.address ? { ...this.details.address } : undefined;
    }

    public getDescription(): string | undefined {
        return this.details.description;
    }

    public toJSON(): BusinessDetailsData {
        return {
            businessType: this.details.businessType,
            taxId: this.details.taxId,
            phone: this.details.phone,
            website: this.details.website,
            address: this.details.address ? { ...this.details.address } : undefined,
            description: this.details.description,
        };
    }
}