import { StyleBoard } from '../entities/StyleBoard';

export interface IStyleBoardRepository {
    save(board: StyleBoard): Promise<void>;
    findById(id: string): Promise<StyleBoard | null>;
    findByUserId(userId: string): Promise<StyleBoard[]>;
    delete(id: string): Promise<void>;
}