export interface AddressData {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    additionalInfo?: string;
}

export class Address {
    private readonly data: AddressData;

    constructor(data: AddressData) {
        this.validateAddress(data);
        this.data = data;
    }

    private validateAddress(data: AddressData): void {
        if (!data.street || data.street.trim().length === 0) {
            throw new Error('Street address is required');
        }
        if (!data.city || data.city.trim().length === 0) {
            throw new Error('City is required');
        }
        if (!data.state || data.state.trim().length === 0) {
            throw new Error('State is required');
        }
        if (!data.country || data.country.trim().length === 0) {
            throw new Error('Country is required');
        }
        if (!data.postalCode || data.postalCode.trim().length === 0) {
            throw new Error('Postal code is required');
        }
    }

    public getStreet(): string {
        return this.data.street;
    }

    public getCity(): string {
        return this.data.city;
    }

    public getState(): string {
        return this.data.state;
    }

    public getCountry(): string {
        return this.data.country;
    }

    public getPostalCode(): string {
        return this.data.postalCode;
    }

    public getAdditionalInfo(): string | undefined {
        return this.data.additionalInfo;
    }

    public toJSON(): AddressData {
        return { ...this.data };
    }

    public getFullAddress(): string {
        const parts = [
            this.data.street,
            this.data.city,
            this.data.state,
            this.data.postalCode,
            this.data.country,
        ];
        return parts.join(', ');
    }
}