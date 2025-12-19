import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useAesthetic } from '@/hooks/useAesthetic';
import { useApi } from '@/hooks/useApi';
import { productApi } from '@/api/product.api';
import { userApi } from '@/api/user.api';
import { adminApi } from '@/api/admin.api';
import { Product } from '@/types/product.types';
import { Aesthetic } from '@/types/aesthetic.types';

export const HomePage: React.FC = () => {
    const { refreshUser } = useAuth();
    const { selectedAesthetic, availableAesthetics, setSelectedAesthetic } = useAesthetic();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [currentSlide, setCurrentSlide] = useState(0);

    const { data: productsData, isLoading, execute: fetchProducts } = useApi<
        { products: Product[] },
        string
    >((aestheticId) => productApi.getByAesthetic(aestheticId, 8));

    const { execute: selectAestheticApi } = useApi<void, string>((aestheticId) =>
        userApi.selectAesthetic(aestheticId)
    );

    const { data: carousel, execute: fetchCarousel } = useApi(() => adminApi.getActiveCarousel());
    const { data: content, execute: fetchContent } = useApi(() => adminApi.getAllContent());

    // Use data directly instead of storing in state
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
        if (selectedAesthetic?.id) {
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
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [carouselItems.length]);

    const handleAestheticSelect = async (aesthetic: Aesthetic) => {
        try {
            await selectAestheticApi(aesthetic.id);
            setSelectedAesthetic(aesthetic);
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
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"%3E%3Crect fill="%23e5e7eb" width="300" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
    };

    const displayAesthetics = availableAesthetics?.slice(0, 6) || [];
    const collectionLabels = [
        'Trending Outerwear',
        'Statement Pieces',
        'New Arrivals',
        'Seasonal Favorites'
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    };

    return (
        <div className="w-full">
            {/* Hero Carousel */}
            <div className="relative w-full h-96 md:h-125 bg-gray-900 overflow-hidden">
                {carouselItems.length > 0 ? (
                    <>
                        {carouselItems.map((item, index) => (
                            <div
                                key={item.id}
                                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
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
                                            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-wider drop-shadow-lg">
                                                {item.title ||
                                                    contentMap.hero_tagline ||
                                                    'Shop By Vibe'}
                                            </h1>
                                            {item.subtitle && (
                                                <p className="text-xl md:text-2xl text-white mt-4 drop-shadow-lg">
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
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-all"
                                    aria-label="Previous slide"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-all"
                                    aria-label="Next slide"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Dots Indicator */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                                    {carouselItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setCurrentSlide(carouselItems.indexOf(item))}
                                            className={`w-3 h-3 rounded-full transition-all ${carouselItems.indexOf(item) === currentSlide
                                                    ? 'bg-white w-8'
                                                    : 'bg-white/50'
                                                }`}
                                            aria-label={`Go to slide ${carouselItems.indexOf(item) + 1}`}
                                        />
                                    ))}
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
                            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-wider drop-shadow-lg">
                                {contentMap.hero_tagline || 'Shop By Vibe'}
                            </h1>
                        </div>
                    </div>
                )}
            </div>

            {/* Aesthetic Categories */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-gray-100">
                    <div className="flex space-x-6 md:space-x-8 min-w-max md:justify-center">
                        {displayAesthetics.map((aesthetic) => (
                            <button
                                key={aesthetic.id}
                                onClick={() => handleAestheticSelect(aesthetic)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleAestheticSelect(aesthetic);
                                    }
                                }}
                                className="flex flex-col items-center group cursor-pointer transition-all"
                            >
                                <div
                                    className={`w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden mb-3 ring-4 transition-all ${selectedAesthetic?.id === aesthetic.id
                                            ? 'ring-teal-600 scale-105'
                                            : 'ring-transparent group-hover:ring-teal-400'
                                        }`}
                                >
                                    {aesthetic.imageUrl ? (
                                        <img
                                            src={aesthetic.imageUrl}
                                            alt={aesthetic.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-linear-to-br from-teal-400 to-teal-600"></div>
                                    )}
                                </div>
                                <span
                                    className={`text-sm font-medium ${selectedAesthetic?.id === aesthetic.id
                                            ? 'text-teal-700 underline decoration-2 underline-offset-4'
                                            : 'text-gray-700'
                                        }`}
                                >
                                    {aesthetic.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Curated Collections */}
            {selectedAesthetic && featuredProducts.length > 0 && !isLoading && (
                <div className="bg-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-12 text-center">
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
                                    <div className="aspect-square overflow-hidden bg-gray-50 mb-4 rounded-lg">
                                        <img
                                            src={getProductImage(product)}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <h3 className="text-center text-sm font-medium text-gray-900 mb-1">
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
                <div className="text-center py-16 bg-white">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                    <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
            )}

            {/* Merchant CTA */}
            <div className="bg-stone-100 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                        {contentMap.merchant_cta_title ||
                            'Sell Your Vibe. Become a MoodRobe Merchant'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {contentMap.merchant_cta_subtitle ||
                            'Join our community of fashion creators'}
                    </p>
                    <button
                        onClick={() => navigate('/merchant/register')}
                        className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-md font-medium transition-colors"
                    >
                        Join Now
                    </button>
                </div>
            </div>

            {/* Style Quiz CTA */}
            {!selectedAesthetic && (
                <div className="bg-linear-to-r from-teal-700 to-teal-900 py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                        <h3 className="text-3xl md:text-4xl font-bold mb-4">
                            {contentMap.style_quiz_title ||
                                'NOT SURE? TAKE THE QUIZ AND FIND YOUR VIBE'}
                        </h3>
                        <p className="text-teal-100 mb-8 text-lg">
                            {contentMap.style_quiz_subtitle ||
                                'Answer a few questions and discover the perfect aesthetic for your style'}
                        </p>
                        <button
                            onClick={() => navigate('/style-quiz')}
                            className="bg-white text-teal-800 px-10 py-4 rounded-full font-bold text-lg hover:bg-teal-50 transition-all duration-300 shadow-lg"
                        >
                            Start Style Quiz
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};