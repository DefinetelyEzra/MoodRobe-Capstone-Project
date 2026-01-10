import { IProductRepository, ProductSearchCriteria } from '../../domain/repositories/IProductRepository';
import { IProductVariantRepository } from '../../domain/repositories/IProductVariantRepository';
import { IProductImageRepository } from '../../domain/repositories/IProductImageRepository';
import { Product } from '../../domain/entities/Product';
import { ProductVariant } from '../../domain/entities/ProductVariant';
import { ProductImage } from '../../domain/entities/ProductImage';

export interface SearchProductsDto {
    merchantId?: string;
    category?: string;
    aestheticTags?: string[];
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
    searchTerm?: string;
    limit?: number;
    offset?: number;
}

export interface ProductSearchResultDto {
    id: string;
    merchantId: string;
    name: string;
    description: string;
    category: string;
    basePrice: {
        amount: number;
        currency: string;
    };
    aestheticTags: string[];
    isActive: boolean;
    variants: Array<{
        id: string;
        productId: string;
        sku: string;
        size: string | null;
        color: string | null;
        price: {
            amount: number;
            currency: string;
        };
        stockQuantity: number;
        isActive: boolean;
    }>;
    images: Array<{
        id: string;
        productId: string;
        imageUrl: string;
        isPrimary: boolean;
        displayOrder: number;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

export interface SearchProductsResponseDto {
    products: ProductSearchResultDto[];
    total: number;
    limit: number;
    offset: number;
}

export class SearchProductsUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly variantRepository: IProductVariantRepository,
        private readonly imageRepository: IProductImageRepository
    ) { }

    public async execute(dto: SearchProductsDto): Promise<SearchProductsResponseDto> {
        const criteria: ProductSearchCriteria = {
            merchantId: dto.merchantId,
            category: dto.category,
            aestheticTags: dto.aestheticTags,
            minPrice: dto.minPrice,
            maxPrice: dto.maxPrice,
            isActive: dto.isActive,
            searchTerm: dto.searchTerm,
        };

        const limit = dto.limit || 20;
        const offset = dto.offset || 0;

        // Search products
        const products = await this.productRepository.search(criteria, limit, offset);
        const total = await this.productRepository.count(criteria);

        // Load variants and images for all products
        const productDtos = await Promise.all(
            products.map(async (product) => {
                const [variants, images] = await Promise.all([
                    this.variantRepository.findByProductId(product.id),
                    this.imageRepository.findByProductId(product.id)
                ]);

                return this.toProductDto(product, variants, images);
            })
        );

        return {
            products: productDtos,
            total,
            limit,
            offset,
        };
    }

    private toProductDto(
        product: Product,
        variants: ProductVariant[],
        images: ProductImage[]
    ): ProductSearchResultDto {
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