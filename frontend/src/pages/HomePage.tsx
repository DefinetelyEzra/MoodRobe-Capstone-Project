import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useAesthetic } from '@/hooks/useAesthetic';
import { useApi } from '@/hooks/useApi';
import { Sparkles } from 'lucide-react';
import { AestheticSelector } from '@/components/features/aesthetic/AestheticSelector';
import { userApi } from '@/api/user.api';
import { productApi } from '@/api/product.api';
import { Product } from '@/types/product.types';
import { Aesthetic } from '@/types/aesthetic.types';

export const HomePage: React.FC = () => {
    const { user, refreshUser } = useAuth();
    const {
        selectedAesthetic,
        availableAesthetics,
        setSelectedAesthetic
    } = useAesthetic();
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Use api hook for fetching products
    const {
        data: productsData,
        isLoading,
        execute: fetchProducts
    } = useApi<{ products: Product[] }, string>((aestheticId) =>
        productApi.getByAesthetic(aestheticId, 8)
    );

    // Use api hook for selecting aesthetic
    const {
        execute: selectAestheticApi
    } = useApi<void, string>((aestheticId) =>
        userApi.selectAesthetic(aestheticId)
    );

    const featuredProducts = productsData?.products || [];

    // Fetch featured products based on selected aesthetic
    useEffect(() => {
        if (selectedAesthetic?.id) {
            fetchProducts(selectedAesthetic.id).catch((error) => {
                // Don't log aborted requests as errors
                if (error?.name !== 'AbortError' && error?.message !== 'Request aborted') {
                    console.error('Failed to fetch products:', error);
                }
            });
        }
    }, [selectedAesthetic?.id, fetchProducts]);

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

    const formatPrice = (price: { amount: number; currency: string }) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: price.currency || 'USD',
        }).format(price.amount);
    };

    const getProductImage = (product: Product) => {
        if (product.images && product.images.length > 0) {
            const primaryImage = product.images.find(img => img.isPrimary);
            return primaryImage?.imageUrl || product.images[0].imageUrl;
        }
        return 'https://via.placeholder.com/300x400?text=No+Image';
    };

    const handleProductKeyPress = (event: React.KeyboardEvent, productId: string) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            navigate(`/products/${productId}`);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                    DISCOVER YOUR STYLE: SELECT AN AESTHETIC
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Welcome back, {user?.name}! Explore fashion curated for your unique vibe.
                </p>
            </div>

            {/* Aesthetic Selector */}
            {availableAesthetics && availableAesthetics.length > 0 && (
                <div className="mb-12">
                    <AestheticSelector
                        aesthetics={availableAesthetics}
                        selectedAesthetic={selectedAesthetic}
                        onSelect={handleAestheticSelect}
                        variant="compact"
                    />

                    {/* Selected Aesthetic Display */}
                    {selectedAesthetic && (
                        <div className="mt-8 bg-linear-to-r from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="relative h-64 md:h-96">
                                {selectedAesthetic.imageUrl ? (
                                    <img
                                        src={selectedAesthetic.imageUrl}
                                        alt={selectedAesthetic.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-linear-to-br from-teal-700 to-slate-800" />
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <div className="text-center text-white px-4">
                                        <h2 className="text-3xl md:text-5xl font-bold mb-2">
                                            {selectedAesthetic.name.toUpperCase()}
                                        </h2>
                                        <p className="text-lg md:text-xl text-white/90 mb-4">
                                            {selectedAesthetic.description}
                                        </p>
                                        <div className="mt-4">
                                            <span className="inline-block bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                                                ✓ Selected
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* No Aesthetic Selected */}
                    {!selectedAesthetic && (
                        <div className="mt-8 bg-linear-to-r from-purple-100 to-teal-100 rounded-2xl p-8 md:p-12 text-center">
                            <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                No Aesthetic Selected
                            </h3>
                            <p className="text-gray-700 mb-6">
                                Choose an aesthetic above or take our style quiz to discover your perfect match!
                            </p>
                            <button
                                onClick={() => navigate('/style-quiz')}
                                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                            >
                                Take Style Quiz
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Featured Products */}
            {selectedAesthetic && featuredProducts.length > 0 && !isLoading && (
                <div className="mb-12">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                        Curated for Your Aesthetic
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {featuredProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => navigate(`/products/${product.id}`)}
                                onKeyDown={(e) => handleProductKeyPress(e, product.id)}
                                tabIndex={0}
                                role="button"
                                aria-label={`View ${product.name} product details`}
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                            >
                                <div className="aspect-square overflow-hidden bg-gray-100">
                                    <img
                                        src={getProductImage(product)}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base truncate">
                                        {product.name}
                                    </h4>
                                    <p className="text-teal-700 font-bold text-lg">
                                        {formatPrice(product.basePrice)}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {product.aestheticTags.slice(0, 2).map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <button
                            onClick={() => navigate('/products')}
                            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            View All Products
                        </button>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                    <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
            )}

            {/* No Products State */}
            {selectedAesthetic && !isLoading && featuredProducts.length === 0 && (
                <div className="mb-12 text-center py-12 bg-linear-to-r from-purple-50 to-teal-50 rounded-2xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        No Products Found
                    </h3>
                    <p className="text-gray-700 mb-6">
                        We couldn't find any products matching your selected aesthetic. Check back soon!
                    </p>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                        Browse All Products
                    </button>
                </div>
            )}

            {/* CTA Banner */}
            <div className="bg-linear-to-r from-teal-700 to-teal-900 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    NOT SURE? TAKE THE QUIZ AND FIND YOUR VIBE
                </h3>
                <p className="text-teal-100 mb-6 text-lg max-w-2xl mx-auto">
                    Answer a few questions and discover the perfect aesthetic for your style
                </p>
                <button
                    onClick={() => navigate('/style-quiz')}
                    className="bg-white text-teal-800 px-8 py-3 rounded-full font-bold text-lg hover:bg-teal-50 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                    Start Style Quiz
                </button>
            </div>
        </div>
    );
};