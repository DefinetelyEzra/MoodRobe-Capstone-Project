import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { Address } from '../../domain/value-objects/Address';
import { OrderNotFoundException, InvalidOrderStateException } from '../../domain/exceptions/OrderExceptions';
import { UpdateOrderShippingAddressDto } from '../dto/UpdateOrderDto';

export class UpdateShippingAddressUseCase {
    constructor(private readonly orderRepository: IOrderRepository) { }

    public async execute(
        orderId: string,
        dto: UpdateOrderShippingAddressDto,
        userId: string
    ): Promise<void> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new OrderNotFoundException(orderId);
        }

        // Verify user owns this order
        if (order.userId !== userId) {
            throw new OrderNotFoundException(orderId);
        }

        const newAddress = new Address(dto.shippingAddress);

        try {
            order.updateShippingAddress(newAddress);
            await this.orderRepository.update(order);
        } catch (error) {
            if (error instanceof Error) {
                throw new InvalidOrderStateException(error.message);
            }
            throw error;
        }
    }
}