import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { OrderNotFoundException, InvalidOrderStateException } from '../../domain/exceptions/OrderExceptions';
import { OrderStatus } from '../../domain/entities/Order';

export interface UpdateOrderStatusDto {
    status: OrderStatus;
}

export class UpdateOrderStatusUseCase {
    constructor(private readonly orderRepository: IOrderRepository) { }

    public async execute(orderId: string, dto: UpdateOrderStatusDto): Promise<void> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new OrderNotFoundException(orderId);
        }

        try {
            switch (dto.status) {
                case 'confirmed':
                    order.confirm();
                    break;
                case 'processing':
                    order.startProcessing();
                    break;
                case 'shipped':
                    order.ship();
                    break;
                case 'delivered':
                    order.deliver();
                    break;
                case 'cancelled':
                    order.cancel();
                    break;
                default:
                    throw new InvalidOrderStateException(`Invalid status: ${dto.status}`);
            }

            await this.orderRepository.update(order);
        } catch (error) {
            if (error instanceof Error) {
                throw new InvalidOrderStateException(error.message);
            }
            throw error;
        }
    }
}