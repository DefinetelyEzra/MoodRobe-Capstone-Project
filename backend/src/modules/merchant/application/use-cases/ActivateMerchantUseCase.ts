import { IMerchantRepository } from '../../domain/repositories/IMerchantRepository';
import { MerchantNotFoundException } from '../../domain/exceptions/MerchantExceptions';

export class ActivateMerchantUseCase {
    constructor(private readonly merchantRepository: IMerchantRepository) { }

    public async execute(merchantId: string): Promise<void> {
        const merchant = await this.merchantRepository.findById(merchantId);
        if (!merchant) {
            throw new MerchantNotFoundException(merchantId);
        }

        merchant.activate();
        await this.merchantRepository.update(merchant);
    }
}