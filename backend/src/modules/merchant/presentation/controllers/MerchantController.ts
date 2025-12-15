import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../../../user/presentation/middleware/AuthMiddleware';
import { CreateMerchantUseCase } from '../../application/use-cases/CreateMerchantUseCase';
import { GetMerchantByIdUseCase } from '../../application/use-cases/GetMerchantByIdUseCase';
import { GetAllMerchantsUseCase } from '../../application/use-cases/GetAllMerchantsUseCase';
import { UpdateMerchantUseCase } from '../../application/use-cases/UpdateMerchantUseCase';
import { ActivateMerchantUseCase } from '../../application/use-cases/ActivateMerchantUseCase';
import { DeactivateMerchantUseCase } from '../../application/use-cases/DeactivateMerchantUseCase';
import { GetUserMerchantsUseCase } from '../../application/use-cases/GetUserMerchantsUseCase';
import {
    MerchantNotFoundException,
    MerchantAlreadyExistsException,
    UnauthorizedMerchantAccessException,
} from '../../domain/exceptions/MerchantExceptions';

export class MerchantController {
    constructor(
        private readonly createMerchantUseCase: CreateMerchantUseCase,
        private readonly getMerchantByIdUseCase: GetMerchantByIdUseCase,
        private readonly getAllMerchantsUseCase: GetAllMerchantsUseCase,
        private readonly updateMerchantUseCase: UpdateMerchantUseCase,
        private readonly activateMerchantUseCase: ActivateMerchantUseCase,
        private readonly deactivateMerchantUseCase: DeactivateMerchantUseCase,
        private readonly getUserMerchantsUseCase: GetUserMerchantsUseCase
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

            const result = await this.createMerchantUseCase.execute(req.body, req.userId);
            res.status(201).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getById = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this.getMerchantByIdUseCase.execute(id);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getAll = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const query = {
                limit: req.query.limit ? Number.parseInt(req.query.limit as string) : undefined,
                offset: req.query.offset ? Number.parseInt(req.query.offset as string) : undefined,
                activeOnly: req.query.activeOnly === 'true',
            };

            const result = await this.getAllMerchantsUseCase.execute(query);
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
            const result = await this.updateMerchantUseCase.execute(id, req.body, req.userId);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public activate = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.activateMerchantUseCase.execute(id);
            res.status(200).json({ message: 'Merchant activated successfully' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public deactivate = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.deactivateMerchantUseCase.execute(id);
            res.status(200).json({ message: 'Merchant deactivated successfully' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getUserMerchants = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const result = await this.getUserMerchantsUseCase.execute(req.userId);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    private handleError(error: unknown, res: Response): void {
        if (error instanceof MerchantNotFoundException) {
            res.status(404).json({ error: error.message });
        } else if (error instanceof MerchantAlreadyExistsException) {
            res.status(409).json({ error: error.message });
        } else if (error instanceof UnauthorizedMerchantAccessException) {
            res.status(403).json({ error: error.message });
        } else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}