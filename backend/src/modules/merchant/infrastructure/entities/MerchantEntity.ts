import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BusinessDetailsData } from '@modules/merchant/domain/value-objects/BusinessDetails';

@Entity('merchants')
export class MerchantEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string;

    @Column({ name: 'business_details', type: 'jsonb', default: {} })
    businessDetails!: BusinessDetailsData;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
}