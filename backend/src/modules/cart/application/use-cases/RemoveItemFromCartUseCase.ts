import { ICartRepository } from '../../domain/repositories/ICartRepository';
import { ICartItemRepository } from '../../domain/repositories/ICartItemRepository';
import { IProductRepository } from '../../../product/domain/repositories/IProductRepository';
import { IProductVariantRepository } from '../../../product/domain/repositories/IProductVariantRepository';
import { CartItemNotFoundException } from '../../domain/exceptions/CartExceptions';
import { CartResponseDto } from '../dto/CartDto';
import { GetOrCreateCartUseCase } from './GetOrCreateCartUseCase';

export class RemoveItemFromCartUseCase {
    private readonly getOrCreateCartUseCase: GetOrCreateCartUseCase;

    constructor(
        private readonly cartRepository: ICartRepository,
        private readonly cartItemRepository: ICartItemRepository,
        private readonly productRepository?: IProductRepository,
        private readonly variantRepository?: IProductVariantRepository
    ) {
        this.getOrCreateCartUseCase = new GetOrCreateCartUseCase(
            cartRepository,
            cartItemRepository,
            productRepository,
            variantRepository
        );
    }

    public async execute(
        productVariantId: string,
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

        // Delete cart item
        await this.cartItemRepository.delete(cartItem.id);

        // Update cart timestamp
        cart.updatedAt = new Date();
        await this.cartRepository.update(cart);

        return this.getOrCreateCartUseCase.execute(userId);
    }
}