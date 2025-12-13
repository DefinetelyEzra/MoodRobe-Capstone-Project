import { IAestheticRepository } from '../../domain/repositories/IAestheticRepository';
import { AestheticNotFoundException } from '../../domain/exceptions/AestheticExceptions';

export class DeleteAestheticUseCase {
    constructor(private readonly aestheticRepository: IAestheticRepository) { }

    public async execute(aestheticId: string): Promise<void> {
        const aesthetic = await this.aestheticRepository.findById(aestheticId);
        if (!aesthetic) {
            throw new AestheticNotFoundException(aestheticId);
        }

        await this.aestheticRepository.delete(aestheticId);
    }
}