import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/AuthMiddleware';
import { CreateCollectionUseCase } from '../../application/use-cases/CreateCollectionUseCase';
import { GetUserCollectionsUseCase } from '../../application/use-cases/GetUserCollectionsUseCase';
import { GetCollectionWithItemsUseCase } from '../../application/use-cases/GetCollectionWithItemsUseCase';
import { UpdateCollectionUseCase } from '../../application/use-cases/UpdateCollectionUseCase';
import { DeleteCollectionUseCase } from '../../application/use-cases/DeleteCollectionUseCase';
import { AddToCollectionUseCase } from '../../application/use-cases/AddToCollectionUseCase';
import { RemoveFromCollectionUseCase } from '../../application/use-cases/RemoveFromCollectionUseCase';

export class CollectionController {
    constructor(
        private readonly createCollectionUseCase: CreateCollectionUseCase,
        private readonly getUserCollectionsUseCase: GetUserCollectionsUseCase,
        private readonly getCollectionWithItemsUseCase: GetCollectionWithItemsUseCase,
        private readonly updateCollectionUseCase: UpdateCollectionUseCase,
        private readonly deleteCollectionUseCase: DeleteCollectionUseCase,
        private readonly addToCollectionUseCase: AddToCollectionUseCase,
        private readonly removeFromCollectionUseCase: RemoveFromCollectionUseCase
    ) {}

    public createCollection = async (req: AuthRequest, res: Response): Promise<void> => {
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

            const result = await this.createCollectionUseCase.execute(req.userId, req.body);
            res.status(201).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getUserCollections = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const result = await this.getUserCollectionsUseCase.execute(req.userId);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getCollectionById = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const result = await this.getCollectionWithItemsUseCase.execute(req.userId, id);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public updateCollection = async (req: AuthRequest, res: Response): Promise<void> => {
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
            const result = await this.updateCollectionUseCase.execute(req.userId, id, req.body);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public deleteCollection = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            await this.deleteCollectionUseCase.execute(req.userId, id);
            res.status(200).json({ message: 'Collection deleted successfully' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public addToCollection = async (req: AuthRequest, res: Response): Promise<void> => {
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
            await this.addToCollectionUseCase.execute(req.userId, id, req.body);
            res.status(201).json({ message: 'Product added to collection' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public removeFromCollection = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id, productId } = req.params;
            await this.removeFromCollectionUseCase.execute(req.userId, id, productId);
            res.status(200).json({ message: 'Product removed from collection' });
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