import { Router } from 'express';
import { MerchantController } from '../controllers/MerchantController';
import { MerchantStaffController } from '../controllers/MerchantStaffController';
import { MerchantValidator } from '../validators/MerchantValidator';
import { AuthMiddleware } from '../../../user/presentation/middleware/AuthMiddleware';
import { TypeOrmMerchantRepository } from '../../infrastructure/persistence/repositories/TypeOrmMerchantRepository';
import { TypeOrmMerchantStaffRepository } from '../../infrastructure/persistence/repositories/TypeOrmMerchantStaffRepository';
import { TypeOrmUserRepository } from '../../../user/infrastructure/persistence/repositories/TypeOrmUserRepository';
import { CreateMerchantUseCase } from '../../application/use-cases/CreateMerchantUseCase';
import { GetMerchantByIdUseCase } from '../../application/use-cases/GetMerchantByIdUseCase';
import { GetAllMerchantsUseCase } from '../../application/use-cases/GetAllMerchantsUseCase';
import { UpdateMerchantUseCase } from '../../application/use-cases/UpdateMerchantUseCase';
import { ActivateMerchantUseCase } from '../../application/use-cases/ActivateMerchantUseCase';
import { DeactivateMerchantUseCase } from '../../application/use-cases/DeactivateMerchantUseCase';
import { GetUserMerchantsUseCase } from '../../application/use-cases/GetUserMerchantsUseCase';
import { AddMerchantStaffUseCase } from '@modules/merchant/application/use-cases/AddMerchantStaffUseCase';
import { GetMerchantStaffUseCase } from '../../application/use-cases/GetMerchantStaffUseCase';
import { UpdateStaffRoleUseCase } from '../../application/use-cases/UpdateStaffRoleUseCase';
import { RemoveMerchantStaffUseCase } from '../../application/use-cases/RemoveMerchantStaffUseCase';

export class MerchantRoutes {
    public static create(): Router {
        const router = Router();
        // Initialize repositories
        const merchantRepository = new TypeOrmMerchantRepository();
        const merchantStaffRepository = new TypeOrmMerchantStaffRepository();
        const userRepository = new TypeOrmUserRepository();

        // Initialize merchant use cases
        const createMerchantUseCase = new CreateMerchantUseCase(
            merchantRepository,
            merchantStaffRepository
        );
        const getMerchantByIdUseCase = new GetMerchantByIdUseCase(merchantRepository);
        const getAllMerchantsUseCase = new GetAllMerchantsUseCase(merchantRepository);
        const updateMerchantUseCase = new UpdateMerchantUseCase(
            merchantRepository,
            merchantStaffRepository
        );
        const activateMerchantUseCase = new ActivateMerchantUseCase(merchantRepository);
        const deactivateMerchantUseCase = new DeactivateMerchantUseCase(merchantRepository);
        const getUserMerchantsUseCase = new GetUserMerchantsUseCase(
            merchantRepository,
            merchantStaffRepository
        );

        // Initialize staff use cases
        const addMerchantStaffUseCase = new AddMerchantStaffUseCase(
            merchantRepository,
            merchantStaffRepository,
            userRepository
        );
        const getMerchantStaffUseCase = new GetMerchantStaffUseCase(merchantStaffRepository, userRepository);
        const updateStaffRoleUseCase = new UpdateStaffRoleUseCase(merchantStaffRepository);
        const removeMerchantStaffUseCase = new RemoveMerchantStaffUseCase(
            merchantStaffRepository
        );

        // Initialize controllers
        const merchantController = new MerchantController(
            createMerchantUseCase,
            getMerchantByIdUseCase,
            getAllMerchantsUseCase,
            updateMerchantUseCase,
            activateMerchantUseCase,
            deactivateMerchantUseCase,
            getUserMerchantsUseCase
        );

        const merchantStaffController = new MerchantStaffController(
            addMerchantStaffUseCase,
            getMerchantStaffUseCase,
            updateStaffRoleUseCase,
            removeMerchantStaffUseCase
        );

        // Merchant routes
        router.post(
            '/',
            AuthMiddleware.authenticate,
            MerchantValidator.createRules(),
            merchantController.create
        );

        router.get(
            '/',
            MerchantValidator.queryRules(),
            merchantController.getAll
        );

        router.get(
            '/my-merchants',
            AuthMiddleware.authenticate,
            merchantController.getUserMerchants
        );

        router.get('/:id', merchantController.getById);

        router.put(
            '/:id',
            AuthMiddleware.authenticate,
            MerchantValidator.updateRules(),
            merchantController.update
        );

        router.post(
            '/:id/activate',
            AuthMiddleware.authenticate,
            merchantController.activate
        );

        router.post(
            '/:id/deactivate',
            AuthMiddleware.authenticate,
            merchantController.deactivate
        );

        // Staff routes
        router.get(
            '/:merchantId/staff',
            AuthMiddleware.authenticate,
            merchantStaffController.getStaff
        );

        router.post(
            '/:merchantId/staff',
            AuthMiddleware.authenticate,
            MerchantValidator.addStaffRules(),
            merchantStaffController.addStaff
        );

        router.put(
            '/staff/:staffId',
            AuthMiddleware.authenticate,
            MerchantValidator.updateStaffRules(),
            merchantStaffController.updateStaff
        );

        router.delete(
            '/staff/:staffId',
            AuthMiddleware.authenticate,
            merchantStaffController.removeStaff
        );

        return router;
    }
}