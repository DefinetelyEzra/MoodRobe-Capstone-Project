import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('cart_items')
export class CartItemEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'cart_id', type: 'uuid' })
    cartId!: string;

    @Column({ name: 'product_variant_id', type: 'uuid' })
    productVariantId!: string;

    @Column({ type: 'integer' })
    quantity!: number;

    @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
    unitPrice!: number;

    @CreateDateColumn({ name: 'added_at', type: 'timestamp' })
    addedAt!: Date;
}