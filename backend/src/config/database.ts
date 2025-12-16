import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserEntity } from '@modules/user/infrastructure/entities/UserEntity';
import { UserProfileEntity } from '@modules/user/infrastructure/entities/UserProfileEntity';
import { MerchantEntity } from '@modules/merchant/infrastructure/entities/MerchantEntity';
import { MerchantStaffEntity } from '@modules/merchant/infrastructure/entities/MerchantStaffEntity';
import { ProductEntity } from '@modules/product/infrastructure/entities/ProductEntity';
import { ProductImageEntity } from '@modules/product/infrastructure/entities/ProductImageEntity';
import { ProductVariantEntity } from '@modules/product/infrastructure/entities/ProductVariantEntity';
import { OrderEntity } from '@modules/order/infrastructure/entities/OrderEntity';
import { OrderLineEntity } from '@modules/order/infrastructure/entities/OrderLineEntity';
import { CartEntity } from '@modules/cart/infrastructure/entities/CartEntity';
import { CartItemEntity } from '@modules/cart/infrastructure/entities/CartItemEntity';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number.parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    entities: [UserEntity,
        UserProfileEntity,
        MerchantEntity,
        MerchantStaffEntity,
        ProductEntity,
        ProductImageEntity,
        ProductVariantEntity,
        CartEntity,
        CartItemEntity,
        OrderEntity,
        OrderLineEntity],
    migrations: ['src/shared/infrastructure/migrations/*.ts'],
});

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connection established');
        // Log loaded entities for debugging
        console.log('Loaded entities:', AppDataSource.entityMetadatas.map(m => m.name));
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};