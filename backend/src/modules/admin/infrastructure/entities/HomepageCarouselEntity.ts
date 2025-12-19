import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity('homepage_carousel')
export class HomepageCarouselEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'image_url', type: 'varchar', length: 500 })
    imageUrl!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    title?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    subtitle?: string;

    @Column({ name: 'link_url', type: 'varchar', length: 500, nullable: true })
    linkUrl?: string;

    @Column({ name: 'display_order', type: 'integer', default: 0 })
    displayOrder!: number;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
}