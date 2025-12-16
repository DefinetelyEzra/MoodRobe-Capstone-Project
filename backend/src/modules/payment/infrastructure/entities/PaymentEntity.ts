import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index
} from 'typeorm';

@Entity('payments')
export class PaymentEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column('uuid', { name: 'order_id' })
    @Index()
    orderId!: string;

    @Column('varchar', { length: 50 })
    provider!: string;

    @Column('varchar', { length: 255, nullable: true, name: 'transaction_id' })
    @Index()
    transactionId!: string | null;

    @Column('varchar', { length: 50 })
    @Index()
    status!: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount!: number;

    @Column('varchar', { length: 3, default: 'NGN' })
    currency!: string;

    @Column('decimal', { precision: 10, scale: 2, default: 0, name: 'refunded_amount' })
    refundedAmount!: number;

    @Column('jsonb', { name: 'payment_method' })
    paymentMethod!: any;

    @Column('jsonb', { default: {} })
    metadata!: any;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}