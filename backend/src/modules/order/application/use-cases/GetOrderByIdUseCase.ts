import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { IOrderLineRepository } from '../../domain/repositories/IOrderLineRepository';
import { IProductRepository } from '../../../product/domain/repositories/IProductRepository';
import { IProductVariantRepository } from '../../../product/domain/repositories/IProductVariantRepository';
import { OrderNotFoundException } from '../../domain/exceptions/OrderExceptions';
import { OrderResponseDto, OrderLineResponseDto } from '../dto/CreateOrderDto';
import { Order } from '../../domain/entities/Order';
import { OrderLine } from '../../domain/entities/OrderLine';

export class GetOrderByIdUseCase {
    constructor(
        private readonly orderRepository: IOrderRepository,
        private readonly orderLineRepository: IOrderLineRepository,
        private readonly productRepository: IProductRepository,
        private readonly variantRepository: IProductVariantRepository
    ) { }

    public async execute(orderId: string, userId: string): Promise<OrderResponseDto> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new OrderNotFoundException(orderId);
        }

        // Verify user owns this order
        if (order.userId !== userId) {
            throw new OrderNotFoundException(orderId);
        }

        const orderLines = await this.orderLineRepository.findByOrderId(orderId);

        return this.toResponseDto(order, orderLines);
    }

    private async toResponseDto(order: Order, orderLines: OrderLine[]): Promise<OrderResponseDto> {
        // Enrich order lines with product images
        const enrichedOrderLines: OrderLineResponseDto[] = await Promise.all(
            orderLines.map(async (line) => this.enrichOrderLine(line))
        );

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
            orderLines: enrichedOrderLines,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    }

    private async enrichOrderLine(line: OrderLine): Promise<OrderLineResponseDto> {
        const baseLineDto: OrderLineResponseDto = {
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
        };

        try {
            // Get variant to find product ID
            const variant = await this.variantRepository.findById(line.productVariantId);
            if (!variant) {
                return baseLineDto;
            }

            // Get product to access images
            const product = await this.productRepository.findById(variant.productId);
            if (!product) {
                return baseLineDto;
            }

            const images = product.getImages();
            if (images && images.length > 0) {
                const sortedImages = [...images].sort((a, b) => a.displayOrder - b.displayOrder);
                const primaryImage = sortedImages.find(img => img.isPrimary) || sortedImages[0];
                if (primaryImage) {
                    // Use imageUrl getter (which returns url property)
                    baseLineDto.imageUrl = primaryImage.imageUrl;
                }
            }
        } catch (error) {
            console.error('Failed to fetch product image for order line:', line.id, error);
            // Continue without image rather than failing the whole request
        }

        return baseLineDto;
    }
}