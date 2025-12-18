import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { IProductVariantRepository } from '../../domain/repositories/IProductVariantRepository';
import { IProductImageRepository } from '../../domain/repositories/IProductImageRepository';
import { ProductNotFoundException } from '../../domain/exceptions/ProductExceptions';
import { ProductResponseDto } from '../dto/CreateProductDto';
import { Product } from '../../domain/entities/Product';
import { ProductVariant } from '../../domain/entities/ProductVariant';
import { ProductImage } from '../../domain/entities/ProductImage';

export class GetProductByIdUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly variantRepository: IProductVariantRepository,
        private readonly imageRepository: IProductImageRepository
    ) { }

    public async execute(productId: string): Promise<ProductResponseDto> {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new ProductNotFoundException(productId);
        }

        const variants = await this.variantRepository.findByProductId(productId);
        const images = await this.imageRepository.findByProductId(productId);

        return this.toResponseDto(product, variants, images);
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
                altText: undefined,
                isPrimary: img.isPrimary,
                displayOrder: img.displayOrder,
            })),
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }
}