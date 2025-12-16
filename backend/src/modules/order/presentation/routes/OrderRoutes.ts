import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { OrderValidator } from '../validators/OrderValidator';
import { AuthMiddleware } from '../../../user/presentation/middleware/AuthMiddleware';
import { TypeOrmOrderRepository } from '../../infrastructure/persistence/repositories/TypeOrmOrderRepository';
import { TypeOrmOrderLineRepository } from '../../infrastructure/persistence/repositories/TypeOrmOrderLineRepository';
import { TypeOrmCartRepository } from '@modules/cart/infrastructure/persistence/repositories/TypeOrmCartRepository';
import { TypeOrmProductVariantRepository } from '../../../product/infrastructure/persistence/repositories/TypeOrmProductVariantRepository';
import { CreateOrderFromCartUseCase } from '../../application/use-cases/CreateOrderFromCartUseCase';
import { GetOrderByIdUseCase } from '../../application/use-cases/GetOrderByIdUseCase';
import { GetUserOrdersUseCase } from '../../application/use-cases/GetUserOrdersUseCase';
import { UpdateOrderStatusUseCase } from '../../application/use-cases/UpdateOrderStatusUseCase';
import { CancelOrderUseCase } from '../../application/use-cases/CancelOrderUseCase';
import { UpdateShippingAddressUseCase } from '../../application/use-cases/UpdateShippingAddressUseCase';
import { MarkOrderAsPaidUseCase } from '../../application/use-cases/MarkOrderAsPaidUseCase';
import { SearchOrdersUseCase } from '../../application/use-cases/SearchOrdersUseCase';

export class OrderRoutes {
    public static create(): Router {
        const router = Router();

        // Initialize repositories
        const orderRepository = new TypeOrmOrderRepository();
        const orderLineRepository = new TypeOrmOrderLineRepository();
        const cartRepository = new TypeOrmCartRepository();
        const variantRepository = new TypeOrmProductVariantRepository();

        // Initialize use cases
        const createOrderFromCartUseCase = new CreateOrderFromCartUseCase(
            orderRepository,
            orderLineRepository,
            cartRepository,
            variantRepository
        );
        const getOrderByIdUseCase = new GetOrderByIdUseCase(
            orderRepository,
            orderLineRepository
        );
        const getUserOrdersUseCase = new GetUserOrdersUseCase(
            orderRepository,
            orderLineRepository
        );
        const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);
        const cancelOrderUseCase = new CancelOrderUseCase(
            orderRepository,
            orderLineRepository,
            variantRepository
        );
        const updateShippingAddressUseCase = new UpdateShippingAddressUseCase(
            orderRepository
        );
        const markOrderAsPaidUseCase = new MarkOrderAsPaidUseCase(orderRepository);
        const searchOrdersUseCase = new SearchOrdersUseCase(
            orderRepository,
            orderLineRepository
        );

        // Initialize controller
        const orderController = new OrderController(
            createOrderFromCartUseCase,
            getOrderByIdUseCase,
            getUserOrdersUseCase,
            updateOrderStatusUseCase,
            cancelOrderUseCase,
            updateShippingAddressUseCase,
            markOrderAsPaidUseCase,
            searchOrdersUseCase
        );

        // Protected routes
        router.post(
            '/',
            AuthMiddleware.authenticate,
            OrderValidator.createRules(),
            orderController.create
        );

        router.get(
            '/my-orders',
            AuthMiddleware.authenticate,
            OrderValidator.paginationRules(),
            orderController.getUserOrders
        );

        router.get(
            '/search',
            AuthMiddleware.authenticate,
            OrderValidator.searchRules(),
            orderController.search
        );

        router.get('/:id', AuthMiddleware.authenticate, orderController.getById);

        router.put(
            '/:id/status',
            AuthMiddleware.authenticate,
            OrderValidator.updateStatusRules(),
            orderController.updateStatus
        );

        router.post('/:id/cancel', AuthMiddleware.authenticate, orderController.cancel);

        router.put(
            '/:id/shipping-address',
            AuthMiddleware.authenticate,
            OrderValidator.updateShippingAddressRules(),
            orderController.updateShippingAddress
        );

        router.post('/:id/mark-paid', AuthMiddleware.authenticate, orderController.markAsPaid);

        return router;
    }
}