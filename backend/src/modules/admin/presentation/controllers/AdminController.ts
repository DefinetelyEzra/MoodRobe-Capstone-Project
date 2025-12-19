import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '@modules/user/presentation/middleware/AuthMiddleware';
import { ManageCarouselUseCase } from '../../application/use-cases/ManageCarouselUseCase';
import { ManageContentUseCase } from '../../application/use-cases/ManageContentUseCase';
import { GetActivityLogUseCase } from '../../application/use-cases/GetActivityLogUseCase';
import {
    ContentNotFoundException,
    InvalidContentException
} from '../../domain/exceptions/AdminExceptions';
import { TypeOrmUserRepository } from '@modules/user/infrastructure/persistence/repositories/TypeOrmUserRepository';

export class AdminController {
    constructor(
        private readonly manageCarouselUseCase: ManageCarouselUseCase,
        private readonly manageContentUseCase: ManageContentUseCase,
        private readonly getActivityLogUseCase: GetActivityLogUseCase,
        private readonly userRepository: TypeOrmUserRepository
    ) { }

    // Carousel Management
    public getAllCarousel = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const carousel = await this.manageCarouselUseCase.getAll();
            res.status(200).json(carousel);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getActiveCarousel = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const carousel = await this.manageCarouselUseCase.getActive();
            res.status(200).json(carousel);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public createCarousel = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const user = await this.userRepository.findById(req.userId!);
            const adminEmail = user!.getEmail();

            const carousel = await this.manageCarouselUseCase.create(req.body, adminEmail);
            res.status(201).json(carousel);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public updateCarousel = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const user = await this.userRepository.findById(req.userId!);
            const adminEmail = user!.getEmail();

            const carousel = await this.manageCarouselUseCase.update(
                req.params.id,
                req.body,
                adminEmail
            );
            res.status(200).json(carousel);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public deleteCarousel = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const user = await this.userRepository.findById(req.userId!);
            const adminEmail = user!.getEmail();

            await this.manageCarouselUseCase.delete(req.params.id, adminEmail);
            res.status(200).json({ message: 'Carousel item deleted successfully' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    // Content Management
    public getAllContent = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const content = await this.manageContentUseCase.getAll();
            res.status(200).json(content);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getContentBySectionKey = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const content = await this.manageContentUseCase.getBySectionKey(
                req.params.sectionKey
            );
            res.status(200).json(content);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public updateContent = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const user = await this.userRepository.findById(req.userId!);
            const adminEmail = user!.getEmail();

            const content = await this.manageContentUseCase.update(
                req.params.sectionKey,
                req.body,
                adminEmail
            );
            res.status(200).json(content);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    // Activity Log
    public getActivityLog = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : 50;
            const logs = await this.getActivityLogUseCase.getRecent(limit);
            res.status(200).json(logs);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    private handleError(error: unknown, res: Response): void {
        if (error instanceof ContentNotFoundException) {
            res.status(404).json({ error: error.message });
        } else if (error instanceof InvalidContentException) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}