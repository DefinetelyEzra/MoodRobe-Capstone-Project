import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Star, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAesthetic } from '@/hooks/useAesthetic';
import { useAuth } from '@/hooks/useAuth';
import { useMerchant } from '@/hooks/useMerchant';
import { useApi } from '@/hooks/useApi';
import { userApi } from '@/api/user.api';
import { Aesthetic } from '@/types/aesthetic.types';

export const AestheticSelectionPage: React.FC = () => {
    const { error, availableAesthetics, isLoading, setSelectedAesthetic } = useAesthetic();
    const { refreshUser } = useAuth();
    const { currentMerchant } = useMerchant();
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const {
        isLoading: isSaving,
        execute: selectAestheticApi
    } = useApi<void, string>((aestheticId) =>
        userApi.selectAesthetic(aestheticId)
    );

    const aestheticsWithNone = useMemo(() => {
        const noneOption: Aesthetic = {
            id: 'none',
            name: 'None',
            description: 'Default theme - Clean and minimal design',
            themeProperties: {
                colors: [],
                style: 'default'
            },
            imageUrl: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        return [noneOption, ...(availableAesthetics || [])];
    }, [availableAesthetics]);

    const handleSelect = async (aesthetic: Aesthetic) => {
        setSelectedId(aesthetic.id);

        try {
            if (aesthetic.id === 'none') {
                await userApi.clearAesthetic();
                setSelectedAesthetic(null);
                await refreshUser();
            } else {
                await selectAestheticApi(aesthetic.id);
                setSelectedAesthetic(aesthetic);
                await refreshUser();
            }
            navigate('/');
        } catch (error) {
            console.error('Failed to save aesthetic:', error);
        } finally {
            setSelectedId(null);
        }
    };

    // Helper function to render aesthetic image
    const renderAestheticImage = (aesthetic: Aesthetic) => {
        const isNone = aesthetic.id === 'none';

        if (isNone) {
            return (
                <div className="w-full h-full bg-linear-to-br from-canvas to-input flex items-center justify-center">
                    <X className="w-20 h-20 text-text-secondary group-hover:text-accent transition-colors" />
                </div>
            );
        }

        if (aesthetic.imageUrl) {
            return (
                <img
                    src={aesthetic.imageUrl}
                    alt={aesthetic.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            );
        }

        return (
            <div className="w-full h-full bg-linear-to-br from-accent-light to-accent flex items-center justify-center">
                <span className="text-surface font-bold text-2xl">
                    {aesthetic.name.charAt(0)}
                </span>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner text="Loading aesthetics..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto text-center py-12">
                <h2 className="text-2xl font-bold text-accent mb-4">Error Loading Aesthetics</h2>
                <p className="text-text-secondary mb-6">{error}</p>
                <Button onClick={() => globalThis.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-canvas">
            {/* Hero Section */}
            <div className="bg-linear-to-b from-accent/10 to-canvas py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                        What's Your Vibe? Start Shopping
                    </h1>
                    <button
                        onClick={() => navigate('/style-quiz')}
                        className="inline-block bg-accent hover:bg-accent-dark text-surface px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl mt-6"
                    >
                        Take MoodRobe Style Quiz (1 Minute)
                    </button>
                </div>
            </div>

            {/* How It Works */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold text-text-primary mb-8">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-surface rounded-xl p-6 border border-border flex items-start space-x-4">
                        <div className="bg-accent/10 rounded-full p-3 shrink-0">
                            <Lightbulb className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <div className="flex items-center mb-2">
                                <span className="font-bold text-text-primary text-lg">1. Quiz</span>
                                <ArrowRight className="w-5 h-5 text-text-secondary ml-2" />
                            </div>
                            <p className="text-text-secondary text-sm">
                                Answer quick questions about your style preferences
                            </p>
                        </div>
                    </div>

                    <div className="bg-surface rounded-xl p-6 border border-border flex items-start space-x-4">
                        <div className="bg-accent/10 rounded-full p-3 shrink-0">
                            <Star className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <span className="font-bold text-text-primary text-lg block mb-2">2. Match</span>
                            <p className="text-text-secondary text-sm">
                                We'll match you with aesthetics that fit your vibe
                            </p>
                        </div>
                    </div>

                    <div className="bg-surface rounded-xl p-6 border border-border flex items-start space-x-4">
                        <div className="bg-accent/10 rounded-full p-3 shrink-0">
                            <ShoppingBag className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <span className="font-bold text-text-primary text-lg block mb-2">3. Shop Your Look</span>
                            <p className="text-text-secondary text-sm">
                                Browse curated products tailored to your aesthetic
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Aesthetics Grid */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold text-text-primary mb-8">Or, Explore Aesthetics</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {aestheticsWithNone.map((aesthetic) => (
                        <button
                            key={aesthetic.id}
                            onClick={() => handleSelect(aesthetic)}
                            disabled={isSaving && selectedId === aesthetic.id}
                            className="group relative bg-surface rounded-xl overflow-hidden border-2 border-border hover:border-accent transition-all duration-300 hover:shadow-lg"
                        >
                            {/* Image */}
                            <div className="aspect-square overflow-hidden bg-canvas">
                                {renderAestheticImage(aesthetic)}
                            </div>

                            {/* Label */}
                            <div className="p-4 bg-surface">
                                <h3 className="font-semibold text-text-primary text-center group-hover:text-accent transition-colors">
                                    {aesthetic.name}
                                </h3>
                                {aesthetic.description && (
                                    <p className="text-xs text-text-secondary text-center mt-1 line-clamp-2">
                                        {aesthetic.description}
                                    </p>
                                )}
                            </div>

                            {/* Loading overlay */}
                            {isSaving && selectedId === aesthetic.id && (
                                <div className="absolute inset-0 bg-surface/80 flex items-center justify-center">
                                    <LoadingSpinner />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="bg-linear-to-r from-accent-dark to-accent py-16 px-4 mt-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-surface mb-4">
                        Not Sure? Take the Quiz and Find Your Vibe
                    </h2>
                    <button
                        onClick={() => navigate('/style-quiz')}
                        className="bg-surface text-accent hover:bg-canvas px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Start Style Quiz
                    </button>
                </div>
            </div>

            {/* Testimonial & Merchant CTA */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Testimonial */}
                    <div className="bg-surface rounded-xl p-8 border border-border">
                        <p className="text-text-primary text-lg italic mb-4">
                            "MoodRobe helped me finally find clothes that truly express me!"
                        </p>
                        <p className="text-text-secondary text-sm">
                            - Sarah K, from Brooklyn
                        </p>
                    </div>

                    {/* Merchant CTA */}
                    <div className="bg-linear-to-br from-canvas to-accent/5 rounded-xl p-8 border border-border">
                        <h3 className="text-xl font-bold text-text-primary mb-2">
                            {currentMerchant ? 'Manage Your Store' : 'Sell Your Vibe'}
                        </h3>
                        <p className="text-text-secondary mb-4">
                            {currentMerchant
                                ? 'Access your merchant dashboard'
                                : 'Become a MoodRobe Merchant'
                            }
                        </p>
                        <button
                            onClick={() => navigate(currentMerchant ? '/merchant/dashboard' : '/merchant/register')}
                            className="bg-accent hover:bg-accent-dark text-surface px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            {currentMerchant ? 'Go to Dashboard' : 'Learn More'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};