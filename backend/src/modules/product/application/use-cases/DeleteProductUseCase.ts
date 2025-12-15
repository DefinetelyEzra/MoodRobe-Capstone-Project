import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { IProductVariantRepository } from '../../domain/repositories/IProductVariantRepository';
import { IProductImageRepository } from '../../domain/repositories/IProductImageRepository';
import { IMerchantStaffRepository } from '../../../merchant/domain/repositories/IMerchantStaffRepository';
import { ProductNotFoundException, UnauthorizedProductAccessException } from '../../domain/exceptions/ProductExceptions';

export class DeleteProductUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly variantRepository: IProductVariantRepository,
        private readonly imageRepository: IProductImageRepository,
        private readonly merchantStaffRepository: IMerchantStaffRepository
    ) { }

    public async execute(productId: string, userId: string): Promise<void> {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new ProductNotFoundException(productId);
        }

        // Verify user has permission
        await this.verifyUserPermission(product.merchantId, userId);

        // Delete related data
        await this.variantRepository.deleteByProductId(productId);
        await this.imageRepository.deleteByProductId(productId);

        // Delete product
        await this.productRepository.delete(productId);
    }

    private async verifyUserPermission(merchantId: string, userId: string): Promise<void> {
        const staff = await this.merchantStaffRepository.findByMerchantAndUser(
            merchantId,
            userId
        );
        if (!staff?.hasPermission('canManageProducts')) {
            throw new UnauthorizedProductAccessException(
                'You do not have permission to delete this product'
            );
        }
    }
}