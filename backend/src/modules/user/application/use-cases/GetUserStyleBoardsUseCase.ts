import { IStyleBoardRepository } from '@modules/user/domain/repositories/IStyleBoardRepository';
import { StyleBoardResponseDto } from '../dto/StyleBoardDto';

export class GetUserStyleBoardsUseCase {
    constructor(private readonly styleBoardRepository: IStyleBoardRepository) {}

    async execute(userId: string): Promise<StyleBoardResponseDto[]> {
        const boards = await this.styleBoardRepository.findByUserId(userId);
        
        return boards.map(board => ({
            id: board.id,
            userId: board.userId,
            name: board.name,
            description: board.description,
            aestheticTags: board.aestheticTags,
            items: board.items,
            isPublic: board.isPublic,
            createdAt: board.createdAt,
            updatedAt: board.updatedAt
        }));
    }
}