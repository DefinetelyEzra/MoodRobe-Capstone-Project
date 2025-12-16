export interface SearchPaymentsDto {
    orderId?: string;
    status?: string;
    provider?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    limit?: number;
    offset?: number;
}