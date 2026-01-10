import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { IProductVariantRepository } from '../../domain/repositories/IProductVariantRepository';
import { IProductImageRepository } from '../../domain/repositories/IProductImageRepository';
import { Product } from '../../domain/entities/Product';
import { ProductVariant } from '../../domain/entities/ProductVariant';
import { ProductImage } from '../../domain/entities/ProductImage';

export interface ProductsByAestheticResponseDto {
    products: Array<{
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
    }>;
    total: number;
}

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
    ): Promise<ProductsByAestheticResponseDto> {
        const products = await this.productRepository.findByAestheticTag(
            aestheticId,
            limit,
            offset
        );

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
            total: products.length,
        };
    }

    private toProductDto(
        product: Product,
        variants: ProductVariant[],
        images: ProductImage[]
    ) {
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