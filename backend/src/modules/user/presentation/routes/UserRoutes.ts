import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserProfileController } from '../controllers/UserProfileController';
import { UserFavoriteController } from '../controllers/UserFavoriteController';
import { CollectionController } from '../controllers/CollectionController';
import { StyleBoardController } from '../controllers/StyleBoardController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { UserValidator } from '../validators/UserValidator';
import { FavoriteValidator } from '../validators/FavoriteValidator';
import { CollectionValidator } from '../validators/CollectionValidator';
import { StyleBoardValidator } from '../validators/StyleBoardValidator';
import { TypeOrmUserRepository } from '../../infrastructure/persistence/repositories/TypeOrmUserRepository';
import { TypeOrmUserProfileRepository } from '../../infrastructure/persistence/repositories/TypeOrmUserProfileRepository';
import { TypeOrmUserFavoriteRepository } from '../../infrastructure/persistence/repositories/TypeOrmUserFavoriteRepository';
import { TypeOrmCollectionRepository } from '../../infrastructure/persistence/repositories/TypeOrmCollectionRepository';
import { TypeOrmCollectionItemRepository } from '../../infrastructure/persistence/repositories/TypeOrmCollectionItemRepository';
import { TypeOrmStyleBoardRepository } from '../../infrastructure/persistence/repositories/TypeOrmStyleBoardRepository';
import { TypeOrmProductRepository } from '@modules/product/infrastructure/persistence/repositories/TypeOrmProductRepository';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase';
import { GetUserByIdUseCase } from '../../application/use-cases/GetUserByIdUseCase';
import { UpdateUserUseCase } from '../../application/use-cases/UpdateUserUseCase';
import { UpdatePasswordUseCase } from '../../application/use-cases/UpdatePasswordUseCase';
import { SelectAestheticUseCase } from '../../application/use-cases/SelectAestheticUseCase';
import { GetUserProfileUseCase } from '../../application/use-cases/GetUserProfileUseCase';
import { UpdateUserProfileUseCase } from '../../application/use-cases/UpdateUserProfileUseCase';
import { SaveAestheticUseCase } from '../../application/use-cases/SaveAestheticUseCase';
import { AddFavoriteUseCase } from '../../application/use-cases/AddFavoriteUseCase';
import { RemoveFavoriteUseCase } from '../../application/use-cases/RemoveFavoriteUseCase';
import { GetUserFavoritesUseCase } from '../../application/use-cases/GetUserFavoritesUseCase';
import { CheckFavoriteUseCase } from '../../application/use-cases/CheckFavoriteUseCase';
import { CreateCollectionUseCase } from '../../application/use-cases/CreateCollectionUseCase';
import { GetUserCollectionsUseCase } from '../../application/use-cases/GetUserCollectionsUseCase';
import { GetCollectionWithItemsUseCase } from '../../application/use-cases/GetCollectionWithItemsUseCase';
import { UpdateCollectionUseCase } from '../../application/use-cases/UpdateCollectionUseCase';
import { DeleteCollectionUseCase } from '../../application/use-cases/DeleteCollectionUseCase';
import { AddToCollectionUseCase } from '../../application/use-cases/AddToCollectionUseCase';
import { RemoveFromCollectionUseCase } from '../../application/use-cases/RemoveFromCollectionUseCase';
import { CreateStyleBoardUseCase } from '../../application/use-cases/CreateStyleBoardUseCase';
import { GetUserStyleBoardsUseCase } from '../../application/use-cases/GetUserStyleBoardsUseCase';
import { GetStyleBoardByIdUseCase } from '../../application/use-cases/GetStyleBoardByIdUseCase';
import { UpdateStyleBoardUseCase } from '../../application/use-cases/UpdateStyleBoardUseCase';
import { DeleteStyleBoardUseCase } from '../../application/use-cases/DeleteStyleBoardUseCase';
import { AddStyleBoardItemUseCase } from '../../application/use-cases/AddStyleBoardItemUseCase';
import { RemoveStyleBoardItemUseCase } from '../../application/use-cases/RemoveStyleBoardItemUseCase';
import { UpdateStyleBoardItemUseCase } from '../../application/use-cases/UpdateStyleBoardItemUseCase';

export class UserRoutes {
    public static create(): Router {
        const router = Router();

        // Initialize repositories
        const userRepository = new TypeOrmUserRepository();
        const userProfileRepository = new TypeOrmUserProfileRepository();
        const favoriteRepository = new TypeOrmUserFavoriteRepository();
        const collectionRepository = new TypeOrmCollectionRepository();
        const collectionItemRepository = new TypeOrmCollectionItemRepository();
        const styleBoardRepository = new TypeOrmStyleBoardRepository();
        const productRepository = new TypeOrmProductRepository();

        // Initialize use cases - User
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

        // Initialize use cases - Favorites
        const addFavoriteUseCase = new AddFavoriteUseCase(favoriteRepository, productRepository);
        const removeFavoriteUseCase = new RemoveFavoriteUseCase(favoriteRepository);
        const getUserFavoritesUseCase = new GetUserFavoritesUseCase(favoriteRepository);
        const checkFavoriteUseCase = new CheckFavoriteUseCase(favoriteRepository);

        // Initialize use cases - Collections
        const createCollectionUseCase = new CreateCollectionUseCase(collectionRepository);
        const getUserCollectionsUseCase = new GetUserCollectionsUseCase(
            collectionRepository,
            collectionItemRepository
        );
        const getCollectionWithItemsUseCase = new GetCollectionWithItemsUseCase(
            collectionRepository,
            collectionItemRepository
        );
        const updateCollectionUseCase = new UpdateCollectionUseCase(collectionRepository);
        const deleteCollectionUseCase = new DeleteCollectionUseCase(collectionRepository);
        const addToCollectionUseCase = new AddToCollectionUseCase(
            collectionRepository,
            collectionItemRepository,
            productRepository
        );
        const removeFromCollectionUseCase = new RemoveFromCollectionUseCase(
            collectionRepository,
            collectionItemRepository
        );

        // Initialize use cases - Style Boards
        const createStyleBoardUseCase = new CreateStyleBoardUseCase(styleBoardRepository);
        const getUserStyleBoardsUseCase = new GetUserStyleBoardsUseCase(styleBoardRepository);
        const getStyleBoardByIdUseCase = new GetStyleBoardByIdUseCase(styleBoardRepository);
        const updateStyleBoardUseCase = new UpdateStyleBoardUseCase(styleBoardRepository);
        const deleteStyleBoardUseCase = new DeleteStyleBoardUseCase(styleBoardRepository);
        const addStyleBoardItemUseCase = new AddStyleBoardItemUseCase(
            styleBoardRepository,
            productRepository
        );
        const removeStyleBoardItemUseCase = new RemoveStyleBoardItemUseCase(styleBoardRepository);
        const updateStyleBoardItemUseCase = new UpdateStyleBoardItemUseCase(styleBoardRepository);

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

        const favoriteController = new UserFavoriteController(
            addFavoriteUseCase,
            removeFavoriteUseCase,
            getUserFavoritesUseCase,
            checkFavoriteUseCase
        );

        const collectionController = new CollectionController(
            createCollectionUseCase,
            getUserCollectionsUseCase,
            getCollectionWithItemsUseCase,
            updateCollectionUseCase,
            deleteCollectionUseCase,
            addToCollectionUseCase,
            removeFromCollectionUseCase
        );

        const styleBoardController = new StyleBoardController(
            createStyleBoardUseCase,
            getUserStyleBoardsUseCase,
            getStyleBoardByIdUseCase,
            updateStyleBoardUseCase,
            deleteStyleBoardUseCase,
            addStyleBoardItemUseCase,
            removeStyleBoardItemUseCase,
            updateStyleBoardItemUseCase
        );

        // Public routes
        router.post(
            '/register',
            UserValidator.registerRules(),
            userController.register
        );
        router.post('/login', UserValidator.loginRules(), userController.login);

        // Protected routes - User
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
        router.delete(
            '/aesthetic',
            AuthMiddleware.authenticate,
            userController.clearAesthetic
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

        // Favorites routes
        router.post(
            '/favorites',
            AuthMiddleware.authenticate,
            FavoriteValidator.addFavoriteRules(),
            favoriteController.addFavorite
        );
        router.get(
            '/favorites',
            AuthMiddleware.authenticate,
            favoriteController.getUserFavorites
        );
        router.delete(
            '/favorites/:productId',
            AuthMiddleware.authenticate,
            favoriteController.removeFavorite
        );
        router.get(
            '/favorites/check/:productId',
            AuthMiddleware.authenticate,
            favoriteController.checkFavorite
        );

        // Collections routes
        router.post(
            '/collections',
            AuthMiddleware.authenticate,
            CollectionValidator.createCollectionRules(),
            collectionController.createCollection
        );
        router.get(
            '/collections',
            AuthMiddleware.authenticate,
            collectionController.getUserCollections
        );
        router.get(
            '/collections/:id',
            AuthMiddleware.authenticate,
            collectionController.getCollectionById
        );
        router.put(
            '/collections/:id',
            AuthMiddleware.authenticate,
            CollectionValidator.updateCollectionRules(),
            collectionController.updateCollection
        );
        router.delete(
            '/collections/:id',
            AuthMiddleware.authenticate,
            collectionController.deleteCollection
        );
        router.post(
            '/collections/:id/items',
            AuthMiddleware.authenticate,
            CollectionValidator.addToCollectionRules(),
            collectionController.addToCollection
        );
        router.delete(
            '/collections/:id/items/:productId',
            AuthMiddleware.authenticate,
            collectionController.removeFromCollection
        );

        // Style Boards routes
        router.post(
            '/style-boards',
            AuthMiddleware.authenticate,
            StyleBoardValidator.createStyleBoardRules(),
            styleBoardController.createStyleBoard
        );
        router.get(
            '/style-boards',
            AuthMiddleware.authenticate,
            styleBoardController.getUserStyleBoards
        );
        router.get(
            '/style-boards/:id',
            AuthMiddleware.authenticate,
            styleBoardController.getStyleBoardById
        );
        router.put(
            '/style-boards/:id',
            AuthMiddleware.authenticate,
            StyleBoardValidator.updateStyleBoardRules(),
            styleBoardController.updateStyleBoard
        );
        router.delete(
            '/style-boards/:id',
            AuthMiddleware.authenticate,
            styleBoardController.deleteStyleBoard
        );
        router.post(
            '/style-boards/:id/items',
            AuthMiddleware.authenticate,
            StyleBoardValidator.addItemRules(),
            styleBoardController.addItem
        );
        router.delete(
            '/style-boards/:id/items/:productId',
            AuthMiddleware.authenticate,
            styleBoardController.removeItem
        );
        router.put(
            '/style-boards/:id/items/:productId',
            AuthMiddleware.authenticate,
            StyleBoardValidator.updateItemRules(),
            styleBoardController.updateItem
        );

        return router;
    }
}