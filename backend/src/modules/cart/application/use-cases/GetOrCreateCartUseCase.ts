import { v4 as uuidv4 } from 'uuid';
import { Cart } from '../../domain/entities/Cart';
import { ICartRepository } from '../../domain/repositories/ICartRepository';
import { ICartItemRepository } from '../../domain/repositories/ICartItemRepository';
import { IProductRepository } from '../../../product/domain/repositories/IProductRepository';
import { IProductVariantRepository } from '../../../product/domain/repositories/IProductVariantRepository';
import { CartResponseDto, CartItemResponseDto } from '../dto/CartDto';
import { Money } from '@shared/domain/value-objects/Money';
import { CartItemEntity } from '../../infrastructure/entities/CartItemEntity';

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

        // Get cart item entities with imageUrl
        const entities = await this.getCartItemEntities(cart.id);

        const itemsWithDetails: CartItemResponseDto[] = items.map((item) => {
            // Find matching entity
            const entity = entities.find(e => e.id === item.id);

            const dto: CartItemResponseDto = {
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
                productId: entity?.productId,
                imageUrl: entity?.imageUrl,
                variantAttributes: entity?.variantAttributes
            };

            console.log('🛒 Cart item DTO:', {
                name: dto.productName,
                hasImage: !!dto.imageUrl,
                imageUrl: dto.imageUrl
            });

            return dto;
        });

        console.log('🛒 Returning cart response:', {
            cartId: cart.id,
            totalItems: itemsWithDetails.length,
            itemsWithImages: itemsWithDetails.filter(i => i.imageUrl).length
        });

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

    private async getCartItemEntities(cartId: string): Promise<CartItemEntity[]> {
        // Access the TypeORM repository directly to get entities with all fields
        if ('findEntitiesByCartId' in this.cartItemRepository) {
            return await (this.cartItemRepository as any).findEntitiesByCartId(cartId);
        }

        // Fallback: try to access repository directly
        const repo = (this.cartItemRepository as any).repository;
        if (repo) {
            return await repo.find({ where: { cartId } });
        }

        console.warn('⚠️ Cannot access cart item entities - images will not be loaded');
        return [];
    }
}