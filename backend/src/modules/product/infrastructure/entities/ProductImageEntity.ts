import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('product_images')
export class ProductImageEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'product_id', type: 'uuid' })
    productId!: string;

    @Column({ type: 'varchar', length: 500 })
    url!: string;

    @Column({ name: 'is_primary', type: 'boolean', default: false })
    isPrimary!: boolean;

    @Column({ name: 'display_order', type: 'integer', default: 0 })
    displayOrder!: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;
}