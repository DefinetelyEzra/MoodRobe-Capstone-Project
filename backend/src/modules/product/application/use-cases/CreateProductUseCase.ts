import { v4 as uuidv4 } from 'uuid';
import { Product } from '../../domain/entities/Product';
import { ProductVariant } from '../../domain/entities/ProductVariant';
import { ProductImage } from '../../domain/entities/ProductImage';
import { Money } from '@shared/domain/value-objects/Money';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { IProductVariantRepository } from '../../domain/repositories/IProductVariantRepository';
import { IProductImageRepository } from '../../domain/repositories/IProductImageRepository';
import { IMerchantStaffRepository } from '../../../merchant/domain/repositories/IMerchantStaffRepository';
import { UnauthorizedProductAccessException, DuplicateSkuException } from '../../domain/exceptions/ProductExceptions';
import { CreateProductDto, ProductResponseDto } from '../dto/CreateProductDto';

export class CreateProductUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly variantRepository: IProductVariantRepository,
        private readonly imageRepository: IProductImageRepository,
        private readonly merchantStaffRepository: IMerchantStaffRepository
    ) { }

    public async execute(
        dto: CreateProductDto,
        merchantId: string,
        userId: string
    ): Promise<ProductResponseDto> {
        // Verify user has permission to create products for this merchant
        await this.verifyUserPermission(merchantId, userId);

        // Validate SKUs are unique
        await this.validateSkus(dto.variants.map((v) => v.sku));

        // Create product
        const productId = uuidv4();
        const basePrice = new Money(dto.basePrice, dto.currency);
        const product = Product.create({
            id: productId,
            merchantId: merchantId,
            name: dto.name,
            description: dto.description,
            category: dto.category,
            basePrice: basePrice,
            aestheticTags: dto.aestheticTags || []
        });

        // Save product
        const savedProduct = await this.productRepository.save(product);

        // Create and save variants
        const variants = dto.variants.map((variantDto) => {
            const variantId = uuidv4();
            const variantPrice = new Money(variantDto.price, dto.currency);
            return ProductVariant.create({
                id: variantId,
                productId: productId,
                sku: variantDto.sku,
                size: variantDto.size || null,
                color: variantDto.color || null,
                price: variantPrice,
                stockQuantity: variantDto.stockQuantity
            });
        });
        const savedVariants = await this.variantRepository.saveMany(variants);

        // Create and save images if provided
        let savedImages: ProductImage[] = [];
        if (dto.images && dto.images.length > 0) {
            const images = dto.images.map((imageDto, index) => {
                const imageId = uuidv4();
                return ProductImage.create(
                    imageId,
                    productId,
                    imageDto.url,
                    imageDto.isPrimary || index === 0,
                    imageDto.displayOrder ?? index
                );
            });
            savedImages = await this.imageRepository.saveMany(images);
        }

        return this.toResponseDto(savedProduct, savedVariants, savedImages);
    }

    private async verifyUserPermission(merchantId: string, userId: string): Promise<void> {
        const staff = await this.merchantStaffRepository.findByMerchantAndUser(
            merchantId,
            userId
        );
        if (!staff) {
            throw new UnauthorizedProductAccessException(
                'You do not have permission to create products for this merchant'
            );
        }
        if (!staff.hasPermission('canManageProducts')) {
            throw new UnauthorizedProductAccessException(
                'You do not have permission to create products for this merchant'
            );
        }
    }

    private async validateSkus(skus: string[]): Promise<void> {
        for (const sku of skus) {
            const exists = await this.variantRepository.existsBySku(sku);
            if (exists) {
                throw new DuplicateSkuException(sku);
            }
        }
        // Check for duplicates within the input
        const uniqueSkus = new Set(skus);
        if (uniqueSkus.size !== skus.length) {
            throw new Error('Duplicate SKUs found in request');
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
                url: img.url,
                isPrimary: img.isPrimary,
                displayOrder: img.displayOrder,
            })),
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }
}