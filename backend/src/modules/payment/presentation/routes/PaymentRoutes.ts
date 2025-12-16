import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { PaymentValidator } from '../validators/PaymentValidator';
import { AuthMiddleware } from '../../../user/presentation/middleware/AuthMiddleware';
import { TypeOrmPaymentRepository } from '../../infrastructure/persistence/repositories/TypeOrmPaymentRepository';
import { TypeOrmOrderRepository } from '../../../order/infrastructure/persistence/repositories/TypeOrmOrderRepository';
import { PaystackGateway } from '../../infrastructure/gateways/PaystackGateway';
import { InitiatePaymentUseCase } from '../../application/use-cases/InitiatePaymentUseCase';
import { VerifyPaymentUseCase } from '../../application/use-cases/VerifyPaymentUseCase';
import { GetPaymentByIdUseCase } from '../../application/use-cases/GetPaymentByIdUseCase';
import { GetPaymentsByOrderIdUseCase } from '../../application/use-cases/GetPaymentsByOrderIdUseCase';
import { ProcessRefundUseCase } from '../../application/use-cases/ProcessRefundUseCase';
import { HandlePaymentWebhookUseCase } from '../../application/use-cases/HandlePaymentWebhookUseCase';

export class PaymentRoutes {
    public static create(): Router {
        const router = Router();

        // Initialize repositories
        const paymentRepository = new TypeOrmPaymentRepository();
        const orderRepository = new TypeOrmOrderRepository();

        // Initialize payment gateway
        const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || '';
        const paymentGateway = new PaystackGateway(paystackSecretKey);

        // Initialize use cases
        const initiatePaymentUseCase = new InitiatePaymentUseCase(
            paymentRepository,
            orderRepository,
            paymentGateway
        );

        const verifyPaymentUseCase = new VerifyPaymentUseCase(
            paymentRepository,
            orderRepository,
            paymentGateway
        );

        const getPaymentByIdUseCase = new GetPaymentByIdUseCase(paymentRepository);

        const getPaymentsByOrderIdUseCase = new GetPaymentsByOrderIdUseCase(
            paymentRepository,
            orderRepository
        );

        const processRefundUseCase = new ProcessRefundUseCase(
            paymentRepository,
            orderRepository,
            paymentGateway
        );

        const handlePaymentWebhookUseCase = new HandlePaymentWebhookUseCase(
            paymentRepository,
            orderRepository,
            paymentGateway
        );

        // Initialize controller
        const paymentController = new PaymentController(
            initiatePaymentUseCase,
            verifyPaymentUseCase,
            getPaymentByIdUseCase,
            getPaymentsByOrderIdUseCase,
            processRefundUseCase,
            handlePaymentWebhookUseCase
        );

        // Public webhook route (no auth required)
        router.post('/webhook', paymentController.handleWebhook);

        // Protected routes
        router.post(
            '/initiate',
            AuthMiddleware.authenticate,
            PaymentValidator.initiatePaymentRules(),
            paymentController.initiatePayment
        );

        router.post(
            '/verify',
            AuthMiddleware.authenticate,
            PaymentValidator.verifyPaymentRules(),
            paymentController.verifyPayment
        );

        router.get(
            '/:id',
            AuthMiddleware.authenticate,
            PaymentValidator.getPaymentByIdRules(),
            paymentController.getPaymentById
        );

        router.get(
            '/order/:orderId',
            AuthMiddleware.authenticate,
            PaymentValidator.getPaymentsByOrderIdRules(),
            paymentController.getPaymentsByOrderId
        );

        router.post(
            '/:id/refund',
            AuthMiddleware.authenticate,
            PaymentValidator.refundPaymentRules(),
            paymentController.processRefund
        );

        return router;
    }
}