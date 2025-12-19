import { TypeOrmActivityLogRepository } from '@modules/admin/infrastructure/persistence/repositories/TypeOrmActivityLogRepository';
import { ActivityLogResponseDto } from '../dto/ActivityLogResponseDto';

export class GetActivityLogUseCase {
    constructor(
        private readonly activityLogRepository: TypeOrmActivityLogRepository
    ) { }

    async getRecent(limit: number = 50): Promise<ActivityLogResponseDto[]> {
        return this.activityLogRepository.findRecent(limit);
    }

    async getByEmail(adminEmail: string, limit: number = 50): Promise<ActivityLogResponseDto[]> {
        return this.activityLogRepository.findByEmail(adminEmail, limit);
    }
}