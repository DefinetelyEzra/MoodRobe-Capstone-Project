import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { IMerchantStaffRepository } from '../../../merchant/domain/repositories/IMerchantStaffRepository';
import { ProductNotFoundException, UnauthorizedProductAccessException, DuplicateSkuException } from '../../domain/exceptions/ProductExceptions';
import { UpdateProductDto } from '../dto/UpdateProductDto';
import { ProductResponseDto } from '../dto/CreateProductDto';
import { Money } from '@shared/domain/value-objects/Money';
import { IProductVariantRepository } from '@modules/product/domain/repositories/IProductVariantRepository';
import { IProductImageRepository } from '../../domain/repositories/IProductImageRepository';
import { Product } from '../../domain/entities/Product';
import { ProductVariant } from '../../domain/entities/ProductVariant';
import { ProductImage } from '../../domain/entities/ProductImage';
import { v4 as uuidv4 } from 'uuid';

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

        // Update basic product fields
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
            const basePrice = this.parseMoney(dto.basePrice);
            product.updateBasePrice(basePrice);
        }

        if (dto.aestheticTags !== undefined) {
            product.setAestheticTags(dto.aestheticTags);
        }

        // Save updated product
        const updatedProduct = await this.productRepository.update(product);

        // Handle variants if provided
        let variants: ProductVariant[] = [];
        if (dto.variants === undefined) {
            // Load existing variants if not updating
            variants = await this.variantRepository.findByProductId(productId);
        } else {
            // If variants array is provided (even if empty), handle deletion
            variants = await this.handleVariants(productId, dto.variants ?? []);
        }

        // Handle images if provided
        let images: ProductImage[] = [];
        if (dto.images === undefined) {
            // Load existing images if not updating
            images = await this.imageRepository.findByProductId(productId);
        } else {
            // If images array is provided (even if empty), handle deletion
            images = await this.handleImages(productId, dto.images ?? []);
        }

        return this.toResponseDto(updatedProduct, variants, images);
    }

    private parseMoney(value: any): Money {
        return typeof value === 'number'
            ? new Money(value)
            : new Money(value.amount, value.currency);
    }

    private async checkForDuplicateSku(sku: string, variantId?: string): Promise<void> {
        const duplicate = await this.variantRepository.findBySku(sku);
        if (duplicate && (!variantId || duplicate.id !== variantId)) {
            throw new DuplicateSkuException(sku);
        }
    }

    private async handleVariants(
        productId: string,
        variantDtos: any[]
    ): Promise<ProductVariant[]> {
        const existingVariants = await this.variantRepository.findByProductId(productId);
        const existingMap = new Map(existingVariants.map(v => [v.id, v]));
        const updatedVariants: ProductVariant[] = [];
        const processedIds = new Set<string>();

        // Process provided variants (create/update)
        for (const variantDto of variantDtos) {
            await this.checkForDuplicateSku(variantDto.sku, variantDto.id);
            const price = this.parseMoney(variantDto.price);

            if (variantDto.id) {
                this.updateVariant(variantDto, price, existingMap, processedIds, updatedVariants);
            } else {
                await this.createVariant(variantDto, productId, price, updatedVariants);
            }
        }

        // Delete variants that were not in the update (removed by user)
        for (const existing of existingVariants) {
            if (!processedIds.has(existing.id)) {
                await this.variantRepository.delete(existing.id);
            }
        }

        return updatedVariants;
    }

    private updateVariant(
        variantDto: any,
        price: Money,
        existingMap: Map<string, ProductVariant>,
        processedIds: Set<string>,
        updatedVariants: ProductVariant[]
    ): void {
        const id = variantDto.id;
        processedIds.add(id);
        const existing = existingMap.get(id);
        if (!existing) {
            return;
        }
        existing.updatePrice(price);
        existing.updateStock(variantDto.stockQuantity);
        if (variantDto.size !== undefined) {
            existing.size = variantDto.size ?? null;
        }
        if (variantDto.color !== undefined) {
            existing.color = variantDto.color ?? null;
        }
        this.variantRepository.update(existing).then(updated => {
            updatedVariants.push(updated);
        });
    }

    private async createVariant(
        variantDto: any,
        productId: string,
        price: Money,
        updatedVariants: ProductVariant[]
    ): Promise<void> {
        const newVariant = ProductVariant.create({
            id: uuidv4(),
            productId: productId,
            sku: variantDto.sku,
            size: variantDto.size ?? null,
            color: variantDto.color ?? null,
            price: price,
            stockQuantity: variantDto.stockQuantity
        });
        const saved = await this.variantRepository.save(newVariant);
        updatedVariants.push(saved);
    }

    private async unsetExistingPrimariesIfNeeded(imageDtos: any[], existingImages: ProductImage[]): Promise<void> {
        const hasPrimary = imageDtos.some(dto => dto.isPrimary);
        if (hasPrimary) {
            for (const img of existingImages) {
                if (img.isPrimary) {
                    img.unsetAsPrimary();
                    await this.imageRepository.update(img);
                }
            }
        }
    }

    private async handleImages(
        productId: string,
        imageDtos: any[]
    ): Promise<ProductImage[]> {
        const existingImages = await this.imageRepository.findByProductId(productId);
        await this.unsetExistingPrimariesIfNeeded(imageDtos, existingImages);
        const existingMap = new Map(existingImages.map(img => [img.id, img]));
        const updatedImages: ProductImage[] = [];
        const processedIds = new Set<string>();
        let processedCount = 0;

        // Process provided images (create/update)
        for (const imageDto of imageDtos) {
            if (imageDto.id) {
                this.updateImage(imageDto, existingMap, processedIds, updatedImages, existingImages.length, processedCount);
                processedCount++;
            } else {
                const saved = await this.createImage(imageDto, productId, existingImages.length + processedCount);
                updatedImages.push(saved);
                processedCount++;
            }
        }

        // Delete images that were not in the update (removed by user)
        for (const existing of existingImages) {
            if (!processedIds.has(existing.id)) {
                await this.imageRepository.delete(existing.id);
            }
        }

        return updatedImages;
    }

    private updateImage(
        imageDto: any,
        existingMap: Map<string, ProductImage>,
        processedIds: Set<string>,
        updatedImages: ProductImage[],
        existingLength: number,
        processedCount: number
    ): void {
        const id = imageDto.id;
        processedIds.add(id);
        const existing = existingMap.get(id);
        if (!existing) {
            return;
        }
        existing.updateUrl(imageDto.imageUrl);
        if (imageDto.displayOrder !== undefined) {
            existing.updateDisplayOrder(imageDto.displayOrder);
        }
        if (imageDto.isPrimary) {
            existing.setAsPrimary();
        }
        this.imageRepository.update(existing).then(updated => {
            updatedImages.push(updated);
        });
    }

    private async createImage(
        imageDto: any,
        productId: string,
        defaultDisplayOrder: number
    ): Promise<ProductImage> {
        const displayOrder = imageDto.displayOrder ?? defaultDisplayOrder;
        const newImage = ProductImage.create(
            uuidv4(),
            productId,
            imageDto.imageUrl,
            imageDto.isPrimary ?? false,
            displayOrder
        );
        return await this.imageRepository.save(newImage);
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