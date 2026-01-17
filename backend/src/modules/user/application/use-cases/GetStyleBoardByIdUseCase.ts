import { IStyleBoardRepository } from '@modules/user/domain/repositories/IStyleBoardRepository';
import { StyleBoardResponseDto } from '../dto/StyleBoardDto';

export class GetStyleBoardByIdUseCase {
    constructor(private readonly styleBoardRepository: IStyleBoardRepository) {}

    async execute(userId: string, boardId: string): Promise<StyleBoardResponseDto> {
        const board = await this.styleBoardRepository.findById(boardId);
        
        if (!board) {
            throw new Error('Style board not found');
        }

        if (board.userId !== userId) {
            throw new Error('Unauthorized access to style board');
        }

        return {
            id: board.id,
            userId: board.userId,
            name: board.name,
            description: board.description,
            aestheticTags: board.aestheticTags,
            items: board.items,
            isPublic: board.isPublic,
            createdAt: board.createdAt,
            updatedAt: board.updatedAt
        };
    }
}