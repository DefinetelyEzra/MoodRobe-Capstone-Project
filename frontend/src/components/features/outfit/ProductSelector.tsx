import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Product } from '@/types/product.types';
import { OutfitSlotType, SLOT_CATEGORIES } from '@/types/outfit.types';
import { productApi } from '@/api/product.api';
import { useToast } from '@/hooks/useToast';
import { useAesthetic } from '@/hooks/useAesthetic';

interface ProductSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    slotType: OutfitSlotType;
    onSelect: (product: Product) => void;
    cartProducts?: Product[];
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
    isOpen,
    onClose,
    slotType,
    onSelect,
    cartProducts = []
}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'cart' | 'browse'>('cart');
    const { showToast } = useToast();
    const { selectedAesthetic } = useAesthetic();

    useEffect(() => {
        if (isOpen && activeTab === 'browse') {
            loadProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, activeTab, slotType]);

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const categories = SLOT_CATEGORIES[slotType];

            const response = await productApi.search({
                category: categories[0],
                aestheticTags: selectedAesthetic ? [selectedAesthetic.id] : undefined,
                isActive: true,
                limit: 20
            });

            setProducts(response.products);
        } catch (error) {
            console.error('Failed to load products:', error);
            showToast('Failed to load products', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            loadProducts();
            return;
        }

        try {
            setIsLoading(true);
            const response = await productApi.search({
                searchTerm,
                category: SLOT_CATEGORIES[slotType][0],
                isActive: true,
                limit: 20
            });

            setProducts(response.products);
        } catch (error) {
            console.error('Failed to search products:', error);
            showToast('Failed to search products', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const getProductImage = (product: Product) => {
        if (product.images && product.images.length > 0) {
            const primaryImage = product.images.find(img => img.isPrimary);
            return primaryImage?.imageUrl || product.images[0].imageUrl;
        }
        return null;
    };

    const filteredCartProducts = cartProducts.filter(product => {
        const categories = SLOT_CATEGORIES[slotType];
        return categories.includes(product.category);
    });

    const displayProducts = activeTab === 'cart' ? filteredCartProducts : products;

    let content;
    if (isLoading) {
        content = (
            <div className="flex justify-center py-12">
                <LoadingSpinner text="Loading products..." />
            </div>
        );
    } else if (displayProducts.length === 0) {
        content = (
            <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary">
                    {activeTab === 'cart'
                        ? 'No matching products in your cart'
                        : 'No products found'}
                </p>
            </div>
        );
    } else {
        content = (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {displayProducts.map((product) => {
                    const productImage = getProductImage(product);

                    return (
                        <button
                            key={product.id}
                            onClick={() => {
                                onSelect(product);
                                onClose();
                            }}
                            className="group text-left"
                        >
                            <div className="bg-surface rounded-lg border border-border hover:border-accent transition-all overflow-hidden">
                                <div className="aspect-square bg-canvas overflow-hidden">
                                    {productImage ? (
                                        <img
                                            src={productImage}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ShoppingBag className="w-12 h-12 text-text-secondary" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-2">
                                    <h4 className="font-medium text-sm text-text-primary truncate group-hover:text-accent transition-colors">
                                        {product.name}
                                    </h4>
                                    <p className="text-xs text-accent font-semibold mt-1">
                                        ₦{product.basePrice.amount.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Select Product" size="xl">
            <div className="space-y-4">
                {/* Tabs */}
                <div className="flex border-b border-border">
                    <button
                        onClick={() => setActiveTab('cart')}
                        className={`px-6 py-3 font-medium transition-colors ${activeTab === 'cart'
                                ? 'border-b-2 border-accent text-accent'
                                : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        From Cart ({filteredCartProducts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('browse')}
                        className={`px-6 py-3 font-medium transition-colors ${activeTab === 'browse'
                                ? 'border-b-2 border-accent text-accent'
                                : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        Browse Products
                    </button>
                </div>

                {/* Search (only for browse tab) */}
                {activeTab === 'browse' && (
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                            <Input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-10"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2 bg-accent hover:bg-accent-dark text-surface rounded-lg font-medium transition-colors"
                        >
                            Search
                        </button>
                    </div>
                )}

                {/* Products Grid */}
                <div className="max-h-96 overflow-y-auto">
                    {content}
                </div>
            </div>
        </Modal>
    );
};