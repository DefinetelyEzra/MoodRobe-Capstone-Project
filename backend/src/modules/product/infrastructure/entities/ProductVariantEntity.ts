import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('product_variants')
export class ProductVariantEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'product_id', type: 'uuid' })
    productId!: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    sku!: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    size!: string | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    color!: string | null;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;

    @Column({ name: 'stock_quantity', type: 'integer', default: 0 })
    stockQuantity!: number;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
}