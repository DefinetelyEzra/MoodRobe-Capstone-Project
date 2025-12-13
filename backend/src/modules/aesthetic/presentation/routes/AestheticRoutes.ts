import { Router } from 'express';
import { AestheticController } from '../controllers/AestheticController';
import { StyleQuizController } from '../controllers/StyleQuizController';
import { AestheticValidator } from '../validators/AestheticValidator';
import { AuthMiddleware } from '@modules/user/presentation/middleware/AuthMiddleware';
import { TypeOrmAestheticRepository } from '../../infrastructure/persistence/repositories/TypeOrmAestheticRepository';
import { CreateAestheticUseCase } from '../../application/use-cases/CreateAestheticUseCase';
import { GetAestheticByIdUseCase } from '../../application/use-cases/GetAestheticByIdUseCase';
import { GetAllAestheticsUseCase } from '../../application/use-cases/GetAllAestheticsUseCase';
import { UpdateAestheticUseCase } from '../../application/use-cases/UpdateAestheticUseCase';
import { DeleteAestheticUseCase } from '../../application/use-cases/DeleteAestheticUseCase';
import { SearchAestheticsUseCase } from '@modules/aesthetic/application/use-cases/SearchAestheticUseCase';
import { GetStyleQuizUseCase } from '../../application/use-cases/GetStyleQuizUseCase';
import { SubmitStyleQuizUseCase } from '../../application/use-cases/SubmitStyleQuizUseCase';

export class AestheticRoutes {
    public static create(): Router {
        const router = Router();

        // Initialize repository
        const aestheticRepository = new TypeOrmAestheticRepository();

        // Initialize use cases
        const createAestheticUseCase = new CreateAestheticUseCase(aestheticRepository);
        const getAestheticByIdUseCase = new GetAestheticByIdUseCase(aestheticRepository);
        const getAllAestheticsUseCase = new GetAllAestheticsUseCase(aestheticRepository);
        const updateAestheticUseCase = new UpdateAestheticUseCase(aestheticRepository);
        const deleteAestheticUseCase = new DeleteAestheticUseCase(aestheticRepository);
        const searchAestheticsUseCase = new SearchAestheticsUseCase(aestheticRepository);
        const getStyleQuizUseCase = new GetStyleQuizUseCase();
        const submitStyleQuizUseCase = new SubmitStyleQuizUseCase(aestheticRepository);

        // Initialize controllers
        const aestheticController = new AestheticController(
            createAestheticUseCase,
            getAestheticByIdUseCase,
            getAllAestheticsUseCase,
            updateAestheticUseCase,
            deleteAestheticUseCase,
            searchAestheticsUseCase
        );

        const styleQuizController = new StyleQuizController(
            getStyleQuizUseCase,
            submitStyleQuizUseCase
        );

        // Public routes
        router.get('/', aestheticController.getAll);
        router.get('/search', AestheticValidator.searchRules(), aestheticController.search);
        router.get('/:id', aestheticController.getById);

        // Quiz routes (public)
        router.get('/quiz/questions', styleQuizController.getQuiz);
        router.post(
            '/quiz/submit',
            AestheticValidator.submitQuizRules(),
            styleQuizController.submitQuiz
        );

        // Protected routes (admin only (may add role checking middleware later lol))
        router.post(
            '/',
            AuthMiddleware.authenticate,
            AestheticValidator.createRules(),
            aestheticController.create
        );
        router.put(
            '/:id',
            AuthMiddleware.authenticate,
            AestheticValidator.updateRules(),
            aestheticController.update
        );
        router.delete(
            '/:id',
            AuthMiddleware.authenticate,
            aestheticController.delete
        );

        return router;
    }
}