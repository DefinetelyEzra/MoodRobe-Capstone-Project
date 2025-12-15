import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class ProductEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'merchant_id', type: 'uuid' })
    merchantId!: string;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ type: 'varchar', length: 100 })
    category!: string;

    @Column({ name: 'base_price', type: 'decimal', precision: 10, scale: 2 })
    basePrice!: number;

    @Column({ name: 'aesthetic_tags', type: 'uuid', array: true, default: [] })
    aestheticTags!: string[];

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
}