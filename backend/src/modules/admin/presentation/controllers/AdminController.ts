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

    private async getAdminEmail(userId: string): Promise<string> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new Error('User not found');
        return user.getEmail();
    }

    // Carousel Management
    public getAllCarousel = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const carousel = await this.manageCarouselUseCase.getAll();
            res.status(200).json(carousel);
        } catch (error) {
            console.error('Get all carousel error:', error);
            this.handleError(error, res);
        }
    };

    public getActiveCarousel = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const carousel = await this.manageCarouselUseCase.getActive();
            res.status(200).json(carousel);
        } catch (error) {
            console.error('Get active carousel error:', error);
            this.handleError(error, res);
        }
    };

    public createCarousel = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            // Log incoming request
            console.log('Create carousel request body:', req.body);
            console.log('User ID:', req.userId);

            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log('Validation errors:', errors.array());
                res.status(400).json({
                    error: 'Validation failed',
                    errors: errors.array()
                });
                return;
            }

            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized - No user ID' });
                return;
            }

            // Get admin email
            const adminEmail = await this.getAdminEmail(req.userId);
            console.log('Admin email:', adminEmail);

            // Create carousel
            const carousel = await this.manageCarouselUseCase.create(req.body, adminEmail);
            console.log('Carousel created:', carousel);

            res.status(201).json(carousel);
        } catch (error) {
            console.error('Create carousel error:', error);
            this.handleError(error, res);
        }
    };

    public updateCarousel = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            console.log('Update carousel request:', { id: req.params.id, body: req.body });

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log('Validation errors:', errors.array());
                res.status(400).json({
                    error: 'Validation failed',
                    errors: errors.array()
                });
                return;
            }

            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const adminEmail = await this.getAdminEmail(req.userId);
            const carousel = await this.manageCarouselUseCase.update(
                req.params.id,
                req.body,
                adminEmail
            );

            res.status(200).json(carousel);
        } catch (error) {
            console.error('Update carousel error:', error);
            this.handleError(error, res);
        }
    };

    public deleteCarousel = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const adminEmail = await this.getAdminEmail(req.userId);
            await this.manageCarouselUseCase.delete(req.params.id, adminEmail);

            res.status(200).json({ message: 'Carousel item deleted successfully' });
        } catch (error) {
            console.error('Delete carousel error:', error);
            this.handleError(error, res);
        }
    };

    // Content Management
    public getAllContent = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const content = await this.manageContentUseCase.getAll();
            res.status(200).json(content);
        } catch (error) {
            console.error('Get all content error:', error);
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
            console.error('Get content by section key error:', error);
            this.handleError(error, res);
        }
    };

    public updateContent = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            console.log('Update content request:', {
                sectionKey: req.params.sectionKey,
                body: req.body
            });

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log('Validation errors:', errors.array());
                res.status(400).json({
                    error: 'Validation failed',
                    errors: errors.array()
                });
                return;
            }

            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const adminEmail = await this.getAdminEmail(req.userId);
            const content = await this.manageContentUseCase.update(
                req.params.sectionKey,
                req.body,
                adminEmail
            );

            res.status(200).json(content);
        } catch (error) {
            console.error('Update content error:', error);
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
            console.error('Get activity log error:', error);
            this.handleError(error, res);
        }
    };

    private handleError(error: unknown, res: Response): void {
        if (error instanceof ContentNotFoundException) {
            res.status(404).json({ error: error.message });
        } else if (error instanceof InvalidContentException) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof Error) {
            res.status(400).json({
                error: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}