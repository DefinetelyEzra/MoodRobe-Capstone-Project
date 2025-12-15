import { v4 as uuidv4 } from 'uuid';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { IProductImageRepository } from '../../domain/repositories/IProductImageRepository';
import { IMerchantStaffRepository } from '../../../merchant/domain/repositories/IMerchantStaffRepository';
import { ProductNotFoundException, UnauthorizedProductAccessException } from '../../domain/exceptions/ProductExceptions';
import { ProductImage } from '../../domain/entities/ProductImage';
import { ImageResponseDto } from '../dto/CreateProductDto';

export interface AddImageDto {
    url: string;
    isPrimary?: boolean;
    displayOrder?: number;
}

export class AddProductImageUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly imageRepository: IProductImageRepository,
        private readonly merchantStaffRepository: IMerchantStaffRepository
    ) { }

    public async execute(
        productId: string,
        dto: AddImageDto,
        userId: string
    ): Promise<ImageResponseDto> {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new ProductNotFoundException(productId);
        }

        // Verify user has permission
        await this.verifyUserPermission(product.merchantId, userId);

        // If this is set as primary, unset other primary images
        if (dto.isPrimary) {
            await this.imageRepository.setPrimaryImage(productId, '');
        }

        // Create image
        const imageId = uuidv4();
        const image = ProductImage.create(
            imageId,
            productId,
            dto.url,
            dto.isPrimary || false,
            dto.displayOrder || 0
        );

        // Save
        const savedImage = await this.imageRepository.save(image);

        return this.toResponseDto(savedImage);
    }

    private async verifyUserPermission(merchantId: string, userId: string): Promise<void> {
        const staff = await this.merchantStaffRepository.findByMerchantAndUser(
            merchantId,
            userId
        );
        if (!staff?.hasPermission('canManageProducts')) {
            throw new UnauthorizedProductAccessException(
                'You do not have permission to manage product images'
            );
        }
    }

    private toResponseDto(image: ProductImage): ImageResponseDto {
        return {
            id: image.id,
            productId: image.productId,
            url: image.url,
            isPrimary: image.isPrimary,
            displayOrder: image.displayOrder,
        };
    }
}