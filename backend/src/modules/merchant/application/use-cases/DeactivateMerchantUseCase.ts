import { IMerchantRepository } from '../../domain/repositories/IMerchantRepository';
import { MerchantNotFoundException } from '../../domain/exceptions/MerchantExceptions';

export class DeactivateMerchantUseCase {
    constructor(private readonly merchantRepository: IMerchantRepository) { }

    public async execute(merchantId: string): Promise<void> {
        const merchant = await this.merchantRepository.findById(merchantId);
        if (!merchant) {
            throw new MerchantNotFoundException(merchantId);
        }

        merchant.deactivate();
        await this.merchantRepository.update(merchant);
    }
}