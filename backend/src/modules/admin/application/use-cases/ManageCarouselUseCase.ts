import { TypeOrmCarouselRepository } from '../../infrastructure/persistence/repositories/TypeOrmCarouselRepository';
import { TypeOrmActivityLogRepository } from '../../infrastructure/persistence/repositories/TypeOrmActivityLogRepository';
import { CreateCarouselDto, UpdateCarouselDto, CarouselResponseDto } from '../dto/CarouselDto';
import { ContentNotFoundException } from '../../domain/exceptions/AdminExceptions';

export class ManageCarouselUseCase {
    constructor(
        private readonly carouselRepository: TypeOrmCarouselRepository,
        private readonly activityLogRepository: TypeOrmActivityLogRepository
    ) { }

    async getAll(): Promise<CarouselResponseDto[]> {
        return this.carouselRepository.findAll();
    }

    async getActive(): Promise<CarouselResponseDto[]> {
        return this.carouselRepository.findActive();
    }

    async create(dto: CreateCarouselDto, adminEmail: string): Promise<CarouselResponseDto> {
        const carousel = await this.carouselRepository.create({
            imageUrl: dto.imageUrl,
            title: dto.title,
            subtitle: dto.subtitle,
            linkUrl: dto.linkUrl,
            displayOrder: dto.displayOrder ?? 0,
            isActive: true
        });

        await this.activityLogRepository.create({
            adminEmail,
            action: 'create',
            resourceType: 'carousel',
            resourceId: carousel.id,
            details: { ...dto }
        });

        return carousel;
    }

    async update(id: string, dto: UpdateCarouselDto, adminEmail: string): Promise<CarouselResponseDto> {
        const existing = await this.carouselRepository.findById(id);
        if (!existing) {
            throw new ContentNotFoundException('Carousel item not found');
        }

        const updated = await this.carouselRepository.update(id, dto);
        if (!updated) {
            throw new ContentNotFoundException('Failed to update carousel item');
        }

        await this.activityLogRepository.create({
            adminEmail,
            action: 'update',
            resourceType: 'carousel',
            resourceId: id,
            details: { ...dto }
        });

        return updated;
    }

    async delete(id: string, adminEmail: string): Promise<void> {
        const existing = await this.carouselRepository.findById(id);
        if (!existing) {
            throw new ContentNotFoundException('Carousel item not found');
        }

        await this.carouselRepository.delete(id);

        await this.activityLogRepository.create({
            adminEmail,
            action: 'delete',
            resourceType: 'carousel',
            resourceId: id,
            details: { deletedItem: existing }
        });
    }
}