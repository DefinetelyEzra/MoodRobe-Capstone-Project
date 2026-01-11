import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { AuthMiddleware } from '@modules/user/presentation/middleware/AuthMiddleware';
import { AdminMiddleware } from '../middleware/AdminMiddleware';
import { AdminValidator } from '../validators/AdminValidator';
import { TypeOrmCarouselRepository } from '../../infrastructure/persistence/repositories/TypeOrmCarouselRepository';
import { TypeOrmContentRepository } from '../../infrastructure/persistence/repositories/TypeOrmContentRepository';
import { TypeOrmActivityLogRepository } from '../../infrastructure/persistence/repositories/TypeOrmActivityLogRepository';
import { TypeOrmAestheticRepository } from '@modules/aesthetic/infrastructure/persistence/repositories/TypeOrmAestheticRepository';
import { TypeOrmUserRepository } from '@modules/user/infrastructure/persistence/repositories/TypeOrmUserRepository';
import { ManageCarouselUseCase } from '../../application/use-cases/ManageCarouselUseCase';
import { ManageContentUseCase } from '../../application/use-cases/ManageContentUseCase';
import { ManageAestheticImageUseCase } from '../../application/use-cases/ManageAestheticImageUseCase';
import { GetActivityLogUseCase } from '../../application/use-cases/GetActivityLogUseCase';

export class AdminRoutes {
    public static create(): Router {
        const router = Router();

        // Initialize repositories
        const carouselRepository = new TypeOrmCarouselRepository();
        const contentRepository = new TypeOrmContentRepository();
        const aestheticRepository = new TypeOrmAestheticRepository();
        const activityLogRepository = new TypeOrmActivityLogRepository();
        const userRepository = new TypeOrmUserRepository();

        // Initialize use cases
        const manageCarouselUseCase = new ManageCarouselUseCase(
            carouselRepository,
            activityLogRepository
        );
        const manageContentUseCase = new ManageContentUseCase(
            contentRepository,
            activityLogRepository
        );
        const manageAestheticImageUseCase = new ManageAestheticImageUseCase(
            aestheticRepository,
            activityLogRepository
        );
        const getActivityLogUseCase = new GetActivityLogUseCase(
            activityLogRepository
        );

        // Initialize controller
        const adminController = new AdminController(
            manageCarouselUseCase,
            manageContentUseCase,
            getActivityLogUseCase,
            userRepository,
            manageAestheticImageUseCase
        );

        // All routes require authentication AND admin privileges
        const adminAuth = [AuthMiddleware.authenticate, AdminMiddleware.verifyAdmin];

        // Public routes (no auth required) - for displaying content
        router.get('/carousel/active', adminController.getActiveCarousel);
        router.get('/content', adminController.getAllContent);
        router.get('/content/:sectionKey', adminController.getContentBySectionKey);

        // Carousel management routes (admin only)
        router.get('/carousel', adminAuth, adminController.getAllCarousel);
        router.post(
            '/carousel',
            adminAuth,
            AdminValidator.createCarouselRules(),
            adminController.createCarousel
        );
        router.put(
            '/carousel/:id',
            adminAuth,
            AdminValidator.updateCarouselRules(),
            adminController.updateCarousel
        );
        router.delete('/carousel/:id', adminAuth, adminController.deleteCarousel);

        // Content management routes (admin only)
        router.put(
            '/content/:sectionKey',
            adminAuth,
            AdminValidator.updateContentRules(),
            adminController.updateContent
        );

        // Add aesthetic image (admin only)
        router.put(
            '/aesthetics/:id/image',
            adminAuth,
            AdminValidator.updateAestheticImageRules(),
            adminController.updateAestheticImage
        );

        // Activity log (admin only)
        router.get('/activity-log', adminAuth, adminController.getActivityLog);

        return router;
    }
}