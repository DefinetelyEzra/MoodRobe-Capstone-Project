import { IStyleBoardRepository } from '@modules/user/domain/repositories/IStyleBoardRepository';

export class RemoveStyleBoardItemUseCase {
    constructor(private readonly styleBoardRepository: IStyleBoardRepository) {}

    async execute(userId: string, boardId: string, productId: string): Promise<void> {
        const board = await this.styleBoardRepository.findById(boardId);
        
        if (!board) {
            throw new Error('Style board not found');
        }

        if (board.userId !== userId) {
            throw new Error('Unauthorized');
        }

        board.removeItem(productId);
        await this.styleBoardRepository.save(board);
    }
}