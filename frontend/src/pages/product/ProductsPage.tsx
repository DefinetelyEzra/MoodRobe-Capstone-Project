import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, X, Package } from 'lucide-react';
import { productApi } from '@/api/product.api';
import { useAesthetic } from '@/hooks/useAesthetic';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { Product, ProductSearchParams, ProductSearchResponse } from '@/types/product.types';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ProductCard } from '@/components/features/product/ProductCard';

const CATEGORIES = [
    'Tops',
    'Bottoms',
    'Dresses',
    'Outerwear',
    'Shoes',
    'Accessories',
    'Bags',
    'Jewelry'
];

export const ProductsPage: React.FC = () => {
    const { selectedAesthetic } = useAesthetic();
    const { showToast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<ProductSearchParams>({
        category: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        aestheticTags: selectedAesthetic ? [selectedAesthetic.id] : undefined,
        isActive: true,
        limit: 20,
        offset: 0,
    });

    const { isLoading, execute: searchProducts } = useApi<ProductSearchResponse, ProductSearchParams>(
        (params) => productApi.search(params)
    );

    // Load products
    useEffect(() => {
        loadProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const loadProducts = async () => {
        try {
            const searchParams: ProductSearchParams = {
                ...filters,
                searchTerm: searchTerm || undefined,
            };

            const response = await searchProducts(searchParams);
            if (response) {
                setProducts(response.products);
                setTotal(response.total);
            }
        } catch (error) {
            if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
                return;
            }
            console.error('Failed to load products:', error);
            showToast('Failed to load products. Please try again.', 'error');
        }
    };

    const handleSearch = () => {
        loadProducts();
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleCategoryChange = (category: string) => {
        setFilters(prev => ({
            ...prev,
            category: prev.category === category ? undefined : category,
            offset: 0,
        }));
    };

    const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
        const numValue = value ? Number.parseInt(value) : undefined;
        setFilters(prev => ({
            ...prev,
            [field]: numValue,
            offset: 0,
        }));
    };

    const handleAestheticFilterToggle = () => {
        setFilters(prev => {
            let aestheticTags;
            if (prev.aestheticTags) {
                aestheticTags = undefined;
            } else {
                aestheticTags = selectedAesthetic ? [selectedAesthetic.id] : undefined;
            }
            return {
                ...prev,
                aestheticTags,
                offset: 0,
            };
        });
    };

    const clearFilters = () => {
        setFilters({
            category: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            aestheticTags: undefined,
            limit: 20,
            offset: 0,
        });
        setSearchTerm('');
    };

    const handleLoadMore = () => {
        setFilters(prev => ({
            ...prev,
            offset: (prev.offset || 0) + (prev.limit || 20),
        }));
    };

    const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.aestheticTags;

    let content;
    if (isLoading && filters.offset === 0) {
        content = (
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner text="Loading products..." />
            </div>
        );
    } else if (products.length === 0) {
        content = (
            <Card className="bg-surface border border-border">
                <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-10 h-10 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">No products found</h3>
                    <p className="text-sm text-text-secondary mb-6">
                        Try adjusting your filters or search terms
                    </p>
                    <button
                        onClick={clearFilters}
                        className="px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            </Card>
        );
    } else {
        content = (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {products.length < total && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleLoadMore}
                            disabled={isLoading}
                            className="px-8 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Loading...' : 'Load More Products'}
                        </button>
                    </div>
                )}
            </>
        );
    }

    return (
        <div className="min-h-screen bg-canvas">
            {/* Header */}
            <div className="bg-linear-to-b from-accent/10 to-canvas border-b border-border">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <h1 className="text-4xl font-bold text-text-primary mb-2">Shop Products</h1>
                    <p className="text-text-secondary">
                        {selectedAesthetic
                            ? `Discover products that match your ${selectedAesthetic.name} aesthetic`
                            : 'Discover products across all aesthetics'}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Search and Filter Bar */}
                <div className="mb-6 space-y-4">
                    {/* Search Bar */}
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                            <Input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="pl-10 bg-surface border-border"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-medium transition-colors"
                        >
                            Search
                        </button>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-6 py-3 border border-border hover:bg-canvas text-text-primary rounded-lg font-medium transition-colors flex items-center"
                        >
                            <Filter className="w-5 h-5 mr-2" />
                            Filters
                        </button>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <Card className="bg-surface border border-border">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-text-primary flex items-center">
                                        <SlidersHorizontal className="w-5 h-5 mr-2 text-accent" />
                                        Filters
                                    </h3>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="px-4 py-2 text-sm border border-border hover:bg-canvas text-text-primary rounded-lg font-medium transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-6">
                                    {/* Category Filter */}
                                    <div>
                                        <fieldset>
                                            <legend className="block text-sm font-medium text-text-primary mb-2">
                                                Category
                                            </legend>
                                            <div className="flex flex-wrap gap-2">
                                                {CATEGORIES.map((category) => (
                                                    <button
                                                        key={category}
                                                        onClick={() => handleCategoryChange(category)}
                                                        className={`px-4 py-2 rounded-lg border transition-colors ${filters.category === category
                                                            ? 'bg-accent text-surface border-accent'
                                                            : 'bg-surface text-text-primary border-border hover:border-accent'
                                                            }`}
                                                    >
                                                        {category}
                                                    </button>
                                                ))}
                                            </div>
                                        </fieldset>
                                    </div>

                                    {/* Price Range Filter */}
                                    <div>
                                        <fieldset>
                                            <legend className="block text-sm font-medium text-text-primary mb-2">
                                                Price Range (₦)
                                            </legend>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    type="number"
                                                    placeholder="Min"
                                                    value={filters.minPrice || ''}
                                                    onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                                                    min="0"
                                                />
                                                <Input
                                                    type="number"
                                                    placeholder="Max"
                                                    value={filters.maxPrice || ''}
                                                    onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                                                    min="0"
                                                />
                                            </div>
                                        </fieldset>
                                    </div>

                                    {/* Aesthetic Filter */}
                                    {selectedAesthetic && (
                                        <div>
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={!!filters.aestheticTags}
                                                    onChange={handleAestheticFilterToggle}
                                                    className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
                                                />
                                                <span className="text-sm text-text-primary">
                                                    Only show {selectedAesthetic.name} products
                                                </span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm text-text-secondary">Active filters:</span>
                            {filters.category && (
                                <div className="flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm border border-accent/20">
                                    <span>{filters.category}</span>
                                    <button
                                        onClick={() => handleCategoryChange(filters.category!)}
                                        className="hover:text-accent-dark"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            {(filters.minPrice || filters.maxPrice) && (
                                <div className="flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm border border-accent/20">
                                    <span>
                                        ₦{filters.minPrice || '0'} - ₦{filters.maxPrice || '∞'}
                                    </span>
                                    <button
                                        onClick={() => {
                                            setFilters(prev => ({
                                                ...prev,
                                                minPrice: undefined,
                                                maxPrice: undefined,
                                            }));
                                        }}
                                        className="hover:text-accent-dark"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            {filters.aestheticTags && selectedAesthetic && (
                                <div className="flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm border border-accent/20">
                                    <span>{selectedAesthetic.name}</span>
                                    <button
                                        onClick={handleAestheticFilterToggle}
                                        className="hover:text-accent-dark"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Results Info */}
                <div className="mb-6">
                    <p className="text-sm text-text-secondary">
                        Showing {products.length} of {total} products
                    </p>
                </div>

                {/* Products Grid */}
                {content}
            </div>
        </div>
    );
};