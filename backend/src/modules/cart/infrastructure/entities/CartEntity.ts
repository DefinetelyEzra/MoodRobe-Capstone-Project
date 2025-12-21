import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { CartItemEntity } from './CartItemEntity';

@Entity('carts')
export class CartEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'user_id', type: 'uuid', unique: true })
    userId!: string;

    @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart, {
        cascade: false,  
        eager: false  
    })
    items!: CartItemEntity[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
}