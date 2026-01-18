import { ICartRepository } from '../../domain/repositories/ICartRepository';
import { ICartItemRepository } from '../../domain/repositories/ICartItemRepository';
import { IProductRepository } from '../../../product/domain/repositories/IProductRepository';
import { IProductVariantRepository } from '../../../product/domain/repositories/IProductVariantRepository';
import { CartItemNotFoundException, InsufficientStockException } from '../../domain/exceptions/CartExceptions';
import { UpdateCartItemDto, CartResponseDto } from '../dto/CartDto';
import { GetOrCreateCartUseCase } from './GetOrCreateCartUseCase';
import { CartItemMapper } from '../../infrastructure/persistence/mappers/CartItemMapper';

export class UpdateCartItemQuantityUseCase {
    private readonly getOrCreateCartUseCase: GetOrCreateCartUseCase;

    constructor(
        private readonly cartRepository: ICartRepository,
        private readonly cartItemRepository: ICartItemRepository,
        private readonly variantRepository: IProductVariantRepository,
        private readonly productRepository?: IProductRepository
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

        // Get the existing entity to preserve imageUrl and other fields
        const existingEntity = await this.cartItemRepository.findEntityByCartAndVariant(
            cart.id,
            productVariantId
        );

        // Update quantity
        cartItem.updateQuantity(dto.quantity);

        // Convert to entity
        const updatedEntity = CartItemMapper.toEntity(cartItem, cart.id);

        // Preserve the existing image and product data
        if (existingEntity) {
            updatedEntity.productId = existingEntity.productId;
            updatedEntity.imageUrl = existingEntity.imageUrl;
            updatedEntity.variantAttributes = existingEntity.variantAttributes;
        }

        // Save the entity instead of domain object to preserve imageUrl
        await this.cartItemRepository.saveEntity(updatedEntity);

        // Update cart timestamp
        cart.updatedAt = new Date();
        await this.cartRepository.update(cart);

        return this.getOrCreateCartUseCase.execute(userId);
    }
}