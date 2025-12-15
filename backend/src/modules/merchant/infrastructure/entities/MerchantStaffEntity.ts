import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { StaffRole, StaffPermissions } from '@modules/merchant/domain/entities/MerchantStaff';

@Entity('merchant_staff')
export class MerchantStaffEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'merchant_id', type: 'uuid' })
    merchantId!: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId!: string;

    @Column({ type: 'varchar', length: 50 })
    role!: StaffRole;

    @Column({ type: 'jsonb', default: {} })
    permissions!: StaffPermissions;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
}