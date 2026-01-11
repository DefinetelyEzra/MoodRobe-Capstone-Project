import { TypeOrmAestheticRepository } from '@modules/aesthetic/infrastructure/persistence/repositories/TypeOrmAestheticRepository';
import { TypeOrmActivityLogRepository } from '../../infrastructure/persistence/repositories/TypeOrmActivityLogRepository';
import { AestheticNotFoundException } from '@modules/aesthetic/domain/exceptions/AestheticExceptions';
import { Aesthetic } from '@modules/aesthetic/domain/entities/Aeshtetic';

export class ManageAestheticImageUseCase {
    constructor(
        private readonly aestheticRepository: TypeOrmAestheticRepository,
        private readonly activityLogRepository: TypeOrmActivityLogRepository
    ) { }

    async updateImage(
        aestheticId: string,
        imageUrl: string,
        adminEmail: string
    ): Promise<Aesthetic> {
        const aesthetic = await this.aestheticRepository.findById(aestheticId);

        if (!aesthetic) {
            throw new AestheticNotFoundException(`Aesthetic with ID ${aestheticId} not found`);
        }

        const oldImageUrl = aesthetic.imageUrl;
        aesthetic.updateImageUrl(imageUrl);

        const updated = await this.aestheticRepository.update(aesthetic);

        await this.activityLogRepository.create({
            adminEmail,
            action: 'update',
            resourceType: 'aesthetic',
            resourceId: aestheticId,
            details: {
                field: 'imageUrl',
                oldValue: oldImageUrl || '',
                newValue: imageUrl,
                aestheticName: aesthetic.name
            }
        });

        return updated;
    }
}