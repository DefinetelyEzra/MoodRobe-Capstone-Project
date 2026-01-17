import { IStyleBoardRepository } from '@modules/user/domain/repositories/IStyleBoardRepository';
import { UpdateStyleBoardItemDto } from '../dto/StyleBoardDto';

export class UpdateStyleBoardItemUseCase {
    constructor(private readonly styleBoardRepository: IStyleBoardRepository) {}

    async execute(userId: string, boardId: string, productId: string, dto: UpdateStyleBoardItemDto): Promise<void> {
        const board = await this.styleBoardRepository.findById(boardId);
        
        if (!board) {
            throw new Error('Style board not found');
        }

        if (board.userId !== userId) {
            throw new Error('Unauthorized');
        }

        board.updateItem(productId, dto);
        await this.styleBoardRepository.save(board);
    }
}