import { Entity, PrimaryColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('user_favorites')
@Index(['userId', 'productId'], { unique: true })
export class UserFavoriteEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'user_id', type: 'uuid' })
    @Index()
    userId!: string;

    @Column({ name: 'product_id', type: 'uuid' })
    @Index()
    productId!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;
}