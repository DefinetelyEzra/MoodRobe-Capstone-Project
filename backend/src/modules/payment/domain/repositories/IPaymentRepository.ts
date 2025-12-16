import { Payment, PaymentStatus } from '../entities/Payment';

export interface PaymentSearchCriteria {
    orderId?: string;
    status?: PaymentStatus;
    provider?: string;
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
}

export interface IPaymentRepository {
    save(payment: Payment): Promise<Payment>;
    findById(id: string): Promise<Payment | null>;
    findByOrderId(orderId: string): Promise<Payment[]>;
    findByTransactionId(transactionId: string): Promise<Payment | null>;
    search(
        criteria: PaymentSearchCriteria,
        limit?: number,
        offset?: number
    ): Promise<Payment[]>;
    update(payment: Payment): Promise<Payment>;
    delete(id: string): Promise<void>;
    count(criteria?: PaymentSearchCriteria): Promise<number>;
    existsByTransactionId(transactionId: string): Promise<boolean>;
}