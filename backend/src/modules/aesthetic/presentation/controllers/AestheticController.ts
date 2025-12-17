import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CreateAestheticUseCase } from '../../application/use-cases/CreateAestheticUseCase';
import { GetAestheticByIdUseCase } from '../../application/use-cases/GetAestheticByIdUseCase';
import { GetAllAestheticsUseCase } from '../../application/use-cases/GetAllAestheticsUseCase';
import { UpdateAestheticUseCase } from '../../application/use-cases/UpdateAestheticUseCase';
import { DeleteAestheticUseCase } from '../../application/use-cases/DeleteAestheticUseCase';
import { SearchAestheticsUseCase } from '@modules/aesthetic/application/use-cases/SearchAestheticUseCase';
import {
    AestheticNotFoundException,
    AestheticAlreadyExistsException,
} from '../../domain/exceptions/AestheticExceptions';

export class AestheticController {
    constructor(
        private readonly createAestheticUseCase: CreateAestheticUseCase,
        private readonly getAestheticByIdUseCase: GetAestheticByIdUseCase,
        private readonly getAllAestheticsUseCase: GetAllAestheticsUseCase,
        private readonly updateAestheticUseCase: UpdateAestheticUseCase,
        private readonly deleteAestheticUseCase: DeleteAestheticUseCase,
        private readonly searchAestheticsUseCase: SearchAestheticsUseCase
    ) { }

    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const result = await this.createAestheticUseCase.execute(req.body);
            res.status(201).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this.getAestheticByIdUseCase.execute(id);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('GET /aesthetics called');
            const result = await this.getAllAestheticsUseCase.execute();
            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getAll controller:', error); 
            this.handleError(error, res);
        }
    };

    public update = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { id } = req.params;
            const result = await this.updateAestheticUseCase.execute(id, req.body);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.deleteAestheticUseCase.execute(id);
            res.status(200).json({ message: 'Aesthetic deleted successfully' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public search = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { keyword } = req.query;
            const result = await this.searchAestheticsUseCase.execute(keyword as string);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    private handleError(error: unknown, res: Response): void {
        if (error instanceof AestheticNotFoundException) {
            res.status(404).json({ error: error.message });
        } else if (error instanceof AestheticAlreadyExistsException) {
            res.status(409).json({ error: error.message });
        } else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}