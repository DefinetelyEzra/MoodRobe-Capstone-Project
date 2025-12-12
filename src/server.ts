import dotenv from 'dotenv';
import { createApp } from './app';
import { initializeDatabase } from './config/database';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Initialize database
        await initializeDatabase();

        // Create Express app
        const app = createApp();

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();