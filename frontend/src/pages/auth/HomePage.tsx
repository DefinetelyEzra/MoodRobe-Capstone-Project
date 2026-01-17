import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useAesthetic } from '@/hooks/useAesthetic';
import { useApi } from '@/hooks/useApi';
import { productApi } from '@/api/product.api';
import { userApi } from '@/api/user.api';
import { adminApi } from '@/api/admin.api';
import { Product } from '@/types/product.types';
import { Aesthetic } from '@/types/aesthetic.types';
import { useMerchant } from '@/hooks/useMerchant';

export const HomePage: React.FC = () => {
    const { refreshUser } = useAuth();
    const { selectedAesthetic, availableAesthetics, setSelectedAesthetic } = useAesthetic();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [aestheticScrollIndex, setAestheticScrollIndex] = useState(0);
    const { currentMerchant } = useMerchant();

    const aestheticsPerView = 6;
    const aestheticsWithNone = useMemo(() => {
        const noneOption: Aesthetic = {
            id: 'none',
            name: 'None',
            description: 'Default theme - Clean and minimal',
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

    const totalAestheticPages = Math.ceil(aestheticsWithNone.length / aestheticsPerView);
    const canScrollAestheticLeft = aestheticScrollIndex > 0;
    const canScrollAestheticRight = aestheticScrollIndex < totalAestheticPages - 1;

    const { data: productsData, isLoading, execute: fetchProducts } = useApi<
        { products: Product[] },
        string
    >((aestheticId) => productApi.getByAesthetic(aestheticId, 8));

    const { execute: selectAestheticApi } = useApi<void, string>((aestheticId) =>
        userApi.selectAesthetic(aestheticId)
    );

    const { data: carousel, execute: fetchCarousel } = useApi(() => adminApi.getActiveCarousel());
    const { data: content, execute: fetchContent } = useApi(() => adminApi.getAllContent());

    const carouselItems = useMemo(() => carousel || [], [carousel]);

    const contentMap = useMemo(() => {
        if (!content) return {};
        const map: Record<string, string> = {};
        content.forEach((item) => {
            map[item.sectionKey] = item.content;
        });
        return map;
    }, [content]);

    const featuredProducts = productsData?.products || [];

    const visibleAesthetics = aestheticsWithNone.slice(
        aestheticScrollIndex * aestheticsPerView,
        (aestheticScrollIndex + 1) * aestheticsPerView
    );

    const collectionLabels = [
        'Trending Outerwear',
        'Statement Pieces',
        'New Arrivals',
        'Seasonal Favorites'
    ];

    const loadPageContent = useCallback(async () => {
        try {
            await Promise.all([fetchCarousel(), fetchContent()]);
        } catch (error) {
            console.error('Failed to load page content:', error);
        }
    }, [fetchCarousel, fetchContent]);

    useEffect(() => {
        loadPageContent();
    }, [loadPageContent]);

    useEffect(() => {
        if (selectedAesthetic?.id && selectedAesthetic.id !== 'none') {
            fetchProducts(selectedAesthetic.id).catch((error) => {
                if (error?.name !== 'AbortError' && error?.message !== 'Request aborted') {
                    console.error('Failed to fetch products:', error);
                }
            });
        }
    }, [selectedAesthetic?.id, fetchProducts]);

    useEffect(() => {
        if (carouselItems.length > 1) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
            }, 10000);
            return () => clearInterval(timer);
        }
    }, [carouselItems.length]);

    const handleAestheticSelect = async (aesthetic: Aesthetic) => {
        try {
            if (aesthetic.id === 'none') {
                await userApi.clearAesthetic();
                setSelectedAesthetic(null);
            } else {
                await selectAestheticApi(aesthetic.id);
                setSelectedAesthetic(aesthetic);
            }
            if (refreshUser) {
                await refreshUser();
            }
        } catch (error) {
            console.error('Failed to select aesthetic:', error);
            showToast('Failed to select aesthetic', 'warning', 4000);
        }
    };

    const getProductImage = (product: Product) => {
        if (product.images && product.images.length > 0) {
            const primaryImage = product.images.find((img) => img.isPrimary);
            return primaryImage?.imageUrl || product.images[0].imageUrl;
        }
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"%3E%3Crect fill="%23EAEAE7" width="300" height="400"/%3E%3Ctext fill="%236B6B6B" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
    };

    const scrollAestheticsLeft = () => {
        if (canScrollAestheticLeft) {
            setAestheticScrollIndex(prev => prev - 1);
        }
    };

    const scrollAestheticsRight = () => {
        if (canScrollAestheticRight) {
            setAestheticScrollIndex(prev => prev + 1);
        }
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    };

    // Helper function to render aesthetic image
    const renderAestheticImage = (aesthetic: Aesthetic) => {
        const isNone = aesthetic.id === 'none';

        if (isNone) {
            return (
                <div className="w-full h-full bg-linear-to-br from-canvas to-input flex items-center justify-center">
                    <X className="w-16 h-16 text-text-secondary" />
                </div>
            );
        }

        if (aesthetic.imageUrl) {
            return (
                <img
                    src={aesthetic.imageUrl}
                    alt={aesthetic.name}
                    className="w-full h-full object-cover"
                />
            );
        }

        return (
            <div className="w-full h-full bg-linear-to-br from-accent-light to-accent"></div>
        );
    };

    return (
        <div className="w-full bg-canvas">
            {/* Hero Carousel */}
            <div className="relative w-full h-96 md:h-125 bg-text-primary overflow-hidden">
                {carouselItems.length > 0 ? (
                    <>
                        {carouselItems.map((item) => (
                            <div
                                key={item.id}
                                className={`absolute inset-0 transition-opacity duration-1000 ${carouselItems.indexOf(item) === currentSlide ? 'opacity-100' : 'opacity-0'
                                    }`}
                            >
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{
                                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('${item.imageUrl}')`
                                    }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <h1 className="text-5xl md:text-7xl font-bold text-surface tracking-wider drop-shadow-lg">
                                                {item.title ||
                                                    contentMap.hero_tagline ||
                                                    'Shop By Vibe'}
                                            </h1>
                                            {item.subtitle && (
                                                <p className="text-xl md:text-2xl text-surface mt-4 drop-shadow-lg">
                                                    {item.subtitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Carousel Controls */}
                        {carouselItems.length > 1 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-surface/30 hover:bg-surface/50 text-surface p-3 rounded-full transition-all"
                                    aria-label="Previous slide"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-surface/30 hover:bg-surface/50 text-surface p-3 rounded-full transition-all"
                                    aria-label="Next slide"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Dots Indicator */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                                    {carouselItems.map((item) => {
                                        const itemIndex = carouselItems.indexOf(item);
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => setCurrentSlide(itemIndex)}
                                                className={`w-3 h-3 rounded-full transition-all ${itemIndex === currentSlide
                                                        ? 'bg-surface w-8'
                                                        : 'bg-surface/50'
                                                    }`}
                                                aria-label={`Go to slide ${itemIndex + 1}`}
                                            />
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=1600&h=900&fit=crop')`
                        }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h1 className="text-5xl md:text-7xl font-bold text-surface tracking-wider drop-shadow-lg">
                                {contentMap.hero_tagline || 'Shop By Vibe'}
                            </h1>
                        </div>
                    </div>
                )}
            </div>

            {/* Aesthetic Categories */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-8 text-center">
                    Choose Your Aesthetic
                </h2>
                <div className="relative">
                    {/* Left Arrow */}
                    {canScrollAestheticLeft && (
                        <button
                            onClick={scrollAestheticsLeft}
                            className="absolute left-0 top-[45%] -translate-y-1/2 z-10 w-12 h-12 bg-accent hover:bg-accent-dark text-surface rounded-full shadow-lg transition-all flex items-center justify-center"
                            aria-label="Previous aesthetics"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}

                    {/* Aesthetics Container */}
                    <div className="overflow-hidden py-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 px-12 transition-all duration-500 ease-in-out">
                            {visibleAesthetics.map((aesthetic) => {
                                const isNone = aesthetic.id === 'none';
                                const isSelected = selectedAesthetic?.id === aesthetic.id ||
                                    (isNone && !selectedAesthetic);

                                return (
                                    <button
                                        key={aesthetic.id}
                                        onClick={() => handleAestheticSelect(aesthetic)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                handleAestheticSelect(aesthetic);
                                            }
                                        }}
                                        className="flex flex-col items-center group cursor-pointer transition-all animate-in fade-in duration-300"
                                    >
                                        <div
                                            className={`w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden mb-3 ring-4 transition-all ${isSelected
                                                    ? 'ring-accent scale-105 shadow-lg'
                                                    : 'ring-border group-hover:ring-accent-light group-hover:scale-105'
                                                }`}
                                        >
                                            {renderAestheticImage(aesthetic)}
                                        </div>
                                        <span
                                            className={`text-sm font-medium text-center ${isSelected
                                                    ? 'text-accent underline decoration-2 underline-offset-4'
                                                    : 'text-text-primary'
                                                }`}
                                        >
                                            {aesthetic.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Arrow */}
                    {canScrollAestheticRight && (
                        <button
                            onClick={scrollAestheticsRight}
                            className="absolute right-0 top-[45%] -translate-y-1/2 z-10 w-12 h-12 bg-accent hover:bg-accent-dark text-surface rounded-full shadow-lg transition-all flex items-center justify-center"
                            aria-label="Next aesthetics"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    )}

                    {/* Page Indicators */}
                    {totalAestheticPages > 1 && (
                        <div className="flex justify-center mt-6 space-x-2">
                            {Array.from({ length: totalAestheticPages }, (_, index) => (
                                <button
                                    key={`aesthetic-page-${index}`}
                                    onClick={() => setAestheticScrollIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${index === aestheticScrollIndex
                                            ? 'bg-accent w-6'
                                            : 'bg-border hover:bg-accent/50'
                                        }`}
                                    aria-label={`Go to aesthetic page ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Curated Collections */}
            {selectedAesthetic && selectedAesthetic.id !== 'none' && featuredProducts.length > 0 && !isLoading && (
                <div className="bg-surface py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-12 text-center">
                            Curated Collections
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                            {featuredProducts.slice(0, 4).map((product, index) => (
                                <div
                                    key={product.id}
                                    onClick={() => navigate(`/products/${product.id}`)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            navigate(`/products/${product.id}`);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    className="cursor-pointer group"
                                >
                                    <div className="aspect-square overflow-hidden bg-canvas mb-4 rounded-lg border border-border">
                                        <img
                                            src={getProductImage(product)}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <h3 className="text-center text-sm font-medium text-text-primary mb-1">
                                        {collectionLabels[index] || product.name}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="text-center py-16 bg-surface">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                    <p className="mt-4 text-text-secondary">Loading products...</p>
                </div>
            )}

            {/* Merchant CTA */}
            <div className="bg-canvas py-16 border-t border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4">
                        {currentMerchant
                            ? 'Manage Your Store'
                            : (contentMap.merchant_cta_title || 'Sell Your Vibe. Become a MoodRobe Merchant')
                        }
                    </h2>
                    <p className="text-text-secondary mb-6">
                        {currentMerchant
                            ? 'View your products, orders, and analytics'
                            : (contentMap.merchant_cta_subtitle || 'Join our community of fashion creators')
                        }
                    </p>
                    <button
                        onClick={() => navigate(currentMerchant ? '/merchant/dashboard' : '/merchant/register')}
                        className="inline-block bg-text-primary hover:bg-accent-dark text-surface px-8 py-3 rounded-md font-medium transition-colors"
                    >
                        {currentMerchant ? 'Go to Dashboard' : 'Join Now'}
                    </button>
                </div>
            </div>

            {/* Style Quiz CTA */}
            {!selectedAesthetic && (
                <div className="bg-linear-to-r from-accent-dark to-accent py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-surface">
                        <h3 className="text-3xl md:text-4xl font-bold mb-4">
                            {contentMap.style_quiz_title ||
                                'NOT SURE? TAKE THE QUIZ AND FIND YOUR VIBE'}
                        </h3>
                        <p className="text-canvas mb-8 text-lg">
                            {contentMap.style_quiz_subtitle ||
                                'Answer a few questions and discover the perfect aesthetic for your style'}
                        </p>
                        <button
                            onClick={() => navigate('/style-quiz')}
                            className="bg-surface text-accent px-10 py-4 rounded-full font-bold text-lg hover:bg-canvas transition-all duration-300 shadow-lg"
                        >
                            Start Style Quiz
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};