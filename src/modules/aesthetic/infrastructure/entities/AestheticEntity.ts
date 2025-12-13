import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ThemePropertiesData } from '@modules/aesthetic/domain/value-objects/ThemeProperties';

@Entity('aesthetics')
export class AestheticEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    name!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ name: 'theme_properties', type: 'jsonb' })
    themeProperties!: ThemePropertiesData;

    @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
    imageUrl?: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
}