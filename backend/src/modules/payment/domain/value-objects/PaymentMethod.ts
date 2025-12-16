export type PaymentMethodType =
    | 'card'
    | 'bank_transfer'
    | 'ussd'
    | 'mobile_money'
    | 'qr';

export interface PaymentMethodDetails {
    type: PaymentMethodType;
    cardBrand?: string;
    last4?: string;
    bankName?: string;
    accountNumber?: string;
}

export class PaymentMethod {
    private readonly type: PaymentMethodType;
    private readonly details: Partial<PaymentMethodDetails>;

    constructor(type: PaymentMethodType, details?: Partial<PaymentMethodDetails>) {
        this.type = type;
        this.details = details || {};
    }

    public getType(): PaymentMethodType {
        return this.type;
    }

    public getDetails(): Partial<PaymentMethodDetails> {
        return { ...this.details };
    }

    public static fromCard(cardBrand: string, last4: string): PaymentMethod {
        return new PaymentMethod('card', {
            type: 'card',
            cardBrand,
            last4
        });
    }

    public static fromBankTransfer(bankName: string, accountNumber?: string): PaymentMethod {
        return new PaymentMethod('bank_transfer', {
            type: 'bank_transfer',
            bankName,
            accountNumber
        });
    }

    public static fromUSSD(): PaymentMethod {
        return new PaymentMethod('ussd', { type: 'ussd' });
    }

    public static fromMobileMoney(): PaymentMethod {
        return new PaymentMethod('mobile_money', { type: 'mobile_money' });
    }

    public static fromQR(): PaymentMethod {
        return new PaymentMethod('qr', { type: 'qr' });
    }

    public toJSON(): PaymentMethodDetails {
        return {
            type: this.type,
            ...this.details
        } as PaymentMethodDetails;
    }
}