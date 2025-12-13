import { StyleQuiz, QuizQuestion } from '../../domain/entities/StyleQuiz';
import { v4 as uuidv4 } from 'uuid';

export interface StyleQuizResponseDto {
    id: string;
    questions: QuizQuestion[];
}

export class GetStyleQuizUseCase {
    public execute(): StyleQuizResponseDto {
        const questions = this.getDefaultQuestions();
        const quiz = StyleQuiz.create(uuidv4(), questions);

        return {
            id: quiz.id,
            questions: quiz.questions,
        };
    }

    private getDefaultQuestions(): QuizQuestion[] {
        return [
            {
                id: 'q1',
                question: 'What colors do you gravitate towards?',
                options: [
                    {
                        id: 'q1-opt1',
                        text: 'Black, white, and neutrals',
                        aestheticWeights: {
                            minimalist: 10,
                            'dark-academia': 5,
                            normcore: 8,
                            'old-money': 6,
                        },
                    },
                    {
                        id: 'q1-opt2',
                        text: 'Bold and bright colors',
                        aestheticWeights: {
                            streetwear: 10,
                            athleisure: 5,
                            y2k: 9,
                            'soft-girl': 7,
                        },
                    },
                    {
                        id: 'q1-opt3',
                        text: 'Soft pastels and earth tones',
                        aestheticWeights: {
                            cottagecore: 10,
                            'soft-girl': 9,
                            balletcore: 8,
                            'coastal-grandmother': 6,
                        },
                    },
                    {
                        id: 'q1-opt4',
                        text: 'Rich, deep tones',
                        aestheticWeights: {
                            'dark-academia': 10,
                            'old-money': 8,
                            'romantic-academia': 7,
                            bohemian: 6,
                        },
                    },
                    {
                        id: 'q1-opt5',
                        text: 'Dark colors with neon accents',
                        aestheticWeights: {
                            cyberpunk: 10,
                            techwear: 8,
                            streetwear: 6,
                            y2k: 5,
                        },
                    },
                    {
                        id: 'q1-opt6',
                        text: 'Earthy and natural tones',
                        aestheticWeights: {
                            bohemian: 10,
                            cottagecore: 7,
                            gorpcore: 8,
                            'vintage-americana': 6,
                        },
                    },
                ],
            },
            {
                id: 'q2',
                question: 'Which setting appeals to you most?',
                options: [
                    {
                        id: 'q2-opt1',
                        text: 'Urban streets and city life',
                        aestheticWeights: {
                            streetwear: 10,
                            skater: 9,
                            grunge: 7,
                            techwear: 8,
                        },
                    },
                    {
                        id: 'q2-opt2',
                        text: 'Libraries and coffee shops',
                        aestheticWeights: {
                            'dark-academia': 10,
                            'romantic-academia': 8,
                            minimalist: 5,
                        },
                    },
                    {
                        id: 'q2-opt3',
                        text: 'Gardens and nature',
                        aestheticWeights: {
                            cottagecore: 10,
                            bohemian: 7,
                            gorpcore: 6,
                        },
                    },
                    {
                        id: 'q2-opt4',
                        text: 'Modern, minimalist spaces',
                        aestheticWeights: {
                            minimalist: 10,
                            normcore: 7,
                            athleisure: 6,
                        },
                    },
                    {
                        id: 'q2-opt5',
                        text: 'Coastal towns and beaches',
                        aestheticWeights: {
                            'coastal-grandmother': 10,
                            bohemian: 6,
                            minimalist: 4,
                        },
                    },
                    {
                        id: 'q2-opt6',
                        text: 'Art galleries and theaters',
                        aestheticWeights: {
                            'avant-garde': 10,
                            'dark-academia': 6,
                            'old-money': 7,
                        },
                    },
                    {
                        id: 'q2-opt7',
                        text: 'Mountains and hiking trails',
                        aestheticWeights: {
                            gorpcore: 10,
                            athleisure: 7,
                            techwear: 5,
                        },
                    },
                ],
            },
            {
                id: 'q3',
                question: 'What best describes your style preference?',
                options: [
                    {
                        id: 'q3-opt1',
                        text: 'Clean lines and simplicity',
                        aestheticWeights: {
                            minimalist: 10,
                            normcore: 8,
                            athleisure: 6,
                        },
                    },
                    {
                        id: 'q3-opt2',
                        text: 'Edgy and statement-making',
                        aestheticWeights: {
                            streetwear: 10,
                            grunge: 9,
                            cyberpunk: 8,
                        },
                    },
                    {
                        id: 'q3-opt3',
                        text: 'Romantic and vintage',
                        aestheticWeights: {
                            cottagecore: 10,
                            'romantic-academia': 9,
                            'dark-academia': 6,
                        },
                    },
                    {
                        id: 'q3-opt4',
                        text: 'Classic and scholarly',
                        aestheticWeights: {
                            'dark-academia': 10,
                            'old-money': 8,
                            'vintage-americana': 6,
                        },
                    },
                    {
                        id: 'q3-opt5',
                        text: 'Cute and playful',
                        aestheticWeights: {
                            'soft-girl': 10,
                            y2k: 8,
                            balletcore: 7,
                        },
                    },
                    {
                        id: 'q3-opt6',
                        text: 'Free-spirited and eclectic',
                        aestheticWeights: {
                            bohemian: 10,
                            'avant-garde': 7,
                            cottagecore: 5,
                        },
                    },
                    {
                        id: 'q3-opt7',
                        text: 'Technical and functional',
                        aestheticWeights: {
                            techwear: 10,
                            gorpcore: 9,
                            athleisure: 7,
                        },
                    },
                    {
                        id: 'q3-opt8',
                        text: 'Timeless and refined',
                        aestheticWeights: {
                            'old-money': 10,
                            'coastal-grandmother': 8,
                            minimalist: 6,
                        },
                    },
                ],
            },
            {
                id: 'q4',
                question: 'What fabrics do you prefer?',
                options: [
                    {
                        id: 'q4-opt1',
                        text: 'Technical and performance fabrics',
                        aestheticWeights: {
                            athleisure: 10,
                            techwear: 10,
                            gorpcore: 9,
                            streetwear: 5,
                        },
                    },
                    {
                        id: 'q4-opt2',
                        text: 'Natural fibers like cotton and linen',
                        aestheticWeights: {
                            cottagecore: 10,
                            'coastal-grandmother': 9,
                            bohemian: 8,
                            minimalist: 6,
                        },
                    },
                    {
                        id: 'q4-opt3',
                        text: 'Luxe materials like wool and leather',
                        aestheticWeights: {
                            'dark-academia': 10,
                            'old-money': 9,
                            'vintage-americana': 7,
                            grunge: 5,
                        },
                    },
                    {
                        id: 'q4-opt4',
                        text: 'Soft, delicate fabrics',
                        aestheticWeights: {
                            'soft-girl': 10,
                            balletcore: 10,
                            'romantic-academia': 8,
                            cottagecore: 6,
                        },
                    },
                    {
                        id: 'q4-opt5',
                        text: 'Shiny, metallic, or synthetic',
                        aestheticWeights: {
                            y2k: 10,
                            cyberpunk: 9,
                            'avant-garde': 7,
                        },
                    },
                    {
                        id: 'q4-opt6',
                        text: 'Durable, rugged materials',
                        aestheticWeights: {
                            'vintage-americana': 10,
                            gorpcore: 9,
                            grunge: 7,
                            skater: 6,
                        },
                    },
                    {
                        id: 'q4-opt7',
                        text: 'Whatever looks and feels good',
                        aestheticWeights: {
                            normcore: 10,
                            minimalist: 6,
                            athleisure: 5,
                            streetwear: 5,
                        },
                    },
                ],
            },
            {
                id: 'q5',
                question: 'How would you describe your ideal outfit?',
                options: [
                    {
                        id: 'q5-opt1',
                        text: 'Comfortable and functional',
                        aestheticWeights: {
                            athleisure: 10,
                            normcore: 9,
                            minimalist: 7,
                            gorpcore: 8,
                        },
                    },
                    {
                        id: 'q5-opt2',
                        text: 'Bold and attention-grabbing',
                        aestheticWeights: {
                            streetwear: 10,
                            'avant-garde': 9,
                            cyberpunk: 8,
                            y2k: 7,
                        },
                    },
                    {
                        id: 'q5-opt3',
                        text: 'Soft and whimsical',
                        aestheticWeights: {
                            cottagecore: 10,
                            'soft-girl': 9,
                            'romantic-academia': 7,
                        },
                    },
                    {
                        id: 'q5-opt4',
                        text: 'Timeless and sophisticated',
                        aestheticWeights: {
                            'dark-academia': 10,
                            'old-money': 10,
                            minimalist: 6,
                        },
                    },
                    {
                        id: 'q5-opt5',
                        text: 'Graceful and elegant',
                        aestheticWeights: {
                            balletcore: 10,
                            'romantic-academia': 8,
                            'old-money': 7,
                        },
                    },
                    {
                        id: 'q5-opt6',
                        text: 'Layered and artistic',
                        aestheticWeights: {
                            bohemian: 10,
                            grunge: 8,
                            'avant-garde': 7,
                        },
                    },
                    {
                        id: 'q5-opt7',
                        text: 'Casual and laid-back',
                        aestheticWeights: {
                            'coastal-grandmother': 10,
                            skater: 9,
                            normcore: 8,
                            'vintage-americana': 6,
                        },
                    },
                    {
                        id: 'q5-opt8',
                        text: 'Utilitarian and prepared',
                        aestheticWeights: {
                            techwear: 10,
                            gorpcore: 9,
                            streetwear: 5,
                        },
                    },
                ],
            },
            {
                id: 'q6',
                question: 'What patterns or prints appeal to you?',
                options: [
                    {
                        id: 'q6-opt1',
                        text: 'Solid colors only',
                        aestheticWeights: {
                            minimalist: 10,
                            normcore: 9,
                            techwear: 8,
                            athleisure: 7,
                        },
                    },
                    {
                        id: 'q6-opt2',
                        text: 'Floral and delicate prints',
                        aestheticWeights: {
                            cottagecore: 10,
                            'romantic-academia': 9,
                            'soft-girl': 8,
                            bohemian: 7,
                        },
                    },
                    {
                        id: 'q6-opt3',
                        text: 'Plaid and checks',
                        aestheticWeights: {
                            'dark-academia': 10,
                            grunge: 9,
                            'vintage-americana': 7,
                            skater: 6,
                        },
                    },
                    {
                        id: 'q6-opt4',
                        text: 'Bold graphics and logos',
                        aestheticWeights: {
                            streetwear: 10,
                            y2k: 8,
                            skater: 8,
                            athleisure: 5,
                        },
                    },
                    {
                        id: 'q6-opt5',
                        text: 'Geometric and abstract',
                        aestheticWeights: {
                            'avant-garde': 10,
                            cyberpunk: 8,
                            minimalist: 6,
                        },
                    },
                    {
                        id: 'q6-opt6',
                        text: 'Stripes and nautical',
                        aestheticWeights: {
                            'coastal-grandmother': 10,
                            'old-money': 7,
                            minimalist: 5,
                        },
                    },
                    {
                        id: 'q6-opt7',
                        text: 'Paisley, tribal, or ethnic prints',
                        aestheticWeights: {
                            bohemian: 10,
                            'vintage-americana': 5,
                        },
                    },
                ],
            },
            {
                id: 'q7',
                question: 'What era or time period resonates with you?',
                options: [
                    {
                        id: 'q7-opt1',
                        text: 'The present and future',
                        aestheticWeights: {
                            minimalist: 8,
                            techwear: 10,
                            cyberpunk: 10,
                            'avant-garde': 9,
                        },
                    },
                    {
                        id: 'q7-opt2',
                        text: 'Early 2000s',
                        aestheticWeights: {
                            y2k: 10,
                            streetwear: 6,
                        },
                    },
                    {
                        id: 'q7-opt3',
                        text: '1990s',
                        aestheticWeights: {
                            grunge: 10,
                            skater: 9,
                            minimalist: 5,
                        },
                    },
                    {
                        id: 'q7-opt4',
                        text: '1950s-1970s',
                        aestheticWeights: {
                            'vintage-americana': 10,
                            bohemian: 8,
                            'romantic-academia': 6,
                        },
                    },
                    {
                        id: 'q7-opt5',
                        text: 'Victorian/Edwardian era',
                        aestheticWeights: {
                            'dark-academia': 10,
                            'romantic-academia': 10,
                            cottagecore: 7,
                        },
                    },
                    {
                        id: 'q7-opt6',
                        text: 'Timeless - no specific era',
                        aestheticWeights: {
                            'old-money': 10,
                            'coastal-grandmother': 8,
                            minimalist: 7,
                            normcore: 6,
                        },
                    },
                ],
            },
            {
                id: 'q8',
                question: 'What best describes your lifestyle?',
                options: [
                    {
                        id: 'q8-opt1',
                        text: 'Active and fitness-focused',
                        aestheticWeights: {
                            athleisure: 10,
                            gorpcore: 9,
                            techwear: 6,
                        },
                    },
                    {
                        id: 'q8-opt2',
                        text: 'Creative and artistic',
                        aestheticWeights: {
                            'avant-garde': 10,
                            bohemian: 9,
                            'romantic-academia': 7,
                            'dark-academia': 6,
                        },
                    },
                    {
                        id: 'q8-opt3',
                        text: 'Urban and fast-paced',
                        aestheticWeights: {
                            streetwear: 10,
                            techwear: 9,
                            minimalist: 7,
                            skater: 6,
                        },
                    },
                    {
                        id: 'q8-opt4',
                        text: 'Relaxed and nature-oriented',
                        aestheticWeights: {
                            'coastal-grandmother': 10,
                            cottagecore: 9,
                            bohemian: 8,
                            gorpcore: 7,
                        },
                    },
                    {
                        id: 'q8-opt5',
                        text: 'Academic and intellectual',
                        aestheticWeights: {
                            'dark-academia': 10,
                            'romantic-academia': 8,
                            minimalist: 5,
                        },
                    },
                    {
                        id: 'q8-opt6',
                        text: 'Social and trend-conscious',
                        aestheticWeights: {
                            y2k: 9,
                            'soft-girl': 8,
                            streetwear: 7,
                            'avant-garde': 6,
                        },
                    },
                    {
                        id: 'q8-opt7',
                        text: 'Practical and no-nonsense',
                        aestheticWeights: {
                            normcore: 10,
                            'vintage-americana': 8,
                            minimalist: 7,
                        },
                    },
                    {
                        id: 'q8-opt8',
                        text: 'Refined and traditional',
                        aestheticWeights: {
                            'old-money': 10,
                            'dark-academia': 7,
                            'coastal-grandmother': 6,
                        },
                    },
                ],
            },
        ];
    }
}