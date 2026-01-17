import { Entity, PrimaryColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('collection_items')
@Index(['collectionId', 'productId'], { unique: true })
export class CollectionItemEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'collection_id', type: 'uuid' })
    @Index()
    collectionId!: string;

    @Column({ name: 'product_id', type: 'uuid' })
    @Index()
    productId!: string;

    @CreateDateColumn({ name: 'added_at', type: 'timestamp' })
    addedAt!: Date;
}