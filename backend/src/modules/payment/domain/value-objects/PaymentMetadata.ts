export interface PaymentMetadataProps {
    customerEmail?: string;
    customerName?: string;
    orderNumber?: string;
    ipAddress?: string;
    userAgent?: string;
    [key: string]: any;
}

export class PaymentMetadata {
    private readonly data: PaymentMetadataProps;

    constructor(data: PaymentMetadataProps = {}) {
        this.data = { ...data };
    }

    public get(key: string): any {
        return this.data[key];
    }

    public set(key: string, value: any): PaymentMetadata {
        return new PaymentMetadata({
            ...this.data,
            [key]: value
        });
    }

    public toJSON(): PaymentMetadataProps {
        return { ...this.data };
    }

    public static fromJSON(json: any): PaymentMetadata {
        return new PaymentMetadata(json || {});
    }
}