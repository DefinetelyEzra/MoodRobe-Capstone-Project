import { v4 as uuidv4 } from 'uuid';
import { CartItem } from '../../domain/entities/CartItem';
import { ICartRepository } from '../../domain/repositories/ICartRepository';
import { ICartItemRepository } from '../../domain/repositories/ICartItemRepository';
import { IProductRepository } from '../../../product/domain/repositories/IProductRepository';
import { IProductVariantRepository } from '../../../product/domain/repositories/IProductVariantRepository';
import { IProductImageRepository } from '../../../product/domain/repositories/IProductImageRepository';
import { ProductNotAvailableException, InsufficientStockException } from '../../domain/exceptions/CartExceptions';
import { AddToCartDto, CartResponseDto } from '../dto/CartDto';
import { GetOrCreateCartUseCase } from './GetOrCreateCartUseCase';
import { CartItemMapper } from '../../infrastructure/persistence/mappers/CartItemMapper';

export class AddItemToCartUseCase {
    private readonly getOrCreateCartUseCase: GetOrCreateCartUseCase;

    constructor(
        private readonly cartRepository: ICartRepository,
        private readonly cartItemRepository: ICartItemRepository,
        private readonly productRepository: IProductRepository,
        private readonly variantRepository: IProductVariantRepository,
        private readonly productImageRepository: IProductImageRepository
    ) {
        this.getOrCreateCartUseCase = new GetOrCreateCartUseCase(
            cartRepository,
            cartItemRepository,
            productRepository,
            variantRepository
        );
    }

    private async getProductPrimaryImage(productId: string): Promise<string | undefined> {
        try {
            const images = await this.productImageRepository.findByProductId(productId);

            if (!images || images.length === 0) {
                return undefined;
            }

            // Find primary image
            const primaryImage = images.find(img => img.isPrimary);
            if (primaryImage) {
                return primaryImage.imageUrl;
            }

            // Fallback to first image sorted by display order
            const sortedImages = [...images].sort((a, b) => a.displayOrder - b.displayOrder);
            return sortedImages[0]?.imageUrl;
        } catch (error) {
            console.error('Error fetching product images:', error);
            return undefined;
        }
    }

    public async execute(dto: AddToCartDto, userId: string): Promise<CartResponseDto> {
        // Get or create cart
        let cart = await this.cartRepository.findByUserId(userId);
        if (!cart) {
            const cartId = uuidv4();
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

        // Get product image
        const imageUrl = await this.getProductPrimaryImage(product.id);

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

            // Convert to entity and add additional fields
            const cartItemEntity = CartItemMapper.toEntity(cartItem, cart.id);
            cartItemEntity.productId = product.id;
            cartItemEntity.imageUrl = imageUrl;

            // Build variant attributes with proper type handling
            const variantAttributes: Record<string, string | number | boolean> = {
                sku: variant.sku
            };

            // Only add size if it exists and is not null
            if (variant.size !== null && variant.size !== undefined) {
                variantAttributes.size = variant.size;
            }

            // Only add color if it exists and is not null
            if (variant.color !== null && variant.color !== undefined) {
                variantAttributes.color = variant.color;
            }

            cartItemEntity.variantAttributes = variantAttributes;

            // Save the entity (with imageUrl and other fields) instead of domain object
            await this.cartItemRepository.saveEntity(cartItemEntity);
        }

        // Update cart timestamp
        cart.updatedAt = new Date();
        await this.cartRepository.update(cart);

        // Return updated cart with product details
        return this.getOrCreateCartUseCase.execute(userId);
    }
}