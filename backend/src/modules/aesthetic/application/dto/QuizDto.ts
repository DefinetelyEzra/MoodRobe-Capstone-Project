import { QuizAnswer } from '../../domain/entities/StyleQuiz';

export interface SubmitQuizDto {
    answers: QuizAnswer[];
}

export interface QuizResultDto {
    topAesthetic: {
        id: string;
        name: string;
        description: string;
        imageUrl?: string;
        score: number;
        percentage: number;
    };
    alternativeAesthetics: Array<{
        id: string;
        name: string;
        description: string;
        imageUrl?: string;
        score: number;
        percentage: number;
    }>;
}