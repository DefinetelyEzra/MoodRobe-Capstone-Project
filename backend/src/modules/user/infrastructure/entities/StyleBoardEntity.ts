import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { StyleBoardItem } from '@modules/user/domain/entities/StyleBoard';

@Entity('style_boards')
export class StyleBoardEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'user_id', type: 'uuid' })
    @Index()
    userId!: string;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ name: 'aesthetic_tags', type: 'uuid', array: true, default: [] })
    aestheticTags!: string[];

    @Column({ type: 'jsonb', default: [] })
    items!: StyleBoardItem[];

    @Column({ name: 'is_public', type: 'boolean', default: false })
    isPublic!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
}