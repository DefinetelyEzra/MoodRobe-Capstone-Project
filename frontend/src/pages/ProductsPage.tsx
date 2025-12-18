import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { productApi } from '@/api/product.api';
import { useAesthetic } from '@/hooks/useAesthetic';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { Product, ProductSearchParams, ProductSearchResponse } from '@/types/product.types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

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
    const navigate = useNavigate();
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
            // Don't show error for aborted requests
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

    const getCategoryButtonClass = (category: string) => {
        let categoryButtonClass = 'px-4 py-2 rounded-lg border transition-colors ';
        categoryButtonClass += (filters.category === category)
            ? 'bg-teal-600 text-white border-teal-600'
            : 'bg-white text-gray-700 border-gray-300 hover:border-teal-600';
        return categoryButtonClass;
    };

    let content;
    if (isLoading && filters.offset === 0) {
        content = (
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner text="Loading products..." />
            </div>
        );
    } else if (products.length === 0) {
        content = (
            <Card>
                <div className="p-12 text-center">
                    <p className="text-gray-600 mb-4">No products found</p>
                    <p className="text-sm text-gray-500 mb-6">
                        Try adjusting your filters or search terms
                    </p>
                    <Button onClick={clearFilters}>
                        Clear Filters
                    </Button>
                </div>
            </Card>
        );
    } else {
        content = (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
                        return (
                            <Card
                                key={product.id}
                                hoverable
                                onClick={() => navigate(`/products/${product.id}`)}
                                className="cursor-pointer"
                            >
                                {primaryImage && (
                                    <img
                                        src={primaryImage.imageUrl}
                                        alt={primaryImage.altText || product.name}
                                        className="w-full h-64 object-cover"
                                    />
                                )}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-bold text-teal-600">
                                            ${product.basePrice.amount.toFixed(2)}
                                        </p>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {product.category}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
                {/* Load More Button */}
                {products.length < total && (
                    <div className="mt-8 flex justify-center">
                        <Button
                            onClick={handleLoadMore}
                            isLoading={isLoading}
                            size="lg"
                        >
                            Load More Products
                        </Button>
                    </div>
                )}
            </>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop Products</h1>
                <p className="text-gray-600">
                    {selectedAesthetic
                        ? `Discover products that match your ${selectedAesthetic.name} aesthetic`
                        : 'Discover products across all aesthetics'}
                </p>
            </div>
            {/* Search and Filter Bar */}
            <div className="mb-6 space-y-4">
                {/* Search Bar */}
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            className="pl-10"
                        />
                    </div>
                    <Button onClick={handleSearch}>
                        Search
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="w-5 h-5 mr-2" />
                        Filters
                    </Button>
                </div>
                {/* Filters Panel */}
                {showFilters && (
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                                    Filters
                                </h3>
                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={clearFilters}
                                    >
                                        Clear All
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-6">
                                {/* Category Filter */}
                                <div>
                                    <fieldset>
                                        <legend className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </legend>
                                        <div className="flex flex-wrap gap-2">
                                            {CATEGORIES.map((category) => (
                                                <button
                                                    key={category}
                                                    onClick={() => handleCategoryChange(category)}
                                                    className={getCategoryButtonClass(category)}
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
                                        <legend className="block text-sm font-medium text-gray-700 mb-2">
                                            Price Range
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
                                                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                            />
                                            <span className="text-sm text-gray-700">
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
                        <span className="text-sm text-gray-600">Active filters:</span>
                        {filters.category && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                                <span>{filters.category}</span>
                                <button
                                    onClick={() => handleCategoryChange(filters.category!)}
                                    className="hover:text-teal-900"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        {(filters.minPrice || filters.maxPrice) && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                                <span>
                                    ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                                </span>
                                <button
                                    onClick={() => {
                                        setFilters(prev => ({
                                            ...prev,
                                            minPrice: undefined,
                                            maxPrice: undefined,
                                        }));
                                    }}
                                    className="hover:text-teal-900"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        {filters.aestheticTags && selectedAesthetic && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                                <span>{selectedAesthetic.name}</span>
                                <button
                                    onClick={handleAestheticFilterToggle}
                                    className="hover:text-teal-900"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* Results Info */}
            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    Showing {products.length} of {total} products
                </p>
            </div>
            {/* Products Grid */}
            {content}
        </div>
    );
};