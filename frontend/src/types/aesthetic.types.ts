export interface Aesthetic {
    id: string;
    name: string;
    description: string;
    themeProperties: ThemeProperties;
    imageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ThemeProperties {
    colors: string[];
    style: string;
    mood?: string;
    patterns?: string[];
    textures?: string[];
    keywords?: string[];
}
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

export interface StyleQuizResult {
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