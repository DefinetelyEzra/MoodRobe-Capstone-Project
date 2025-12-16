import { v4 as uuidv4 } from 'uuid';
import { CartItem } from '../../domain/entities/CartItem';
import { ICartRepository } from '../../domain/repositories/ICartRepository';
import { ICartItemRepository } from '../../domain/repositories/ICartItemRepository';
import { IProductRepository } from '../../../product/domain/repositories/IProductRepository';
import { IProductVariantRepository } from '../../../product/domain/repositories/IProductVariantRepository';
import { ProductNotAvailableException, InsufficientStockException } from '../../domain/exceptions/CartExceptions';
import { AddToCartDto, CartResponseDto } from '../dto/CartDto';
import { GetOrCreateCartUseCase } from './GetOrCreateCartUseCase';

export class AddItemToCartUseCase {
    private readonly getOrCreateCartUseCase: GetOrCreateCartUseCase;

    constructor(
        private readonly cartRepository: ICartRepository,
        private readonly cartItemRepository: ICartItemRepository,
        private readonly productRepository: IProductRepository,
        private readonly variantRepository: IProductVariantRepository
    ) {
        this.getOrCreateCartUseCase = new GetOrCreateCartUseCase(
            cartRepository,
            cartItemRepository
        );
    }

    public async execute(dto: AddToCartDto, userId: string): Promise<CartResponseDto> {
        // Get or create cart
        let cart = await this.cartRepository.findByUserId(userId);
        if (!cart) {
            const cartId = uuidv4();
            // Fixed: Remove duplicate save() call
            cart = await this.cartRepository.save(
                (await import('../../domain/entities/Cart')).Cart.create(cartId, userId)
            );
        }

        // Validate product variant exists and is available
        const variant = await this.variantRepository.findById(dto.productVariantId);
        if (!variant?.isActive) {
            throw new ProductNotAvailableException(dto.productVariantId);
        }

        // Get product details
        const product = await this.productRepository.findById(variant.productId);
        if (!product?.isActive) {
            throw new ProductNotAvailableException(dto.productVariantId);
        }

        // Check stock availability
        if (variant.stockQuantity < dto.quantity) {
            throw new InsufficientStockException(
                product.name,
                dto.quantity,
                variant.stockQuantity
            );
        }

        // Check if item already exists in cart
        const existingItem = await this.cartItemRepository.findByCartAndVariant(
            cart.id,
            dto.productVariantId
        );

        if (existingItem) {
            // Update existing item quantity
            const newQuantity = existingItem.quantity + dto.quantity;

            // Check stock for new quantity
            if (variant.stockQuantity < newQuantity) {
                throw new InsufficientStockException(
                    product.name,
                    newQuantity,
                    variant.stockQuantity
                );
            }

            existingItem.updateQuantity(newQuantity);
            await this.cartItemRepository.update(existingItem);
        } else {
            // Create new cart item
            const itemId = uuidv4();
            const unitPrice = variant.getPrice();
            const cartItem = CartItem.create(
                itemId,
                cart.id,
                dto.productVariantId,
                product.name,
                dto.quantity,
                unitPrice
            );

            await this.cartItemRepository.save(cartItem);
        }

        // Update cart timestamp
        cart.updatedAt = new Date();
        await this.cartRepository.update(cart);

        // Return updated cart
        return this.getOrCreateCartUseCase.execute(userId);
    }
}