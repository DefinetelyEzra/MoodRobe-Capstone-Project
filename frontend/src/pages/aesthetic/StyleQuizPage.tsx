import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aestheticApi } from '@/api/aesthetic.api';
import { userApi } from '@/api/user.api';
import { useAesthetic } from '@/hooks/useAesthetic';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useApi } from '@/hooks/useApi';
import { QuizQuestion, QuizAnswer, StyleQuizResult } from '@/types/aesthetic.types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface QuizQuestionsResponse {
    questions: QuizQuestion[];
}

export const StyleQuizPage: React.FC = () => {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswer[]>([]);
    const [result, setResult] = useState<StyleQuizResult | null>(null);

    const navigate = useNavigate();
    const { loadAesthetics } = useAesthetic();
    const { refreshUser } = useAuth();
    const { showToast } = useToast();

    const {
        isLoading,
        execute: fetchQuestions
    } = useApi<QuizQuestionsResponse, void>(() =>
        aestheticApi.getQuizQuestions()
    );

    const {
        isLoading: isSubmitting,
        execute: submitQuizApi
    } = useApi<StyleQuizResult, QuizAnswer[]>((quizAnswers) =>
        aestheticApi.submitQuiz(quizAnswers)
    );

    const {
        execute: selectAestheticApi
    } = useApi<void, string>((aestheticId) =>
        userApi.selectAesthetic(aestheticId)
    );

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const data = await fetchQuestions();
                if (data?.questions && data.questions.length > 0) {
                    setQuestions(data.questions);
                } else {
                    showToast('No quiz questions available', 'error');
                }
            } catch (error) {
                if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
                    return;
                }
                console.error('Failed to load quiz questions:', error);
                showToast('Failed to load quiz questions. Please try again.', 'error');
            }
        };

        loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOptionSelect = (optionId: string): void => {
        const currentQuestion = questions[currentQuestionIndex];
        const newAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
        newAnswers.push({
            questionId: currentQuestion.id,
            optionId
        });
        setAnswers(newAnswers);
    };

    const handleNext = (): void => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = (): void => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async (): Promise<void> => {
        try {
            const quizResult = await submitQuizApi(answers);
            if (quizResult) {
                setResult(quizResult);
                await selectAestheticApi(quizResult.topAesthetic.id);
                await loadAesthetics();
                await refreshUser();
                showToast('Quiz completed! Your aesthetic has been set.', 'success');
            }
        } catch (error) {
            console.error('Failed to submit quiz:', error);
            showToast('Failed to submit quiz', 'error');
        }
    };

    const getCurrentAnswer = (): string | undefined => {
        const currentQuestion = questions[currentQuestionIndex];
        return answers.find(a => a.questionId === currentQuestion?.id)?.optionId;
    };

    const isQuizComplete = answers.length === questions.length;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-canvas">
                <LoadingSpinner text="Loading quiz..." />
            </div>
        );
    }

    if (!isLoading && (!questions || questions.length === 0)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-canvas">
                <div className="text-center bg-surface p-8 rounded-xl border border-border">
                    <p className="text-text-secondary mb-4">No quiz questions available</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (result) {
        return (
            <div className="min-h-screen bg-canvas">
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <div className="bg-surface rounded-2xl shadow-lg p-8 border border-border">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="w-10 h-10 text-accent" />
                            </div>
                            <h1 className="text-4xl font-bold text-text-primary mb-4">
                                Your Perfect Match!
                            </h1>
                            <p className="text-lg text-text-secondary">
                                Based on your answers, we've found your ideal aesthetic
                            </p>
                        </div>

                        {/* Top Aesthetic */}
                        <div className="bg-linear-to-br from-canvas to-accent/5 rounded-xl p-8 mb-8 border border-border">
                            <div className="flex flex-col items-center">
                                {result.topAesthetic.imageUrl && (
                                    <img
                                        src={result.topAesthetic.imageUrl}
                                        alt={result.topAesthetic.name}
                                        className="w-48 h-48 object-cover rounded-lg mb-4 shadow-md border border-border"
                                    />
                                )}
                                <h2 className="text-3xl font-bold text-text-primary mb-2">
                                    {result.topAesthetic.name}
                                </h2>
                                <p className="text-text-secondary text-center mb-4">
                                    {result.topAesthetic.description}
                                </p>
                                <div className="flex items-center gap-2 text-accent font-semibold">
                                    <span className="text-3xl">{Math.round(result.topAesthetic.percentage)}%</span>
                                    <span>Match</span>
                                </div>
                            </div>
                        </div>

                        {/* Alternative Aesthetics */}
                        {result.alternativeAesthetics && result.alternativeAesthetics.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-text-primary mb-4">
                                    You might also like:
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {result.alternativeAesthetics.map((aesthetic) => (
                                        <div
                                            key={aesthetic.id}
                                            className="bg-canvas rounded-lg p-4 border border-border hover:border-accent transition-colors"
                                        >
                                            <h4 className="font-semibold text-text-primary mb-1">
                                                {aesthetic.name}
                                            </h4>
                                            <p className="text-sm text-accent font-medium">
                                                {Math.round(aesthetic.percentage)}% match
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4 justify-center flex-wrap">
                            <button
                                onClick={() => navigate('/')}
                                className="px-8 py-3 bg-accent hover:bg-accent-dark text-surface font-semibold rounded-lg transition-all duration-200 shadow-md"
                                type="button"
                            >
                                Start Shopping
                            </button>
                            <button
                                onClick={() => navigate('/aesthetic-selection')}
                                className="px-8 py-3 bg-surface hover:bg-canvas text-text-primary font-semibold rounded-lg border border-border transition-all duration-200"
                                type="button"
                            >
                                View All Aesthetics
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = getCurrentAnswer();
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-canvas">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-accent hover:text-accent-dark transition-colors mb-4"
                        type="button"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </button>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Discover Your Style</h1>
                    <p className="text-text-secondary">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </p>
                    {/* Progress Bar */}
                    <div className="mt-4 bg-border rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-accent h-full transition-all duration-300 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-surface rounded-2xl shadow-lg p-8 mb-6 border border-border">
                    <h2 className="text-2xl font-semibold text-text-primary mb-6">
                        {currentQuestion.question}
                    </h2>

                    <div className="space-y-3">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleOptionSelect(option.id)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${currentAnswer === option.id
                                        ? 'border-accent bg-accent/5 shadow-sm'
                                        : 'border-border hover:border-accent/50 bg-surface hover:bg-canvas'
                                    }`}
                                type="button"
                            >
                                <div className="flex items-center">
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${currentAnswer === option.id
                                                ? 'border-accent bg-accent'
                                                : 'border-text-secondary'
                                            }`}
                                    >
                                        {currentAnswer === option.id && (
                                            <div className="w-2 h-2 bg-surface rounded-full" />
                                        )}
                                    </div>
                                    <span className="text-text-primary font-medium">{option.text}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center px-6 py-3 text-text-primary font-semibold rounded-lg border border-border hover:bg-canvas disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        type="button"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Previous
                    </button>

                    {currentQuestionIndex === questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!isQuizComplete || isSubmitting}
                            className="flex items-center px-8 py-3 bg-accent hover:bg-accent-dark text-surface font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                            type="button"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoadingSpinner />
                                    <span className="ml-2">Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <span>See Results</span>
                                    <Sparkles className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={!currentAnswer}
                            className="flex items-center px-8 py-3 bg-accent hover:bg-accent-dark text-surface font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                            type="button"
                        >
                            <span>Next</span>
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};