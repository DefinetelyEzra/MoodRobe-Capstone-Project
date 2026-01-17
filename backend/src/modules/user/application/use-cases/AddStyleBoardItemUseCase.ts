import { IStyleBoardRepository } from '@modules/user/domain/repositories/IStyleBoardRepository';
import { IProductRepository } from '@modules/product/domain/repositories/IProductRepository';
import { AddStyleBoardItemDto } from '../dto/StyleBoardDto';

export class AddStyleBoardItemUseCase {
    constructor(
        private readonly styleBoardRepository: IStyleBoardRepository,
        private readonly productRepository: IProductRepository
    ) {}

    async execute(userId: string, boardId: string, dto: AddStyleBoardItemDto): Promise<void> {
        const board = await this.styleBoardRepository.findById(boardId);
        
        if (!board) {
            throw new Error('Style board not found');
        }

        if (board.userId !== userId) {
            throw new Error('Unauthorized');
        }

        const product = await this.productRepository.findById(dto.productId);
        if (!product) {
            throw new Error('Product not found');
        }

        board.addItem({
            productId: dto.productId,
            position: dto.position,
            note: dto.note
        });

        await this.styleBoardRepository.save(board);
    }
}