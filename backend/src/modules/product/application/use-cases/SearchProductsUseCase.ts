import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { IProductVariantRepository } from '../../domain/repositories/IProductVariantRepository';
import { IProductImageRepository } from '../../domain/repositories/IProductImageRepository';
import { SearchProductDto, PaginatedProductsResponse } from '../dto/SearchProductDto';
import { Product } from '../../domain/entities/Product';
import { ProductVariant } from '../../domain/entities/ProductVariant';
import { ProductImage } from '../../domain/entities/ProductImage';

export class SearchProductsUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly variantRepository: IProductVariantRepository,
        private readonly imageRepository: IProductImageRepository
    ) { }

    public async execute(dto: SearchProductDto): Promise<PaginatedProductsResponse> {
        const limit = dto.limit || 20;
        const offset = dto.offset || 0;

        const products = await this.productRepository.search(
            {
                merchantId: dto.merchantId,
                category: dto.category,
                aestheticTags: dto.aestheticTags,
                minPrice: dto.minPrice,
                maxPrice: dto.maxPrice,
                isActive: dto.isActive,
                searchTerm: dto.searchTerm,
            },
            limit,
            offset
        );

        const total = await this.productRepository.count({
            merchantId: dto.merchantId,
            category: dto.category,
            aestheticTags: dto.aestheticTags,
            minPrice: dto.minPrice,
            maxPrice: dto.maxPrice,
            isActive: dto.isActive,
            searchTerm: dto.searchTerm,
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