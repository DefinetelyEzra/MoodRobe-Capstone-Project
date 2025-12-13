import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserProfileController } from '../controllers/UserProfileController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { UserValidator } from '../validators/UserValidator';
import { TypeOrmUserRepository } from '../../infrastructure/persistence/repositories/TypeOrmUserRepository';
import { TypeOrmUserProfileRepository } from '../../infrastructure/persistence/repositories/TypeOrmUserProfileRepository';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase';
import { GetUserByIdUseCase } from '../../application/use-cases/GetUserByIdUseCase';
import { UpdateUserUseCase } from '../../application/use-cases/UpdateUserUseCase';
import { UpdatePasswordUseCase } from '../../application/use-cases/UpdatePasswordUseCase';
import { SelectAestheticUseCase } from '../../application/use-cases/SelectAestheticUseCase';
import { GetUserProfileUseCase } from '../../application/use-cases/GetUserProfileUseCase';
import { UpdateUserProfileUseCase } from '../../application/use-cases/UpdateUserProfileUseCase';
import { SaveAestheticUseCase } from '../../application/use-cases/SaveAestheticUseCase';

export class UserRoutes {
    public static create(): Router {
        const router = Router();

        // Initialize repositories
        const userRepository = new TypeOrmUserRepository();
        const userProfileRepository = new TypeOrmUserProfileRepository();

        // Initialize use cases
        const registerUserUseCase = new RegisterUserUseCase(
            userRepository,
            userProfileRepository
        );
        const loginUserUseCase = new LoginUserUseCase(userRepository);
        const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
        const updateUserUseCase = new UpdateUserUseCase(userRepository);
        const updatePasswordUseCase = new UpdatePasswordUseCase(userRepository);
        const selectAestheticUseCase = new SelectAestheticUseCase(userRepository);
        const getUserProfileUseCase = new GetUserProfileUseCase(userProfileRepository);
        const updateUserProfileUseCase = new UpdateUserProfileUseCase(
            userProfileRepository
        );
        const saveAestheticUseCase = new SaveAestheticUseCase(userProfileRepository);

        // Initialize controllers
        const userController = new UserController(
            registerUserUseCase,
            loginUserUseCase,
            getUserByIdUseCase,
            updateUserUseCase,
            updatePasswordUseCase,
            selectAestheticUseCase
        );

        const userProfileController = new UserProfileController(
            getUserProfileUseCase,
            updateUserProfileUseCase,
            saveAestheticUseCase
        );

        // Public routes
        router.post(
            '/register',
            UserValidator.registerRules(),
            userController.register
        );
        router.post('/login', UserValidator.loginRules(), userController.login);

        // Protected routes
        router.get('/profile', AuthMiddleware.authenticate, userController.getProfile);
        router.put(
            '/profile',
            AuthMiddleware.authenticate,
            UserValidator.updateRules(),
            userController.updateProfile
        );
        router.put(
            '/password',
            AuthMiddleware.authenticate,
            UserValidator.updatePasswordRules(),
            userController.updatePassword
        );
        router.post(
            '/aesthetic',
            AuthMiddleware.authenticate,
            UserValidator.selectAestheticRules(),
            userController.selectAesthetic
        );

        // User profile routes
        router.get(
            '/profile/preferences',
            AuthMiddleware.authenticate,
            userProfileController.getProfile
        );
        router.put(
            '/profile/preferences',
            AuthMiddleware.authenticate,
            userProfileController.updateProfile
        );
        router.post(
            '/profile/saved-aesthetics',
            AuthMiddleware.authenticate,
            userProfileController.saveAesthetic
        );

        return router;
    }
}