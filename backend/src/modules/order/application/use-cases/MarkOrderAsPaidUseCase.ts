import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { OrderNotFoundException } from '../../domain/exceptions/OrderExceptions';

export class MarkOrderAsPaidUseCase {
    constructor(private readonly orderRepository: IOrderRepository) { }

    public async execute(orderId: string): Promise<void> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new OrderNotFoundException(orderId);
        }

        order.markAsPaid();
        order.confirm(); // Auto-confirm when paid
        await this.orderRepository.update(order);
    }
}