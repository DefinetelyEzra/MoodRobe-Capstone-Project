import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { aestheticApi } from '@/api/aesthetic.api';
import { userApi } from '@/api/user.api';
import { useAesthetic } from '@/hooks/useAesthetic';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { QuizQuestion, QuizAnswer, StyleQuizResult } from '@/types/aesthetic.types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export const StyleQuizPage: React.FC = () => {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<StyleQuizResult | null>(null);

    const navigate = useNavigate();
    const { loadAesthetics } = useAesthetic();
    const { refreshUser } = useAuth();
    const { showToast } = useToast();

    const loadQuestions = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);
            const data = await aestheticApi.getQuizQuestions();
            setQuestions(data.questions);
        } catch (error) {
            console.error('Failed to load quiz questions:', error);
            showToast('Failed to load quiz questions', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        loadQuestions();
    }, [loadQuestions]);

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
            setIsSubmitting(true);
            const quizResult = await aestheticApi.submitQuiz(answers);
            setResult(quizResult);

            // Auto-select the top aesthetic
            await userApi.selectAesthetic(quizResult.topAesthetic.id);
            await loadAesthetics();
            await refreshUser();

            showToast('Quiz completed! Your aesthetic has been set.', 'success');
        } catch (error) {
            console.error('Failed to submit quiz:', error);
            showToast('Failed to submit quiz', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getCurrentAnswer = (): string | undefined => {
        const currentQuestion = questions[currentQuestionIndex];
        return answers.find(a => a.questionId === currentQuestion?.id)?.optionId;
    };

    const isQuizComplete = answers.length === questions.length;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-teal-50">
                <LoadingSpinner text="Loading quiz..." />
            </div>
        );
    }

    if (result) {
        return (
            <div className="min-h-screen bg-linear-to-br from-purple-50 to-teal-50">
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                        <div className="text-center mb-8">
                            <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                Your Perfect Match!
                            </h1>
                            <p className="text-lg text-gray-600">
                                Based on your answers, we&apos;ve found your ideal aesthetic
                            </p>
                        </div>

                        {/* Top Aesthetic */}
                        <div className="bg-linear-to-br from-purple-50 to-teal-50 rounded-xl p-8 mb-8">
                            <div className="flex flex-col items-center">
                                {result.topAesthetic.imageUrl && (
                                    <img
                                        src={result.topAesthetic.imageUrl}
                                        alt={result.topAesthetic.name}
                                        className="w-48 h-48 object-cover rounded-lg mb-4 shadow-lg"
                                    />
                                )}
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    {result.topAesthetic.name}
                                </h2>
                                <p className="text-gray-600 text-center mb-4">
                                    {result.topAesthetic.description}
                                </p>
                                <div className="flex items-center gap-2 text-purple-600 font-semibold">
                                    <span className="text-2xl">{Math.round(result.topAesthetic.percentage)}%</span>
                                    <span>Match</span>
                                </div>
                            </div>
                        </div>

                        {/* Alternative Aesthetics */}
                        {result.alternativeAesthetics && result.alternativeAesthetics.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    You might also like:
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {result.alternativeAesthetics.map((aesthetic) => (
                                        <div
                                            key={aesthetic.id}
                                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                                        >
                                            <h4 className="font-semibold text-gray-900 mb-1">
                                                {aesthetic.name}
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {Math.round(aesthetic.percentage)}% match
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
                                type="button"
                            >
                                Start Shopping
                            </button>
                            <button
                                onClick={() => navigate('/aesthetic-selection')}
                                className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border border-gray-300 transition-all duration-200"
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
        <div className="min-h-screen bg-linear-to-br from-purple-50 to-teal-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
                        type="button"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Style Quiz</h1>
                    <p className="text-gray-600">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </p>
                    {/* Progress Bar */}
                    <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-purple-600 h-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                        {currentQuestion.question}
                    </h2>

                    <div className="space-y-3">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleOptionSelect(option.id)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${currentAnswer === option.id
                                        ? 'border-purple-600 bg-purple-50'
                                        : 'border-gray-200 hover:border-purple-300 bg-white'
                                    }`}
                                type="button"
                            >
                                <div className="flex items-center">
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${currentAnswer === option.id
                                                ? 'border-purple-600 bg-purple-600'
                                                : 'border-gray-300'
                                            }`}
                                    >
                                        {currentAnswer === option.id && (
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        )}
                                    </div>
                                    <span className="text-gray-900">{option.text}</span>
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
                        className="flex items-center px-6 py-3 text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        type="button"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Previous
                    </button>

                    {currentQuestionIndex === questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!isQuizComplete || isSubmitting}
                            className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
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
                            className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
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