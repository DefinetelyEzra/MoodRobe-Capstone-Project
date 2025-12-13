import { StyleQuiz, QuizAnswer } from '../entities/StyleQuiz';
import { IAestheticRepository } from '../repositories/IAestheticRepository';

export class StyleQuizService {
    constructor(private readonly aestheticRepository: IAestheticRepository) { }

    public async calculateUserAesthetic(
        quiz: StyleQuiz,
        answers: QuizAnswer[]
    ): Promise<string> {
        // Validate answers
        if (!quiz.validateAnswers(answers)) {
            throw new Error('Invalid quiz answers provided');
        }

        // Calculate results
        const results = quiz.calculateResults(answers);

        if (results.length === 0) {
            throw new Error('Unable to calculate aesthetic from answers');
        }

        // Return the top aesthetic
        return results[0].aestheticId;
    }

    public async getDetailedResults(
        quiz: StyleQuiz,
        answers: QuizAnswer[]
    ): Promise<Array<{ aesthetic: any; score: number; percentage: number }>> {
        const results = quiz.calculateResults(answers);

        // Fetch aesthetic details for top results (top 5)
        const detailedResults = await Promise.all(
            results.slice(0, 5).map(async (result) => {
                const aesthetic = await this.aestheticRepository.findByName(result.aestheticId);
                return {
                    aesthetic: aesthetic
                        ? {
                            id: aesthetic.id,
                            name: aesthetic.name,
                            description: aesthetic.description,
                            imageUrl: aesthetic.imageUrl,
                        }
                        : null,
                    score: result.score,
                    percentage: result.percentage,
                };
            })
        );

        return detailedResults.filter((r) => r.aesthetic !== null);
    }
}