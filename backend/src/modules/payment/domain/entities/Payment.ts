import { Money } from '@shared/domain/value-objects/Money';
import { TransactionId } from '../value-objects/TransactionId';
import { PaymentMethod } from '../value-objects/PaymentMethod';
import { PaymentMetadata } from '../value-objects/PaymentMetadata';

export type PaymentStatus =
    | 'pending'
    | 'processing'
    | 'success'
    | 'failed'
    | 'refunded'
    | 'partially_refunded';

export type PaymentProvider = 'paystack' | 'stripe' | 'manual';

export interface PaymentProps {
    id: string;
    orderId: string;
    provider: PaymentProvider;
    transactionId: TransactionId | null;
    status: PaymentStatus;
    amount: Money;
    refundedAmount?: Money;
    paymentMethod: PaymentMethod;
    metadata: PaymentMetadata;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Payment {
    private constructor(
        public readonly id: string,
        public readonly orderId: string,
        public readonly provider: PaymentProvider,
        public transactionId: TransactionId | null,
        public status: PaymentStatus,
        public readonly amount: Money,
        public refundedAmount: Money,
        public readonly paymentMethod: PaymentMethod,
        public metadata: PaymentMetadata,
        public readonly createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) { }

    public static create(
        id: string,
        orderId: string,
        provider: PaymentProvider,
        amount: Money,
        paymentMethod: PaymentMethod,
        metadata: PaymentMetadata
    ): Payment {
        return new Payment(
            id,
            orderId,
            provider,
            null,
            'pending',
            amount,
            new Money(0, amount.getCurrency()),
            paymentMethod,
            metadata
        );
    }

    public static reconstitute(props: PaymentProps): Payment {
        const {
            id,
            orderId,
            provider,
            transactionId,
            status,
            amount,
            refundedAmount,
            paymentMethod,
            metadata,
            createdAt = new Date(),
            updatedAt = new Date()
        } = props;

        return new Payment(
            id,
            orderId,
            provider,
            transactionId,
            status,
            amount,
            refundedAmount || new Money(0, amount.getCurrency()),
            paymentMethod,
            metadata,
            createdAt,
            updatedAt
        );
    }

    public markAsProcessing(): void {
        if (this.status !== 'pending') {
            throw new Error('Only pending payments can be marked as processing');
        }
        this.status = 'processing';
        this.updatedAt = new Date();
    }

    public markAsSuccess(transactionId: TransactionId): void {
        if (!['pending', 'processing'].includes(this.status)) {
            throw new Error('Only pending or processing payments can be marked as success');
        }
        this.transactionId = transactionId;
        this.status = 'success';
        this.updatedAt = new Date();
    }

    public markAsFailed(): void {
        if (!['pending', 'processing'].includes(this.status)) {
            throw new Error('Only pending or processing payments can be marked as failed');
        }
        this.status = 'failed';
        this.updatedAt = new Date();
    }

    public processRefund(refundAmount: Money): void {
        if (this.status !== 'success') {
            throw new Error('Only successful payments can be refunded');
        }

        const totalRefunded = this.refundedAmount.add(refundAmount);
        if (totalRefunded.isGreaterThan(this.amount)) {
            throw new Error('Refund amount exceeds payment amount');
        }

        this.refundedAmount = totalRefunded;

        if (this.refundedAmount.equals(this.amount)) {
            this.status = 'refunded';
        } else {
            this.status = 'partially_refunded';
        }

        this.updatedAt = new Date();
    }

    public updateMetadata(metadata: PaymentMetadata): void {
        this.metadata = metadata;
        this.updatedAt = new Date();
    }

    public isSuccessful(): boolean {
        return this.status === 'success';
    }

    public isFailed(): boolean {
        return this.status === 'failed';
    }

    public isPending(): boolean {
        return this.status === 'pending';
    }

    public isRefundable(): boolean {
        return (
            this.status === 'success' &&
            this.refundedAmount.getAmount() < this.amount.getAmount()
        );
    }

    public getRemainingRefundableAmount(): Money {
        return this.amount.subtract(this.refundedAmount);
    }

    public getTransactionIdValue(): string | null {
        return this.transactionId ? this.transactionId.getValue() : null;
    }
}