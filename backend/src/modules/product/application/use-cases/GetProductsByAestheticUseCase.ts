import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { IProductVariantRepository } from '../../domain/repositories/IProductVariantRepository';
import { IProductImageRepository } from '../../domain/repositories/IProductImageRepository';
import { PaginatedProductsResponse } from '../dto/SearchProductDto';
import { Product } from '../../domain/entities/Product';
import { ProductVariant } from '../../domain/entities/ProductVariant';
import { ProductImage } from '../../domain/entities/ProductImage';

export class GetProductsByAestheticUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly variantRepository: IProductVariantRepository,
        private readonly imageRepository: IProductImageRepository
    ) { }

    public async execute(
        aestheticId: string,
        limit: number = 20,
        offset: number = 0
    ): Promise<PaginatedProductsResponse> {
        const products = await this.productRepository.findByAestheticTag(
            aestheticId,
            limit,
            offset
        );

        const total = await this.productRepository.count({
            aestheticTags: [aestheticId],
            isActive: true,
        });

        // Load variants and images for each product
        const productsWithDetails = await Promise.all(
            products.map(async (product) => {
                const variants = await this.variantRepository.findByProductId(product.id);
                const images = await this.imageRepository.findByProductId(product.id);
                return this.toResponseDto(product, variants, images);
            })
        );

        return {
            products: productsWithDetails,
            total,
            limit,
            offset,
        };
    }

    private toResponseDto(
        product: Product,
        variants: ProductVariant[],
        images: ProductImage[]
    ): any {
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
                url: img.url,
                isPrimary: img.isPrimary,
                displayOrder: img.displayOrder,
            })),
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }
}