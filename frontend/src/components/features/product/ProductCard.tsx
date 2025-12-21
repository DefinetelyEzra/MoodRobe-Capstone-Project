import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types/product.types';
import { Card } from '@/components/common/Card';

interface ProductCardProps {
    product: Product;
    onProductClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
    const navigate = useNavigate();

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
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"%3E%3Crect fill="%23e5e7eb" width="300" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
    };

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
            className="focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-lg"
        >
            <Card hoverable className="cursor-pointer h-full flex flex-col">
                <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                        src={getProductImage()}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>
                <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2 flex-1">
                        {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                        <p className="text-lg font-bold text-teal-600">
                            ₦{product.basePrice.amount.toLocaleString('en-NG')}
                        </p>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {product.category}
                        </span>
                    </div>
                    {product.aestheticTags && product.aestheticTags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {product.aestheticTags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={`${tag}-${index}`}
                                    className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};