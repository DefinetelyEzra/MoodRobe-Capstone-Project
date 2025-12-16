import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AddressData } from '@modules/order/domain/value-objects/Address';

@Entity('orders')
export class OrderEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId!: string;

    @Column({ name: 'order_number', type: 'varchar', length: 50, unique: true })
    orderNumber!: string;

    @Column({ type: 'varchar', length: 50, default: 'pending' })
    status!: string;

    @Column({ name: 'subtotal', type: 'decimal', precision: 10, scale: 2 })
    subtotal!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    tax!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    discount!: number;

    @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
    totalAmount!: number;

    @Column({ name: 'shipping_address', type: 'jsonb' })
    shippingAddress!: AddressData;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
}