import express, { Application, json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { UserRoutes } from './modules/user/presentation/routes/UserRoutes';
import { AestheticRoutes } from './modules/aesthetic/presentation/routes/AestheticRoutes';
import { MerchantRoutes } from '@modules/merchant/presentation/routes/MerchantRoutes';
import { ProductRoutes } from './modules/product/presentation/routes/ProductRoutes';

export const createApp = (): Application => {
    const app = express();

    // Security middleware
    app.use(helmet());

    // CORS configuration
    app.use(cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
        credentials: true
    }));

    // Body parsing
    app.use(json());
    app.use(urlencoded({ extended: true }));

    // Health check
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Module routes
    app.use('/api/users', UserRoutes.create());
    app.use('/api/aesthetics', AestheticRoutes.create());
    app.use('/api/merchants', MerchantRoutes.create());
    app.use('/api/products', ProductRoutes.create());

    return app;
};