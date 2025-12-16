import { ICartRepository } from '../../domain/repositories/ICartRepository';
import { ICartItemRepository } from '../../domain/repositories/ICartItemRepository';

export class ClearCartUseCase {
    constructor(
        private readonly cartRepository: ICartRepository,
        private readonly cartItemRepository: ICartItemRepository
    ) { }

    public async execute(userId: string): Promise<void> {
        const cart = await this.cartRepository.findByUserId(userId);
        if (!cart) {
            return; // Cart doesn't exist, nothing to clear
        }

        // Delete all cart items
        await this.cartItemRepository.deleteByCartId(cart.id);

        // Update cart timestamp
        cart.updatedAt = new Date();
        await this.cartRepository.update(cart);
    }
}