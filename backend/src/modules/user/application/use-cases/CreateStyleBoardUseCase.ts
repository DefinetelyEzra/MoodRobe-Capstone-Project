import { v4 as uuidv4 } from 'uuid';
import { IStyleBoardRepository } from '@modules/user/domain/repositories/IStyleBoardRepository';
import { StyleBoard } from '@modules/user/domain/entities/StyleBoard';
import { CreateStyleBoardDto, StyleBoardResponseDto } from '../dto/StyleBoardDto';

export class CreateStyleBoardUseCase {
    constructor(private readonly styleBoardRepository: IStyleBoardRepository) {}

    async execute(userId: string, dto: CreateStyleBoardDto): Promise<StyleBoardResponseDto> {
        const board = StyleBoard.create(
            uuidv4(),
            userId,
            dto.name,
            dto.description,
            dto.aestheticTags,
            dto.isPublic
        );

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