import { IMerchantRepository } from '../../domain/repositories/IMerchantRepository';
import { MerchantResponseDto } from '../dto/CreateMerchantDto';
import { Merchant } from '../../domain/entities/Merchant';

export interface GetAllMerchantsQuery {
    limit?: number;
    offset?: number;
    activeOnly?: boolean;
}

export interface PaginatedMerchantsResponse {
    merchants: MerchantResponseDto[];
    total: number;
    limit: number;
    offset: number;
}

export class GetAllMerchantsUseCase {
    constructor(private readonly merchantRepository: IMerchantRepository) { }

    public async execute(query: GetAllMerchantsQuery): Promise<PaginatedMerchantsResponse> {
        const limit = query.limit || 20;
        const offset = query.offset || 0;

        const merchants = query.activeOnly
            ? await this.merchantRepository.findActiveOnly(limit, offset)
            : await this.merchantRepository.findAll(limit, offset);

        const total = await this.merchantRepository.count();

        return {
            merchants: merchants.map(this.toResponseDto),
            total,
            limit,
            offset,
        };
    }

    private toResponseDto(merchant: Merchant): MerchantResponseDto {
        return {
            id: merchant.id,
            name: merchant.name,
            email: merchant.getEmail(),
            businessDetails: merchant.businessDetails.toJSON(),
            isActive: merchant.isActive,
            createdAt: merchant.createdAt,
            updatedAt: merchant.updatedAt,
        };
    }
}