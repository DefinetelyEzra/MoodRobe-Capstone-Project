import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserPreferences } from '../../../domain/entities/UserProfile';

@Entity('user_profiles')
export class UserProfileEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'user_id', type: 'uuid', unique: true })
    userId!: string;

    @Column({ type: 'jsonb', default: {} })
    preferences!: UserPreferences;

    @Column({ name: 'saved_aesthetics', type: 'uuid', array: true, default: [] })
    savedAesthetics!: string[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
}