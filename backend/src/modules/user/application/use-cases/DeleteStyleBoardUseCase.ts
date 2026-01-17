import { IStyleBoardRepository } from '@modules/user/domain/repositories/IStyleBoardRepository';

export class DeleteStyleBoardUseCase {
    constructor(private readonly styleBoardRepository: IStyleBoardRepository) {}

    async execute(userId: string, boardId: string): Promise<void> {
        const board = await this.styleBoardRepository.findById(boardId);
        
        if (!board) {
            throw new Error('Style board not found');
        }

        if (board.userId !== userId) {
            throw new Error('Unauthorized');
        }

        await this.styleBoardRepository.delete(boardId);
    }
}