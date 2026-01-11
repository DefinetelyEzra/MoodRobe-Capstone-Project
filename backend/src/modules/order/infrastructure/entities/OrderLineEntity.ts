import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('order_lines')
export class OrderLineEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'order_id', type: 'uuid' })
    orderId!: string;

    @Column({ name: 'product_variant_id', type: 'uuid' })
    productVariantId!: string;

    @Column({ name: 'product_name', type: 'varchar', length: 255 })
    productName!: string;

    @Column({ name: 'variant_details', type: 'jsonb' })
    variantDetails!: any;

    @Column({ type: 'integer' })
    quantity!: number;

    @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
    unitPrice!: number;

    @Column({ name: 'line_total', type: 'decimal', precision: 10, scale: 2 })
    lineTotal!: number;

    @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
    imageUrl?: string;
}