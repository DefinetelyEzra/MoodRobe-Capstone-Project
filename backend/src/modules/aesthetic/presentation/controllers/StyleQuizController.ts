import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { GetStyleQuizUseCase } from '../../application/use-cases/GetStyleQuizUseCase';
import { SubmitStyleQuizUseCase } from '../../application/use-cases/SubmitStyleQuizUseCase';
import { InvalidQuizAnswersException } from '../../domain/exceptions/AestheticExceptions';

export class StyleQuizController {
    constructor(
        private readonly getStyleQuizUseCase: GetStyleQuizUseCase,
        private readonly submitStyleQuizUseCase: SubmitStyleQuizUseCase
    ) { }

    public getQuiz = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = this.getStyleQuizUseCase.execute();
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public submitQuiz = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const result = await this.submitStyleQuizUseCase.execute(req.body);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    private handleError(error: unknown, res: Response): void {
        if (error instanceof InvalidQuizAnswersException) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}