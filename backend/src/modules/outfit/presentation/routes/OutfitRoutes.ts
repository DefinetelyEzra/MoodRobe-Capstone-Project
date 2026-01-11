import { Router } from 'express';
import { OutfitController } from '../controllers/OutfitController';
import { OutfitValidator } from '../validators/OutfitValidator';
import { AuthMiddleware } from '../../../user/presentation/middleware/AuthMiddleware';
import { TypeOrmOutfitRepository } from '../../infrastructure/persistence/repositories/TypeOrmOutfitRepository';
import { TypeOrmProductRepository } from '../../../product/infrastructure/persistence/repositories/TypeOrmProductRepository';
import { TypeOrmProductImageRepository } from '../../../product/infrastructure/persistence/repositories/TypeOrmProductImageRepository';
import { CreateOutfitUseCase } from '../../application/use-cases/CreateOutfitUseCase';
import { GetUserOutfitsUseCase } from '../../application/use-cases/GetUserOutfitsUseCase';
import { GetOutfitByIdUseCase } from '../../application/use-cases/GetOutfitByIdUseCase';
import { UpdateOutfitUseCase } from '../../application/use-cases/UpdateOutfitUseCase';
import { DeleteOutfitUseCase } from '../../application/use-cases/DeleteOutfitUseCase';

export class OutfitRoutes {
    public static create(): Router {
        const router = Router();

        // Initialize repositories
        const outfitRepository = new TypeOrmOutfitRepository();
        const productRepository = new TypeOrmProductRepository();
        const imageRepository = new TypeOrmProductImageRepository();

        // Initialize use cases
        const createOutfitUseCase = new CreateOutfitUseCase(outfitRepository);
        const getUserOutfitsUseCase = new GetUserOutfitsUseCase(
            outfitRepository,
            productRepository,
            imageRepository
        );
        const getOutfitByIdUseCase = new GetOutfitByIdUseCase(
            outfitRepository,
            productRepository,
            imageRepository
        );
        const updateOutfitUseCase = new UpdateOutfitUseCase(outfitRepository);
        const deleteOutfitUseCase = new DeleteOutfitUseCase(outfitRepository);

        // Initialize controller
        const outfitController = new OutfitController(
            createOutfitUseCase,
            getUserOutfitsUseCase,
            getOutfitByIdUseCase,
            updateOutfitUseCase,
            deleteOutfitUseCase
        );

        // All routes require authentication
        router.use(AuthMiddleware.authenticate);

        // Routes
        router.post('/', OutfitValidator.createRules(), outfitController.create);
        router.get('/', outfitController.getUserOutfits);
        router.get('/:id', outfitController.getById);
        router.put('/:id', OutfitValidator.updateRules(), outfitController.update);
        router.delete('/:id', outfitController.delete);

        return router;
    }
}