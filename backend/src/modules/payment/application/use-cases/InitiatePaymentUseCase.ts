import { v4 as uuidv4 } from 'uuid';
import { Payment } from '../../domain/entities/Payment';
import { IPaymentRepository } from '../../domain/repositories/IPaymentRepository';
import { IPaymentGateway } from '@modules/payment/domain/repositories/IPaymentGateway';
import { PaymentValidationService } from '../../domain/services/PaymentValidationService';
import { IOrderRepository } from '../../../order/domain/repositories/IOrderRepository';
import { PaymentMethod } from '../../domain/value-objects/PaymentMethod';
import { PaymentMetadata } from '../../domain/value-objects/PaymentMetadata';
import {
    InitiatePaymentDto,
    InitiatePaymentResponseDto
} from '../dto/InitiatePaymentDto';
import {
    OrderNotFoundException,
    PaymentGatewayException
} from '../../domain/exceptions/PaymentExceptions';

export class InitiatePaymentUseCase {
    private readonly validationService: PaymentValidationService;

    constructor(
        private readonly paymentRepository: IPaymentRepository,
        private readonly orderRepository: IOrderRepository,
        private readonly paymentGateway: IPaymentGateway
    ) {
        this.validationService = new PaymentValidationService();
    }

    public async execute(
        dto: InitiatePaymentDto,
        userId: string
    ): Promise<InitiatePaymentResponseDto> {
        // Fetch order
        const order = await this.orderRepository.findById(dto.orderId);
        if (!order) {
            throw new OrderNotFoundException(dto.orderId);
        }

        // Validate order belongs to user
        if (order.userId !== userId) {
            throw new Error('Unauthorized: Order does not belong to user');
        }

        // Create payment record
        const paymentId = uuidv4();
        const reference = `PAY-${Date.now()}-${uuidv4().substring(0, 8)}`;

        const paymentMethod = PaymentMethod.fromCard('unknown', '****');
        const metadata = new PaymentMetadata({
            userId,
            orderNumber: order.orderNumber,
            orderId: order.id
        });

        const payment = Payment.create(
            paymentId,
            order.id,
            'paystack',
            order.getTotal().getTotalAmount(),
            paymentMethod,
            metadata
        );

        // Save payment
        await this.paymentRepository.save(payment);

        // Initialize payment with gateway
        const callbackUrl = dto.callbackUrl || `${process.env.FRONTEND_URL}/payment/callback`;

        try {
            const initResult = await this.paymentGateway.initializePayment(
                order.getTotal().getTotalAmount(),
                metadata.get('customerEmail') || 'customer@example.com',
                reference,
                callbackUrl,
                {
                    orderId: order.id,
                    orderNumber: order.orderNumber,
                    userId
                }
            );

            // Update payment metadata with reference
            const updatedMetadata = metadata.set('reference', initResult.reference);
            payment.updateMetadata(updatedMetadata);
            await this.paymentRepository.update(payment);

            return {
                paymentId: payment.id,
                authorizationUrl: initResult.authorizationUrl,
                accessCode: initResult.accessCode,
                reference: initResult.reference,
                amount: {
                    amount: payment.amount.getAmount(),
                    currency: payment.amount.getCurrency()
                }
            };
        } catch (error) {
            // Mark payment as failed
            payment.markAsFailed();
            await this.paymentRepository.update(payment);

            if (error instanceof PaymentGatewayException) {
                throw error;
            }
            throw new PaymentGatewayException(
                'Paystack',
                error instanceof Error ? error.message : 'Unknown error'
            );
        }
    }
}