import { IProductVariantRepository } from '../../domain/repositories/IProductVariantRepository';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { IMerchantStaffRepository } from '../../../merchant/domain/repositories/IMerchantStaffRepository';
import { ProductVariantNotFoundException, UnauthorizedProductAccessException } from '../../domain/exceptions/ProductExceptions';
import { VariantResponseDto } from '../dto/CreateProductDto';
import { ProductVariant } from '../../domain/entities/ProductVariant';

export interface UpdateStockDto {
    stockQuantity: number;
}

export class UpdateVariantStockUseCase {
    constructor(
        private readonly variantRepository: IProductVariantRepository,
        private readonly productRepository: IProductRepository,
        private readonly merchantStaffRepository: IMerchantStaffRepository
    ) { }

    public async execute(
        variantId: string,
        dto: UpdateStockDto,
        userId: string
    ): Promise<VariantResponseDto> {
        const variant = await this.variantRepository.findById(variantId);
        if (!variant) {
            throw new ProductVariantNotFoundException(variantId);
        }

        // Get product to verify permission
        const product = await this.productRepository.findById(variant.productId);
        if (!product) {
            throw new ProductVariantNotFoundException(variantId);
        }

        // Verify user has permission
        await this.verifyUserPermission(product.merchantId, userId);

        // Update stock
        variant.updateStock(dto.stockQuantity);

        // Save
        const updatedVariant = await this.variantRepository.update(variant);

        return this.toResponseDto(updatedVariant);
    }

    private async verifyUserPermission(merchantId: string, userId: string): Promise<void> {
        const staff = await this.merchantStaffRepository.findByMerchantAndUser(
            merchantId,
            userId
        );
        if (!staff?.hasPermission('canManageProducts')) {
            throw new UnauthorizedProductAccessException(
                'You do not have permission to update stock'
            );
        }
    }

    private toResponseDto(variant: ProductVariant): VariantResponseDto {
        return {
            id: variant.id,
            productId: variant.productId,
            sku: variant.sku,
            size: variant.size,
            color: variant.color,
            price: {
                amount: variant.getPrice().getAmount(),
                currency: variant.getPrice().getCurrency(),
            },
            stockQuantity: variant.stockQuantity,
            isActive: variant.isActive,
        };
    }
}