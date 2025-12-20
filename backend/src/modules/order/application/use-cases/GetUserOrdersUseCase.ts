import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { IOrderLineRepository } from '../../domain/repositories/IOrderLineRepository';
import { OrderResponseDto } from '../dto/CreateOrderDto';
import { Order } from '../../domain/entities/Order';
import { OrderLine } from '../../domain/entities/OrderLine';

export interface PaginatedOrdersResponse {
    orders: OrderResponseDto[];
    total: number;
    limit: number;
    offset: number;
}

export class GetUserOrdersUseCase {
    constructor(
        private readonly orderRepository: IOrderRepository,
        private readonly orderLineRepository: IOrderLineRepository
    ) { }

    public async execute(
        userId: string,
        limit: number = 20,
        offset: number = 0
    ): Promise<PaginatedOrdersResponse> {
        const orders = await this.orderRepository.findByUserId(userId, limit, offset);
        const total = await this.orderRepository.count({ userId });

        // Load order lines for each order
        const ordersWithLines = await Promise.all(
            orders.map(async (order) => {
                const orderLines = await this.orderLineRepository.findByOrderId(order.id);
                return this.toResponseDto(order, orderLines);
            })
        );

        return {
            orders: ordersWithLines,
            total,
            limit,
            offset,
        };
    }

    private toResponseDto(order: Order, orderLines: OrderLine[]): OrderResponseDto {
        return {
            id: order.id,
            userId: order.userId,
            orderNumber: order.orderNumber,
            status: order.status,
            paymentStatus: order.paymentStatus,
            subtotal: {
                amount: order.getTotal().getSubtotal().getAmount(),
                currency: order.getTotal().getSubtotal().getCurrency(),
            },
            tax: {
                amount: order.getTotal().getTax().getAmount(),
                currency: order.getTotal().getTax().getCurrency(),
            },
            discount: {
                amount: order.getTotal().getDiscount().getAmount(),
                currency: order.getTotal().getDiscount().getCurrency(),
            },
            shipping: {
                amount: order.getTotal().getShipping().getAmount(),
                currency: order.getTotal().getShipping().getCurrency(),
            },
            totalAmount: {
                amount: order.getTotal().getTotalAmount().getAmount(),
                currency: order.getTotal().getTotalAmount().getCurrency(),
            },
            shippingAddress: order.shippingAddress.toJSON(),
            orderLines: orderLines.map((line) => ({
                id: line.id,
                productVariantId: line.productVariantId,
                productName: line.productName,
                variantDetails: line.variantDetails,
                quantity: line.quantity,
                unitPrice: {
                    amount: line.getUnitPrice().getAmount(),
                    currency: line.getUnitPrice().getCurrency(),
                },
                lineTotal: {
                    amount: line.getLineTotal().getAmount(),
                    currency: line.getLineTotal().getCurrency(),
                },
            })),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    }
}