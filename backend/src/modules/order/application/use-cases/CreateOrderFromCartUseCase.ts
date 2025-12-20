import { v4 as uuidv4 } from 'uuid';
import { Order } from '../../domain/entities/Order';
import { OrderLine } from '../../domain/entities/OrderLine';
import { Address } from '../../domain/value-objects/Address';
import { OrderNumber } from '../../domain/value-objects/OrderNumber';
import { OrderCalculationService } from '../../domain/services/OrderCalculationService';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { IOrderLineRepository } from '../../domain/repositories/IOrderLineRepository';
import { ICartRepository } from '../../../cart/domain/repositories/ICartRepository';
import { IProductVariantRepository } from '../../../product/domain/repositories/IProductVariantRepository';
import { CreateOrderDto, OrderResponseDto } from '../dto/CreateOrderDto';
import { EmptyCartException, InsufficientStockException } from '../../domain/exceptions/OrderExceptions';

export class CreateOrderFromCartUseCase {
    private readonly calculationService: OrderCalculationService;

    constructor(
        private readonly orderRepository: IOrderRepository,
        private readonly orderLineRepository: IOrderLineRepository,
        private readonly cartRepository: ICartRepository,
        private readonly variantRepository: IProductVariantRepository
    ) {
        this.calculationService = new OrderCalculationService();
    }

    public async execute(
        dto: CreateOrderDto,
        userId: string
    ): Promise<OrderResponseDto> {
        // Get user's cart
        const cart = await this.cartRepository.findByUserId(userId);
        if (!cart || cart.getItems().length === 0) {
            throw new EmptyCartException();
        }

        // Validate stock for all items
        await this.validateStock(cart.getItems());

        // Calculate order totals (now includes shipping)
        const orderItems = cart.getItems().map((item) => ({
            unitPrice: item.getUnitPrice(),
            quantity: item.quantity,
        }));

        const orderTotal = this.calculationService.calculateTotal(
            orderItems,
            dto.discountPercentage || 0,
            dto.shippingAddress.state // Pass state for potential shipping calculation
        );

        // Create shipping address
        const shippingAddress = new Address(dto.shippingAddress);

        // Generate order number
        const orderNumber = OrderNumber.generate();

        // Create order
        const orderId = uuidv4();
        const order = Order.create(
            orderId,
            userId,
            orderNumber.toString(),
            orderTotal,
            shippingAddress
        );

        // Create order lines
        const orderLines: OrderLine[] = [];
        for (const cartItem of cart.getItems()) {
            const variant = await this.variantRepository.findById(cartItem.productVariantId);
            if (!variant) {
                throw new Error(`Variant not found: ${cartItem.productVariantId}`);
            }

            const orderLineId = uuidv4();
            const orderLine = OrderLine.create(
                orderLineId,
                orderId,
                cartItem.productVariantId,
                cartItem.productName,
                {
                    size: variant.size || undefined,
                    color: variant.color || undefined,
                    sku: variant.sku,
                },
                cartItem.quantity,
                cartItem.getUnitPrice()
            );
            orderLines.push(orderLine);

            // Decrease stock
            variant.decreaseStock(cartItem.quantity);
            await this.variantRepository.update(variant);
        }

        // Save order
        const savedOrder = await this.orderRepository.save(order);

        // Save order lines
        await this.orderLineRepository.saveMany(orderLines);

        // Clear cart
        await this.cartRepository.clearCart(userId);

        return this.toResponseDto(savedOrder, orderLines);
    }

    private async validateStock(cartItems: any[]): Promise<void> {
        for (const item of cartItems) {
            const variant = await this.variantRepository.findById(item.productVariantId);
            if (!variant) {
                throw new Error(`Variant not found: ${item.productVariantId}`);
            }

            if (variant.stockQuantity < item.quantity) {
                throw new InsufficientStockException(
                    item.productName,
                    item.quantity,
                    variant.stockQuantity
                );
            }
        }
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