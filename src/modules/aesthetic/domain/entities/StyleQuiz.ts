export interface QuizQuestion {
    id: string;
    question: string;
    options: QuizOption[];
}

export interface QuizOption {
    id: string;
    text: string;
    aestheticWeights: Record<string, number>;
}

export interface QuizAnswer {
    questionId: string;
    optionId: string;
}

export interface QuizResult {
    aestheticId: string;
    score: number;
    percentage: number;
}

export class StyleQuiz {
    private constructor(
        public readonly id: string,
        public readonly questions: QuizQuestion[],
        public readonly createdAt: Date = new Date()
    ) { }

    public static create(id: string, questions: QuizQuestion[]): StyleQuiz {
        if (!questions || questions.length === 0) {
            throw new Error('Quiz must have at least one question');
        }

        return new StyleQuiz(id, questions);
    }

    public calculateResults(answers: QuizAnswer[]): QuizResult[] {
        if (answers.length !== this.questions.length) {
            throw new Error('All questions must be answered');
        }

        const aestheticScores: Record<string, number> = {};

        // Calculate scores based on answers
        answers.forEach((answer) => {
            const question = this.questions.find((q) => q.id === answer.questionId);
            if (!question) {
                throw new Error(`Question ${answer.questionId} not found`);
            }

            const option = question.options.find((o) => o.id === answer.optionId);
            if (!option) {
                throw new Error(`Option ${answer.optionId} not found`);
            }

            // Add weights to aesthetic scores
            Object.entries(option.aestheticWeights).forEach(([aestheticId, weight]) => {
                aestheticScores[aestheticId] = (aestheticScores[aestheticId] || 0) + weight;
            });
        });

        // Calculate total score
        const totalScore = Object.values(aestheticScores).reduce((sum, score) => sum + score, 0);

        // Convert to results array with percentages
        const results: QuizResult[] = Object.entries(aestheticScores).map(
            ([aestheticId, score]) => ({
                aestheticId,
                score,
                percentage: totalScore > 0 ? (score / totalScore) * 100 : 0,
            })
        );

        // Sort by score descending
        return results.sort((a, b) => b.score - a.score);
    }

    public validateAnswers(answers: QuizAnswer[]): boolean {
        if (answers.length !== this.questions.length) {
            return false;
        }

        return answers.every((answer) => {
            const question = this.questions.find((q) => q.id === answer.questionId);
            if (!question) return false;

            return question.options.some((o) => o.id === answer.optionId);
        });
    }
}