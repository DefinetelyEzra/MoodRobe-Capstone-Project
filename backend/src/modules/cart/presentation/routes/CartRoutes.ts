import { Router } from 'express';
import { CartController } from '../controllers/CartController';
import { CartValidator } from '../validators/CartValidator';
import { AuthMiddleware } from '../../../user/presentation/middleware/AuthMiddleware';
import { TypeOrmCartRepository } from '../../infrastructure/persistence/repositories/TypeOrmCartRepository';
import { TypeOrmCartItemRepository } from '../../infrastructure/persistence/repositories/TypeOrmCartItemRepository';
import { TypeOrmProductRepository } from '../../../product/infrastructure/persistence/repositories/TypeOrmProductRepository';
import { TypeOrmProductVariantRepository } from '../../../product/infrastructure/persistence/repositories/TypeOrmProductVariantRepository';
import { GetOrCreateCartUseCase } from '../../application/use-cases/GetOrCreateCartUseCase';
import { AddItemToCartUseCase } from '../../application/use-cases/AddItemToCartUseCase';
import { UpdateCartItemQuantityUseCase } from '../../application/use-cases/UpdateCartItemQuantityUseCase';
import { RemoveItemFromCartUseCase } from '../../application/use-cases/RemoveItemFromCartUseCase';
import { ClearCartUseCase } from '../../application/use-cases/ClearCartUseCase';

export class CartRoutes {
    public static create(): Router {
        const router = Router();

        // Initialize repositories
        const cartRepository = new TypeOrmCartRepository();
        const cartItemRepository = new TypeOrmCartItemRepository();
        const productRepository = new TypeOrmProductRepository();
        const variantRepository = new TypeOrmProductVariantRepository();

        // Initialize use cases; pass product repositories to GetOrCreateCartUseCase
        const getOrCreateCartUseCase = new GetOrCreateCartUseCase(
            cartRepository,
            cartItemRepository,
            productRepository,
            variantRepository
        );
        const addItemToCartUseCase = new AddItemToCartUseCase(
            cartRepository,
            cartItemRepository,
            productRepository,
            variantRepository
        );
        const updateCartItemQuantityUseCase = new UpdateCartItemQuantityUseCase(
            cartRepository,
            cartItemRepository,
            variantRepository
        );
        const removeItemFromCartUseCase = new RemoveItemFromCartUseCase(
            cartRepository,
            cartItemRepository
        );
        const clearCartUseCase = new ClearCartUseCase(cartRepository, cartItemRepository);

        // Initialize controller
        const cartController = new CartController(
            getOrCreateCartUseCase,
            addItemToCartUseCase,
            updateCartItemQuantityUseCase,
            removeItemFromCartUseCase,
            clearCartUseCase
        );

        // All routes require authentication
        router.use(AuthMiddleware.authenticate);

        // Routes
        router.get('/', cartController.getCart);

        router.post('/items', CartValidator.addToCartRules(), cartController.addItem);

        router.put(
            '/items/:productVariantId',
            CartValidator.updateQuantityRules(),
            cartController.updateItemQuantity
        );

        router.delete('/items/:productVariantId', cartController.removeItem);

        router.delete('/', cartController.clearCart);

        return router;
    }
}