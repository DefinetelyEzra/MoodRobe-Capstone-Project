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
        console.log('🔍 CreateOrderFromCartUseCase - Starting execution');
        console.log('📦 User ID:', userId);
        console.log('📦 DTO:', JSON.stringify(dto, null, 2));

        // Get user's cart
        console.log('🛒 Fetching cart for user:', userId);
        const cart = await this.cartRepository.findByUserId(userId);

        console.log('🛒 Cart retrieved:', {
            exists: !!cart,
            cartId: cart?.id,
            itemCount: cart?.getItems()?.length || 0,
            items: cart?.getItems()?.map(item => ({
                productName: item.productName,
                quantity: item.quantity,
                productVariantId: item.productVariantId
            }))
        });

        if (!cart) {
            console.error('❌ Cart not found for user:', userId);
            throw new EmptyCartException();
        }

        const cartItems = cart.getItems();
        console.log('📋 Cart items:', cartItems.length);

        if (cartItems.length === 0) {
            console.error('❌ Cart is empty for user:', userId);
            throw new EmptyCartException();
        }

        // Validate stock for all items
        console.log('✅ Validating stock for items...');
        await this.validateStock(cartItems);
        console.log('✅ Stock validation passed');

        // Calculate order totals 
        const orderItems = cartItems.map((item) => ({
            unitPrice: item.getUnitPrice(),
            quantity: item.quantity,
        }));

        console.log('💰 Calculating order total...');
        const orderTotal = this.calculationService.calculateTotal(
            orderItems,
            dto.discountPercentage || 0,
            dto.shippingAddress.state // Pass state for potential shipping calculation
        );
        console.log('💰 Order total calculated:', {
            subtotal: orderTotal.getSubtotal().getAmount(),
            shipping: orderTotal.getShipping().getAmount(),
            total: orderTotal.getTotalAmount().getAmount()
        });

        // Create shipping address
        const shippingAddress = new Address(dto.shippingAddress);

        // Generate order number
        const orderNumber = OrderNumber.generate();
        console.log('📋 Order number generated:', orderNumber.toString());

        // Create order
        const orderId = uuidv4();
        const order = Order.create(
            orderId,
            userId,
            orderNumber.toString(),
            orderTotal,
            shippingAddress
        );
        console.log('📦 Order entity created:', orderId);

        // Create order lines
        const orderLines: OrderLine[] = [];
        console.log('📝 Creating order lines...');

        for (const cartItem of cartItems) {
            const variant = await this.variantRepository.findById(cartItem.productVariantId);
            if (!variant) {
                console.error('❌ Variant not found:', cartItem.productVariantId);
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

            console.log('📝 Order line created:', {
                productName: cartItem.productName,
                quantity: cartItem.quantity
            });

            // Decrease stock
            variant.decreaseStock(cartItem.quantity);
            await this.variantRepository.update(variant);
            console.log('📉 Stock decreased for variant:', cartItem.productVariantId);
        }

        // Save order
        console.log('💾 Saving order to database...');
        const savedOrder = await this.orderRepository.save(order);
        console.log('✅ Order saved:', savedOrder.id);

        // Save order lines
        console.log('💾 Saving order lines to database...');
        await this.orderLineRepository.saveMany(orderLines);
        console.log('✅ Order lines saved:', orderLines.length);

        // Clear cart
        console.log('🗑️ Clearing cart...');
        await this.cartRepository.clearCart(userId);
        console.log('✅ Cart cleared');

        console.log('🎉 Order creation completed successfully');
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