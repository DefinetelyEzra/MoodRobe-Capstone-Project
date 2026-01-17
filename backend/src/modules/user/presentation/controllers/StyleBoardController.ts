import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/AuthMiddleware';
import { CreateStyleBoardUseCase } from '../../application/use-cases/CreateStyleBoardUseCase';
import { GetUserStyleBoardsUseCase } from '../../application/use-cases/GetUserStyleBoardsUseCase';
import { GetStyleBoardByIdUseCase } from '../../application/use-cases/GetStyleBoardByIdUseCase';
import { UpdateStyleBoardUseCase } from '../../application/use-cases/UpdateStyleBoardUseCase';
import { DeleteStyleBoardUseCase } from '../../application/use-cases/DeleteStyleBoardUseCase';
import { AddStyleBoardItemUseCase } from '../../application/use-cases/AddStyleBoardItemUseCase';
import { RemoveStyleBoardItemUseCase } from '../../application/use-cases/RemoveStyleBoardItemUseCase';
import { UpdateStyleBoardItemUseCase } from '../../application/use-cases/UpdateStyleBoardItemUseCase';

export class StyleBoardController {
    constructor(
        private readonly createStyleBoardUseCase: CreateStyleBoardUseCase,
        private readonly getUserStyleBoardsUseCase: GetUserStyleBoardsUseCase,
        private readonly getStyleBoardByIdUseCase: GetStyleBoardByIdUseCase,
        private readonly updateStyleBoardUseCase: UpdateStyleBoardUseCase,
        private readonly deleteStyleBoardUseCase: DeleteStyleBoardUseCase,
        private readonly addStyleBoardItemUseCase: AddStyleBoardItemUseCase,
        private readonly removeStyleBoardItemUseCase: RemoveStyleBoardItemUseCase,
        private readonly updateStyleBoardItemUseCase: UpdateStyleBoardItemUseCase
    ) { }

    public createStyleBoard = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const result = await this.createStyleBoardUseCase.execute(req.userId, req.body);
            res.status(201).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getUserStyleBoards = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const result = await this.getUserStyleBoardsUseCase.execute(req.userId);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getStyleBoardById = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const result = await this.getStyleBoardByIdUseCase.execute(req.userId, id);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public updateStyleBoard = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const result = await this.updateStyleBoardUseCase.execute(req.userId, id, req.body);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public deleteStyleBoard = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            await this.deleteStyleBoardUseCase.execute(req.userId, id);
            res.status(200).json({ message: 'Style board deleted successfully' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public addItem = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            await this.addStyleBoardItemUseCase.execute(req.userId, id, req.body);
            res.status(201).json({ message: 'Item added to style board' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public removeItem = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id, productId } = req.params;
            await this.removeStyleBoardItemUseCase.execute(req.userId, id, productId);
            res.status(200).json({ message: 'Item removed from style board' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public updateItem = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id, productId } = req.params;
            await this.updateStyleBoardItemUseCase.execute(req.userId, id, productId, req.body);
            res.status(200).json({ message: 'Item updated successfully' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    private handleError(error: unknown, res: Response): void {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}