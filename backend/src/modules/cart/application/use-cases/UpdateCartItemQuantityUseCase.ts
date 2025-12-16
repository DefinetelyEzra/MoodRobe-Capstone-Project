import { ICartRepository } from '../../domain/repositories/ICartRepository';
import { ICartItemRepository } from '../../domain/repositories/ICartItemRepository';
import { IProductVariantRepository } from '../../../product/domain/repositories/IProductVariantRepository';
import { CartItemNotFoundException, InsufficientStockException } from '../../domain/exceptions/CartExceptions';
import { UpdateCartItemDto, CartResponseDto } from '../dto/CartDto';
import { GetOrCreateCartUseCase } from './GetOrCreateCartUseCase';

export class UpdateCartItemQuantityUseCase {
    private readonly getOrCreateCartUseCase: GetOrCreateCartUseCase;

    constructor(
        private readonly cartRepository: ICartRepository,
        private readonly cartItemRepository: ICartItemRepository,
        private readonly variantRepository: IProductVariantRepository
    ) {
        this.getOrCreateCartUseCase = new GetOrCreateCartUseCase(
            cartRepository,
            cartItemRepository
        );
    }

    public async execute(
        productVariantId: string,
        dto: UpdateCartItemDto,
        userId: string
    ): Promise<CartResponseDto> {
        const cart = await this.cartRepository.findByUserId(userId);
        if (!cart) {
            throw new CartItemNotFoundException(productVariantId);
        }

        const cartItem = await this.cartItemRepository.findByCartAndVariant(
            cart.id,
            productVariantId
        );

        if (!cartItem) {
            throw new CartItemNotFoundException(productVariantId);
        }

        // Check stock availability
        const variant = await this.variantRepository.findById(productVariantId);
        if (variant && variant.stockQuantity < dto.quantity) {
            throw new InsufficientStockException(
                cartItem.productName,
                dto.quantity,
                variant.stockQuantity
            );
        }

        // Update quantity
        cartItem.updateQuantity(dto.quantity);
        await this.cartItemRepository.update(cartItem);

        // Update cart timestamp
        cart.updatedAt = new Date();
        await this.cartRepository.update(cart);

        return this.getOrCreateCartUseCase.execute(userId);
    }
}