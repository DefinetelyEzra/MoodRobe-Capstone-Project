export interface WebhookPayloadDto {
    event: string;
    data: {
        id: number;
        reference: string;
        amount: number;
        currency: string;
        status: string;
        paid_at?: string;
        channel?: string;
        authorization?: {
            card_type?: string;
            last4?: string;
            bank?: string;
        };
        metadata?: Record<string, any>;
    };
}