import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { IOrderLineRepository } from '../../domain/repositories/IOrderLineRepository';
import { IProductVariantRepository } from '../../../product/domain/repositories/IProductVariantRepository';
import { OrderNotFoundException, InvalidOrderStateException } from '../../domain/exceptions/OrderExceptions';

export class CancelOrderUseCase {
    constructor(
        private readonly orderRepository: IOrderRepository,
        private readonly orderLineRepository: IOrderLineRepository,
        private readonly variantRepository: IProductVariantRepository
    ) { }

    public async execute(orderId: string, userId: string): Promise<void> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new OrderNotFoundException(orderId);
        }

        // Verify user owns this order
        if (order.userId !== userId) {
            throw new OrderNotFoundException(orderId);
        }

        // Check if order can be cancelled
        if (!order.canBeCancelled()) {
            throw new InvalidOrderStateException(
                `Order cannot be cancelled in status: ${order.status}`
            );
        }

        // Cancel order
        order.cancel();
        await this.orderRepository.update(order);

        // Restore stock for all order lines
        const orderLines = await this.orderLineRepository.findByOrderId(orderId);
        for (const line of orderLines) {
            const variant = await this.variantRepository.findById(line.productVariantId);
            if (variant) {
                variant.increaseStock(line.quantity);
                await this.variantRepository.update(variant);
            }
        }
    }
}