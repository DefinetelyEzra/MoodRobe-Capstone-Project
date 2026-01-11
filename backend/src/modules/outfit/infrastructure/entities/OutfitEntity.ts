import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_outfits')
export class OutfitEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId!: string;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string | null;

    @Column({ name: 'outfit_type', type: 'varchar', length: 50, default: 'full' })
    outfitType!: string;

    @Column({ type: 'jsonb' })
    items!: Record<string, string>;

    @Column({ name: 'aesthetic_tags', type: 'uuid', array: true, default: [] })
    aestheticTags!: string[];

    @Column({ name: 'is_public', type: 'boolean', default: false })
    isPublic!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
}