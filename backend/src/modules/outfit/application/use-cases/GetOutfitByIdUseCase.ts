import { IOutfitRepository } from '../../domain/repositories/IOutfitRepository';
import { IProductRepository } from '../../../product/domain/repositories/IProductRepository';
import { IProductImageRepository } from '../../../product/domain/repositories/IProductImageRepository';
import { OutfitNotFoundException, UnauthorizedOutfitAccessException } from '../../domain/exceptions/OutfitExceptions';
import { Outfit } from '../../domain/entities/Outfit';
import { OutfitResponseDto, OutfitItemDetail } from '../dto/OutfitDto';

export class GetOutfitByIdUseCase {
    constructor(
        private readonly outfitRepository: IOutfitRepository,
        private readonly productRepository?: IProductRepository,
        private readonly imageRepository?: IProductImageRepository
    ) { }

    public async execute(outfitId: string, userId?: string): Promise<OutfitResponseDto> {
        const outfit = await this.outfitRepository.findById(outfitId);

        if (!outfit) {
            throw new OutfitNotFoundException(outfitId);
        }

        // Check access permissions
        if (!outfit.isPublic && outfit.userId !== userId) {
            throw new UnauthorizedOutfitAccessException();
        }

        return this.toResponseDto(outfit);
    }

    private async toResponseDto(outfit: Outfit): Promise<OutfitResponseDto> {
        const baseDto: OutfitResponseDto = {
            id: outfit.id,
            userId: outfit.userId,
            name: outfit.name,
            description: outfit.description,
            outfitType: outfit.outfitType,
            items: outfit.getItems(),
            aestheticTags: outfit.aestheticTags,
            isPublic: outfit.isPublic,
            createdAt: outfit.createdAt,
            updatedAt: outfit.updatedAt,
        };

        if (this.productRepository && this.imageRepository) {
            baseDto.itemDetails = await this.getItemDetails(outfit);
        }

        return baseDto;
    }

    private async getItemDetails(outfit: Outfit): Promise<OutfitItemDetail[]> {
        if (!this.productRepository || !this.imageRepository) {
            return [];
        }

        const items = outfit.getItems();
        const details: OutfitItemDetail[] = [];

        for (const [slot, productId] of Object.entries(items)) {
            try {
                const product = await this.productRepository.findById(productId);
                if (!product) continue;

                const images = await this.imageRepository.findByProductId(productId);
                const primaryImage = images.find((img) => img.isPrimary) || images[0];

                details.push({
                    slot,
                    productId: product.id,
                    productName: product.name,
                    imageUrl: primaryImage?.url,
                    category: product.category,
                    price: {
                        amount: product.getBasePrice().getAmount(),
                        currency: product.getBasePrice().getCurrency(),
                    },
                });
            } catch (error) {
                console.error(`Failed to fetch details for product ${productId}:`, error);
            }
        }

        return details;
    }
}