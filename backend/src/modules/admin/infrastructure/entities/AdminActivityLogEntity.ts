import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('admin_activity_log')
export class AdminActivityLogEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'admin_email', type: 'varchar', length: 255 })
    adminEmail!: string;

    @Column({ type: 'varchar', length: 100 })
    action!: string;

    @Column({ name: 'resource_type', type: 'varchar', length: 100 })
    resourceType!: string;

    @Column({ name: 'resource_id', type: 'uuid', nullable: true })
    resourceId?: string;

    @Column({ type: 'jsonb', default: {} })
    details!: Record<string, any>;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;
}