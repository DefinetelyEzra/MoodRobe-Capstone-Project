import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('homepage_content')
export class HomepageContentEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'section_key', type: 'varchar', length: 100, unique: true })
    sectionKey!: string;

    @Column({ name: 'content_type', type: 'varchar', length: 50 })
    contentType!: string;

    @Column({ type: 'text' })
    content!: string;

    @Column({ type: 'jsonb', default: {} })
    metadata!: Record<string, any>;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
}