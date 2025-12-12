import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/AuthMiddleWare';
import { GetUserProfileUseCase } from '../../application/use-cases/GetUserProfileUseCase';
import { UpdateUserProfileUseCase } from '../../application/use-cases/UpdateUserProfileUseCase';
import { SaveAestheticUseCase } from '../../application/use-cases/SaveAestheticUseCase';

export class UserProfileController {
    constructor(
        private readonly getUserProfileUseCase: GetUserProfileUseCase,
        private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
        private readonly saveAestheticUseCase: SaveAestheticUseCase
    ) { }

    public getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const result = await this.getUserProfileUseCase.execute(req.userId);
            if (!result) {
                res.status(404).json({ error: 'Profile not found' });
                return;
            }

            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
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

            const result = await this.updateUserProfileUseCase.execute(
                req.userId,
                req.body
            );
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public saveAesthetic = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { aestheticId } = req.body;
            if (!aestheticId) {
                res.status(400).json({ error: 'Aesthetic ID is required' });
                return;
            }

            await this.saveAestheticUseCase.execute(req.userId, aestheticId);
            res.status(200).json({ message: 'Aesthetic saved successfully' });
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