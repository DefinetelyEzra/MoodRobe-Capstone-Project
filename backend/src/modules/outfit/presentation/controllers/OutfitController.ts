import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../../../user/presentation/middleware/AuthMiddleware';
import { CreateOutfitUseCase } from '../../application/use-cases/CreateOutfitUseCase';
import { GetUserOutfitsUseCase } from '../../application/use-cases/GetUserOutfitsUseCase';
import { GetOutfitByIdUseCase } from '../../application/use-cases/GetOutfitByIdUseCase';
import { UpdateOutfitUseCase } from '../../application/use-cases/UpdateOutfitUseCase';
import { DeleteOutfitUseCase } from '../../application/use-cases/DeleteOutfitUseCase';
import {
    OutfitNotFoundException,
    UnauthorizedOutfitAccessException,
    InvalidOutfitDataException,
} from '../../domain/exceptions/OutfitExceptions';

export class OutfitController {
    constructor(
        private readonly createOutfitUseCase: CreateOutfitUseCase,
        private readonly getUserOutfitsUseCase: GetUserOutfitsUseCase,
        private readonly getOutfitByIdUseCase: GetOutfitByIdUseCase,
        private readonly updateOutfitUseCase: UpdateOutfitUseCase,
        private readonly deleteOutfitUseCase: DeleteOutfitUseCase
    ) { }

    public create = async (req: AuthRequest, res: Response): Promise<void> => {
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

            const result = await this.createOutfitUseCase.execute(req.body, req.userId);
            res.status(201).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getUserOutfits = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const result = await this.getUserOutfitsUseCase.execute(req.userId);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getById = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this.getOutfitByIdUseCase.execute(id, req.userId);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public update = async (req: AuthRequest, res: Response): Promise<void> => {
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
            const result = await this.updateOutfitUseCase.execute(id, req.body, req.userId);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public delete = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            await this.deleteOutfitUseCase.execute(id, req.userId);
            res.status(200).json({ message: 'Outfit deleted successfully' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    private handleError(error: unknown, res: Response): void {
        if (error instanceof OutfitNotFoundException) {
            res.status(404).json({ error: error.message });
        } else if (error instanceof UnauthorizedOutfitAccessException) {
            res.status(403).json({ error: error.message });
        } else if (error instanceof InvalidOutfitDataException) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}