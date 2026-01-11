import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { CartEntity } from './CartEntity';

@Entity('cart_items')
export class CartItemEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'cart_id', type: 'uuid' })
    cartId!: string;

    @ManyToOne(() => CartEntity, (cart) => cart.items, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'cart_id' })
    cart!: CartEntity;

    @Column({ name: 'product_variant_id', type: 'uuid' })
    productVariantId!: string;

    @Column({ name: 'product_name', type: 'varchar' })
    productName!: string;

    @Column({ name: 'quantity', type: 'int' })
    quantity!: number;

    @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
    unitPrice!: number;

    @Column({ name: 'currency', type: 'varchar', length: 3, default: 'NGN' })
    currency!: string;

    @Column({ name: 'product_id', type: 'uuid', nullable: true })
    productId?: string;

    @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
    imageUrl?: string;

    @Column({ name: 'variant_attributes', type: 'jsonb', nullable: true })
    variantAttributes?: Record<string, string | number | boolean>;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
}