import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/AuthMiddleware';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase';
import { GetUserByIdUseCase } from '../../application/use-cases/GetUserByIdUseCase';
import { UpdateUserUseCase } from '../../application/use-cases/UpdateUserUseCase';
import { UpdatePasswordUseCase } from '../../application/use-cases/UpdatePasswordUseCase';
import { SelectAestheticUseCase } from '../../application/use-cases/SelectAestheticUseCase';
import {
    UserAlreadyExistsException,
    InvalidCredentialsException,
    UserNotFoundException,
} from '../../domain/exceptions/UserExceptions';

export class UserController {
    constructor(
        private readonly registerUserUseCase: RegisterUserUseCase,
        private readonly loginUserUseCase: LoginUserUseCase,
        private readonly getUserByIdUseCase: GetUserByIdUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly updatePasswordUseCase: UpdatePasswordUseCase,
        private readonly selectAestheticUseCase: SelectAestheticUseCase
    ) { }

    public register = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const result = await this.registerUserUseCase.execute(req.body);
            res.status(201).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public login = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const result = await this.loginUserUseCase.execute(req.body);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const result = await this.getUserByIdUseCase.execute(req.userId);
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

            const result = await this.updateUserUseCase.execute(req.userId, req.body);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public updatePassword = async (req: AuthRequest, res: Response): Promise<void> => {
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

            await this.updatePasswordUseCase.execute(req.userId, req.body);
            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public selectAesthetic = async (req: AuthRequest, res: Response): Promise<void> => {
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

            const { aestheticId } = req.body;

            await this.selectAestheticUseCase.execute(req.userId, aestheticId ?? null);

            const message = aestheticId
                ? 'Aesthetic selected successfully'
                : 'Aesthetic cleared successfully';

            res.status(200).json({ message });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public clearAesthetic = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            await this.selectAestheticUseCase.execute(req.userId, null);
            res.status(200).json({ message: 'Aesthetic cleared successfully' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    private handleError(error: unknown, res: Response): void {
        if (error instanceof UserAlreadyExistsException) {
            res.status(409).json({ error: error.message });
        } else if (error instanceof InvalidCredentialsException) {
            res.status(401).json({ error: error.message });
        } else if (error instanceof UserNotFoundException) {
            res.status(404).json({ error: error.message });
        } else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}