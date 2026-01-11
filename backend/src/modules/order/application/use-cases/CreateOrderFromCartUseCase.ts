import { v4 as uuidv4 } from 'uuid';
import { Order } from '../../domain/entities/Order';
import { OrderLine } from '../../domain/entities/OrderLine';
import { Address } from '../../domain/value-objects/Address';
import { OrderNumber } from '../../domain/value-objects/OrderNumber';
import { OrderCalculationService } from '../../domain/services/OrderCalculationService';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { IOrderLineRepository } from '../../domain/repositories/IOrderLineRepository';
import { ICartRepository } from '../../../cart/domain/repositories/ICartRepository';
import { ICartItemRepository } from '../../../cart/domain/repositories/ICartItemRepository';
import { IProductVariantRepository } from '../../../product/domain/repositories/IProductVariantRepository';
import { IProductImageRepository } from '../../../product/domain/repositories/IProductImageRepository';
import { CreateOrderDto, OrderResponseDto } from '../dto/CreateOrderDto';
import { EmptyCartException, InsufficientStockException } from '../../domain/exceptions/OrderExceptions';
import { OrderLineMapper } from '../../infrastructure/persistence/mappers/OrderLineMapper';

export class CreateOrderFromCartUseCase {
    private readonly calculationService: OrderCalculationService;

    constructor(
        private readonly orderRepository: IOrderRepository,
        private readonly orderLineRepository: IOrderLineRepository,
        private readonly cartRepository: ICartRepository,
        private readonly cartItemRepository: ICartItemRepository,
        private readonly variantRepository: IProductVariantRepository,
        private readonly productImageRepository: IProductImageRepository
    ) {
        this.calculationService = new OrderCalculationService();
    }

    private async getProductPrimaryImage(productId: string): Promise<string | undefined> {
        try {
            const images = await this.productImageRepository.findByProductId(productId);

            if (!images || images.length === 0) {
                return undefined;
            }

            const primaryImage = images.find(img => img.isPrimary);
            if (primaryImage) {
                return primaryImage.imageUrl;
            }

            // Create new array before sorting
            const sortedImages = [...images].sort((a, b) => a.displayOrder - b.displayOrder);
            return sortedImages[0]?.imageUrl;
        } catch (error) {
            console.error('Error fetching product images:', error);
            return undefined;
        }
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
            dto.shippingAddress.state
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
        const orderLineEntities: any[] = [];
        console.log('📝 Creating order lines...');

        for (const cartItem of cartItems) {
            // Get variant details
            const variant = await this.variantRepository.findById(cartItem.productVariantId);
            if (!variant) {
                console.error('❌ Variant not found:', cartItem.productVariantId);
                throw new Error(`Variant not found: ${cartItem.productVariantId}`);
            }

            // Get cart item entity from repository to retrieve stored image and product ID
            const cartItemEntity = await this.cartItemRepository.findByCartAndVariant(
                cart.id,
                cartItem.productVariantId
            );

            let imageUrl: string | undefined;

            // Try to get image from cart item entity first
            if (cartItemEntity && 'imageUrl' in cartItemEntity) {
                imageUrl = (cartItemEntity as any).imageUrl;
            }

            // If image not in cart item, fetch from product images
            if (!imageUrl && variant.productId) {
                imageUrl = await this.getProductPrimaryImage(variant.productId);
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

            // Convert to entity and add image URL
            const orderLineEntity = OrderLineMapper.toEntity(orderLine);
            orderLineEntity.imageUrl = imageUrl;
            orderLineEntities.push(orderLineEntity);

            console.log('📝 Order line created:', {
                productName: cartItem.productName,
                quantity: cartItem.quantity,
                hasImage: !!imageUrl
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

        // Save order lines with images
        console.log('💾 Saving order lines to database...');
        await this.orderLineRepository.saveMany(orderLines);
        console.log('✅ Order lines saved:', orderLines.length);

        // Clear cart
        console.log('🗑️ Clearing cart...');
        await this.cartRepository.clearCart(userId);
        console.log('✅ Cart cleared');

        console.log('🎉 Order creation completed successfully');
        return this.toResponseDto(savedOrder, orderLineEntities);
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

    private toResponseDto(order: Order, orderLineEntities: any[]): OrderResponseDto {
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
            orderLines: orderLineEntities.map((entity) => ({
                id: entity.id,
                productVariantId: entity.productVariantId,
                productName: entity.productName,
                variantDetails: entity.variantDetails,
                quantity: entity.quantity,
                unitPrice: {
                    amount: entity.unitPrice,
                    currency: 'NGN',
                },
                lineTotal: {
                    amount: entity.lineTotal,
                    currency: 'NGN',
                },
                imageUrl: entity.imageUrl,
            })),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    }
}