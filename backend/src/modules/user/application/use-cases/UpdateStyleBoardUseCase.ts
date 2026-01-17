import { IStyleBoardRepository } from '@modules/user/domain/repositories/IStyleBoardRepository';
import { UpdateStyleBoardDto, StyleBoardResponseDto } from '../dto/StyleBoardDto';

export class UpdateStyleBoardUseCase {
    constructor(private readonly styleBoardRepository: IStyleBoardRepository) {}

    async execute(userId: string, boardId: string, dto: UpdateStyleBoardDto): Promise<StyleBoardResponseDto> {
        const board = await this.styleBoardRepository.findById(boardId);
        
        if (!board) {
            throw new Error('Style board not found');
        }

        if (board.userId !== userId) {
            throw new Error('Unauthorized');
        }

        if (dto.name !== undefined) {
            board.updateName(dto.name);
        }
        if (dto.description !== undefined) {
            board.updateDescription(dto.description);
        }
        if (dto.isPublic !== undefined && dto.isPublic !== board.isPublic) {
            board.toggleVisibility();
        }

        await this.styleBoardRepository.save(board);

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