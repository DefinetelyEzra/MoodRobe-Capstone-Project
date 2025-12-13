import { StyleQuizService } from '../../domain/services/StyleQuizService';
import { IAestheticRepository } from '../../domain/repositories/IAestheticRepository';
import { GetStyleQuizUseCase } from './GetStyleQuizUseCase';
import { SubmitQuizDto, QuizResultDto } from '../dto/QuizDto';
import { StyleQuiz } from '../../domain/entities/StyleQuiz';

export class SubmitStyleQuizUseCase {
    private readonly styleQuizService: StyleQuizService;
    private readonly getStyleQuizUseCase: GetStyleQuizUseCase;

    constructor(aestheticRepository: IAestheticRepository) {
        this.styleQuizService = new StyleQuizService(aestheticRepository);
        this.getStyleQuizUseCase = new GetStyleQuizUseCase();
    }

    public async execute(dto: SubmitQuizDto): Promise<QuizResultDto> {
        // Get the quiz
        const quizData = this.getStyleQuizUseCase.execute();
        const quiz = StyleQuiz.create(quizData.id, quizData.questions);

        // Get detailed results
        const results = await this.styleQuizService.getDetailedResults(quiz, dto.answers);

        if (results.length === 0) {
            throw new Error('Unable to calculate quiz results');
        }

        const topResult = results[0];
        const alternativeResults = results.slice(1, 4); // Top 3 alternatives

        return {
            topAesthetic: {
                id: topResult.aesthetic.id,
                name: topResult.aesthetic.name,
                description: topResult.aesthetic.description,
                imageUrl: topResult.aesthetic.imageUrl,
                score: topResult.score,
                percentage: Math.round(topResult.percentage * 10) / 10, // Round to 1 decimal
            },
            alternativeAesthetics: alternativeResults.map((result) => ({
                id: result.aesthetic.id,
                name: result.aesthetic.name,
                description: result.aesthetic.description,
                imageUrl: result.aesthetic.imageUrl,
                score: result.score,
                percentage: Math.round(result.percentage * 10) / 10,
            })),
        };
    }
}