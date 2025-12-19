import { ContentNotFoundException } from '@modules/admin/domain/exceptions/AdminExceptions';
import { TypeOrmActivityLogRepository } from '@modules/admin/infrastructure/persistence/repositories/TypeOrmActivityLogRepository';
import { TypeOrmContentRepository } from '../../infrastructure/persistence/repositories/TypeOrmContentRepository';
import { UpdateContentDto, ContentResponseDto } from '../dto/ContentDto';

export class ManageContentUseCase {
    constructor(
        private readonly contentRepository: TypeOrmContentRepository,
        private readonly activityLogRepository: TypeOrmActivityLogRepository
    ) { }

    async getAll(): Promise<ContentResponseDto[]> {
        return this.contentRepository.findAll();
    }

    async getBySectionKey(sectionKey: string): Promise<ContentResponseDto> {
        const content = await this.contentRepository.findBySectionKey(sectionKey);
        if (!content) {
            throw new ContentNotFoundException(`Content not found for section: ${sectionKey}`);
        }
        return content;
    }

    async update(sectionKey: string, dto: UpdateContentDto, adminEmail: string): Promise<ContentResponseDto> {
        const updated = await this.contentRepository.updateBySectionKey(
            sectionKey,
            dto.content,
            dto.metadata
        );

        if (!updated) {
            throw new ContentNotFoundException(`Content not found for section: ${sectionKey}`);
        }

        await this.activityLogRepository.create({
            adminEmail,
            action: 'update',
            resourceType: 'content',
            resourceId: updated.id,
            details: { sectionKey, ...dto }
        });

        return updated;
    }
}