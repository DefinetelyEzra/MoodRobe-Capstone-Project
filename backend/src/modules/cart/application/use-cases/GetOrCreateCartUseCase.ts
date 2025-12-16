import { v4 as uuidv4 } from 'uuid';
import { Cart } from '../../domain/entities/Cart';
import { ICartRepository } from '../../domain/repositories/ICartRepository';
import { ICartItemRepository } from '../../domain/repositories/ICartItemRepository';
import { CartResponseDto } from '../dto/CartDto';
import { Money } from '@shared/domain/value-objects/Money';

export class GetOrCreateCartUseCase {
    constructor(
        private readonly cartRepository: ICartRepository,
        private readonly cartItemRepository: ICartItemRepository
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

    private toResponseDto(cart: Cart): CartResponseDto {
        const items = cart.getItems();
        const subtotal = new Money(cart.calculateSubtotal());

        return {
            id: cart.id,
            userId: cart.userId,
            items: items.map((item) => ({
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
            })),
            itemCount: cart.getItemCount(),
            subtotal: {
                amount: subtotal.getAmount(),
                currency: subtotal.getCurrency(),
            },
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
        };
    }
}