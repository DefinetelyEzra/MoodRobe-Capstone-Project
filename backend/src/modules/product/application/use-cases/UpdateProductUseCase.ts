import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { IMerchantStaffRepository } from '../../../merchant/domain/repositories/IMerchantStaffRepository';
import { ProductNotFoundException, UnauthorizedProductAccessException } from '../../domain/exceptions/ProductExceptions';
import { UpdateProductDto } from '../dto/UpdateProductDto';
import { ProductResponseDto } from '../dto/CreateProductDto';
import { Money } from '@shared/domain/value-objects/Money';
import { IProductVariantRepository } from '@modules/product/domain/repositories/IProductVariantRepository';

import { IProductImageRepository } from '../../domain/repositories/IProductImageRepository';
import { Product } from '../../domain/entities/Product';
import { ProductVariant } from '../../domain/entities/ProductVariant';
import { ProductImage } from '../../domain/entities/ProductImage';
export class UpdateProductUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly variantRepository: IProductVariantRepository,
        private readonly imageRepository: IProductImageRepository,
        private readonly merchantStaffRepository: IMerchantStaffRepository
    ) { }
    public async execute(
        productId: string,
        dto: UpdateProductDto,
        userId: string
    ): Promise<ProductResponseDto> {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new ProductNotFoundException(productId);
        }
        // Verify user has permission
        await this.verifyUserPermission(product.merchantId, userId);

        // Update fields
        if (dto.name) {
            product.updateName(dto.name);
        }

        if (dto.description !== undefined) {
            product.updateDescription(dto.description);
        }

        if (dto.category) {
            product.updateCategory(dto.category);
        }

        if (dto.basePrice !== undefined) {
            const basePrice = new Money(dto.basePrice);
            product.updateBasePrice(basePrice);
        }

        if (dto.aestheticTags !== undefined) {
            product.setAestheticTags(dto.aestheticTags);
        }

        // Save updated product
        const updatedProduct = await this.productRepository.update(product);

        // Load variants and images
        const variants = await this.variantRepository.findByProductId(productId);
        const images = await this.imageRepository.findByProductId(productId);

        return this.toResponseDto(updatedProduct, variants, images);
    }
    private async verifyUserPermission(merchantId: string, userId: string): Promise<void> {
        const staff = await this.merchantStaffRepository.findByMerchantAndUser(
            merchantId,
            userId
        );
        if (!staff?.hasPermission('canManageProducts')) {
            throw new UnauthorizedProductAccessException(
                'You do not have permission to update this product'
            );
        }
    }
    private toResponseDto(
        product: Product,
        variants: ProductVariant[],
        images: ProductImage[]
    ): ProductResponseDto {
        return {
            id: product.id,
            merchantId: product.merchantId,
            name: product.name,
            description: product.description,
            category: product.category,
            basePrice: {
                amount: product.getBasePrice().getAmount(),
                currency: product.getBasePrice().getCurrency(),
            },
            aestheticTags: product.aestheticTags,
            isActive: product.isActive,
            variants: variants.map((v) => ({
                id: v.id,
                productId: v.productId,
                sku: v.sku,
                size: v.size,
                color: v.color,
                price: {
                    amount: v.getPrice().getAmount(),
                    currency: v.getPrice().getCurrency(),
                },
                stockQuantity: v.stockQuantity,
                isActive: v.isActive,
            })),
            images: images.map((img) => ({
                id: img.id,
                productId: img.productId,
                imageUrl: img.url,
                isPrimary: img.isPrimary,
                displayOrder: img.displayOrder,
            })),
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }
}