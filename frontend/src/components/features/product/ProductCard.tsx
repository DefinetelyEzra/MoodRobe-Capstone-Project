import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types/product.types';
import { ShoppingBag } from 'lucide-react';
import { useAesthetic } from '@/hooks/useAesthetic';

interface ProductCardProps {
    product: Product;
    onProductClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
    const navigate = useNavigate();
    const { availableAesthetics } = useAesthetic();

    const handleClick = () => {
        if (onProductClick) {
            onProductClick(product);
        } else {
            navigate(`/products/${product.id}`);
        }
    };

    const getProductImage = () => {
        if (product.images && product.images.length > 0) {
            const primaryImage = product.images.find(img => img.isPrimary);
            return primaryImage?.imageUrl || product.images[0].imageUrl;
        }
        return null;
    };

    // Map aesthetic IDs to names
    const getAestheticNames = () => {
        if (!product.aestheticTags || product.aestheticTags.length === 0) return [];
        return product.aestheticTags
            .map(tagId => {
                const aesthetic = availableAesthetics.find(a => a.id === tagId);
                return aesthetic?.name || null;
            })
            .filter((name): name is string => name !== null);
    };

    const productImage = getProductImage();
    const aestheticNames = getAestheticNames();

    return (
        <div
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
            tabIndex={0}
            role="button"
            aria-label={`View ${product.name} details`}
            className="focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-lg"
        >
            <div className="bg-surface rounded-lg border border-border hover:shadow-lg hover:border-accent/50 transition-all duration-300 cursor-pointer h-full flex flex-col overflow-hidden group">
                {/* Product Image */}
                <div className="aspect-square overflow-hidden bg-canvas relative">
                    {productImage ? (
                        <img
                            src={productImage}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-16 h-16 text-text-secondary" />
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-surface/90 backdrop-blur-sm text-text-secondary text-xs font-medium rounded-full border border-border">
                            {product.category}
                        </span>
                    </div>
                </div>

                {/* Product Details */}
                <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                        {product.name}
                    </h3>

                    <p className="text-sm text-text-secondary mb-3 line-clamp-2 flex-1">
                        {product.description}
                    </p>

                    {/* Aesthetic Tags */}
                    {aestheticNames.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1">
                            {aestheticNames.slice(0, 2).map((name, index) => (
                                <span
                                    key={`${name}-${index}`}
                                    className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full border border-accent/20"
                                >
                                    {name}
                                </span>
                            ))}
                            {aestheticNames.length > 2 && (
                                <span className="px-2 py-0.5 bg-canvas text-text-secondary text-xs rounded-full border border-border">
                                    +{aestheticNames.length - 2}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                        <div>
                            <p className="text-2xl font-bold text-accent">
                                ₦{product.basePrice.amount.toLocaleString('en-NG')}
                            </p>
                            <p className="text-xs text-text-secondary">Base price</p>
                        </div>
                        <button
                            className="px-4 py-2 bg-accent hover:bg-accent-dark text-surface text-sm font-medium rounded-lg transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClick();
                            }}
                        >
                            View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};