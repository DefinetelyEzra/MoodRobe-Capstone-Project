import { v4 as uuidv4 } from 'uuid';
import { Cart } from '../../domain/entities/Cart';
import { ICartRepository } from '../../domain/repositories/ICartRepository';
import { ICartItemRepository } from '../../domain/repositories/ICartItemRepository';
import { IProductRepository } from '../../../product/domain/repositories/IProductRepository';
import { IProductVariantRepository } from '../../../product/domain/repositories/IProductVariantRepository';
import { CartResponseDto, CartItemResponseDto } from '../dto/CartDto';
import { Money } from '@shared/domain/value-objects/Money';

export class GetOrCreateCartUseCase {
    constructor(
        private readonly cartRepository: ICartRepository,
        private readonly cartItemRepository: ICartItemRepository,
        private readonly productRepository?: IProductRepository,
        private readonly variantRepository?: IProductVariantRepository
    ) { }

    public async execute(userId: string): Promise<CartResponseDto> {
        let cart = await this.cartRepository.findByUserId(userId);

        if (!cart) {
            const cartId = uuidv4();
            cart = Cart.create(cartId, userId);
            cart = await this.cartRepository.save(cart);
        }

        // Load cart items
        const items = await this.cartItemRepository.findByCartId(cart.id);
        cart.setItems(items);

        return this.toResponseDto(cart);
    }

    private async toResponseDto(cart: Cart): Promise<CartResponseDto> {
        const items = cart.getItems();
        const subtotal = new Money(cart.calculateSubtotal());

        const itemsWithDetails: CartItemResponseDto[] = await Promise.all(
            items.map(async (item) => this.getItemDto(item))
        );

        return {
            id: cart.id,
            userId: cart.userId,
            items: itemsWithDetails,
            itemCount: cart.getItemCount(),
            subtotal: {
                amount: subtotal.getAmount(),
                currency: subtotal.getCurrency(),
            },
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
        };
    }

    private async getItemDto(item: any): Promise<CartItemResponseDto> {
        const baseItem: CartItemResponseDto = {
            id: item.id,
            productVariantId: item.productVariantId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: {
                amount: item.getUnitPrice().getAmount(),
                currency: item.getUnitPrice().getCurrency(),
            },
            lineTotal: {
                amount: item.getLineTotal().getAmount(),
                currency: item.getLineTotal().getCurrency(),
            },
            addedAt: item.addedAt,
        };

        if (!this.variantRepository || !this.productRepository) {
            return baseItem;
        }

        try {
            const variant = await this.variantRepository.findById(item.productVariantId);
            if (!variant) {
                return baseItem;
            }

            baseItem.productId = variant.productId;
            baseItem.variantAttributes = {
                ...(variant.size && { size: variant.size }),
                ...(variant.color && { color: variant.color })
            };

            const product = await this.productRepository.findById(variant.productId);
            if (!product) {
                return baseItem;
            }

            const images = product.getImages();
            if (!images || images.length === 0) {
                return baseItem;
            }

            const sortedImages = [...images].sort((a, b) => a.displayOrder - b.displayOrder);
            const primaryImage = sortedImages.find(img => img.isPrimary) || sortedImages[0];
            if (primaryImage) {
                baseItem.imageUrl = primaryImage.url;
            }
        } catch (error) {
            console.error('Failed to fetch product details for cart item:', error);
        }

        return baseItem;
    }
}