import { IOrderRepository, OrderSearchCriteria } from '../../domain/repositories/IOrderRepository';
import { IOrderLineRepository } from '../../domain/repositories/IOrderLineRepository';
import { OrderResponseDto } from '../dto/CreateOrderDto';
import { Order, OrderStatus, PaymentStatus } from '../../domain/entities/Order';
import { OrderLine } from '../../domain/entities/OrderLine';

export interface SearchOrdersDto {
    userId?: string;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
    limit?: number;
    offset?: number;
}

export interface PaginatedOrdersResponse {
    orders: OrderResponseDto[];
    total: number;
    limit: number;
    offset: number;
}

export class SearchOrdersUseCase {
    constructor(
        private readonly orderRepository: IOrderRepository,
        private readonly orderLineRepository: IOrderLineRepository
    ) { }

    public async execute(dto: SearchOrdersDto): Promise<PaginatedOrdersResponse> {
        const limit = dto.limit || 20;
        const offset = dto.offset || 0;

        const criteria: OrderSearchCriteria = {
            userId: dto.userId,
            status: dto.status,
            paymentStatus: dto.paymentStatus,
            startDate: dto.startDate,
            endDate: dto.endDate,
            minAmount: dto.minAmount,
            maxAmount: dto.maxAmount,
        };

        const orders = await this.orderRepository.search(criteria, limit, offset);
        const total = await this.orderRepository.count(criteria);

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