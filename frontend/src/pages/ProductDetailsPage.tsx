import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Share2, Check, Package, Truck } from 'lucide-react';
import { productApi } from '@/api/product.api';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { useCart } from '@/hooks/useCart';
import { Product, ProductVariant } from '@/types/product.types';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Card } from '@/components/common/Card';

export const ProductDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { addItem } = useCart();

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    const {
        data: product,
        isLoading,
        execute: fetchProduct
    } = useApi<Product, string>((productId) => productApi.getById(productId));

    useEffect(() => {
        if (id) {
            fetchProduct(id).catch((error) => {
                if (error?.name !== 'AbortError') {
                    console.error('Failed to fetch product:', error);
                    showToast('Failed to load product details', 'error');
                }
            });
        }
    }, [id, fetchProduct, showToast]);

    // Derive selected variant from selectedVariantId and product
    const selectedVariant = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) return null;

        if (selectedVariantId) {
            return product.variants.find(v => v.id === selectedVariantId) ?? product.variants[0];
        }

        return product.variants[0];
    }, [product, selectedVariantId]);

    const formatPrice = (price: { amount: number; currency: string }) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: price.currency || 'USD',
        }).format(price.amount);
    };

    const handleAddToCart = () => {
        if (!product) return;

        const variantToAdd = selectedVariant ?? product.variants?.[0];

        if (variantToAdd?.stockQuantity === 0) {
            showToast('This product is out of stock', 'error');
            return;
        }

        addItem({
            productId: product.id,
            variantId: variantToAdd?.id,
            quantity
        });

        showToast('Added to cart successfully', 'success');
    };

    const handleQuantityChange = (newQuantity: number) => {
        const maxStock = selectedVariant?.stockQuantity ?? 10;
        if (newQuantity >= 1 && newQuantity <= maxStock) {
            setQuantity(newQuantity);
        }
    };

    const handleVariantSelect = (variant: ProductVariant) => {
        setSelectedVariantId(variant.id);
        setQuantity(1);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner text="Loading product..." />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
                <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
                <Button onClick={() => navigate('/products')}>
                    Back to Products
                </Button>
            </div>
        );
    }

    const currentPrice = selectedVariant?.price ?? product.basePrice;
    const currentStock = selectedVariant?.stockQuantity ?? 0;
    const isInStock = currentStock > 0;

    // Extract nested ternary logic
    const getImageSource = () => {
        if (product.images && product.images.length > 0) {
            return product.images[selectedImage]?.imageUrl;
        }
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"%3E%3Crect fill="%23e5e7eb" width="600" height="600"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
    };

    const getVariantButtonClass = (variant: ProductVariant) => {
        const isSelected = selectedVariant?.id === variant.id;
        const isOutOfStock = variant.stockQuantity === 0;

        if (isSelected) {
            return 'border-teal-600 bg-teal-50';
        }
        if (isOutOfStock) {
            return 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed';
        }
        return 'border-gray-200 hover:border-teal-300';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate('/products')}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Products
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Product Images */}
                <div>
                    <div className="bg-gray-100 rounded-2xl overflow-hidden mb-4 aspect-square">
                        <img
                            src={getImageSource()}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((image, index) => (
                                <button
                                    key={image.id}
                                    onClick={() => setSelectedImage(index)}
                                    className={`rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                            ? 'border-teal-600 ring-2 ring-teal-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <img
                                        src={image.imageUrl}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-20 object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <div className="mb-6">
                        <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-sm font-medium rounded-full mb-3">
                            {product.category}
                        </span>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                            {product.name}
                        </h1>
                        <p className="text-3xl font-bold text-teal-600 mb-4">
                            {formatPrice(currentPrice)}
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Variants */}
                    {product.variants && product.variants.length > 0 && (
                        <Card className="mb-6">
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Select Variant</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => handleVariantSelect(variant)}
                                            disabled={variant.stockQuantity === 0}
                                            className={`p-3 rounded-lg border-2 transition-all text-left ${getVariantButtonClass(variant)}`}
                                        >
                                            <div className="font-medium text-gray-900 mb-1">
                                                {variant.attributes?.size ?? variant.attributes?.color ?? 'Standard'}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {variant.stockQuantity > 0
                                                    ? `${variant.stockQuantity} in stock`
                                                    : 'Out of stock'}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Quantity Selector */}
                    <Card className="mb-6">
                        <div className="p-4">
                            <p className="block font-semibold text-gray-900 mb-3">
                                Quantity
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        disabled={quantity <= 1}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        −
                                    </button>
                                    <span className="px-4 py-2 font-semibold min-w-12 text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        disabled={quantity >= currentStock}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-sm text-gray-600">
                                    {currentStock} available
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Action Buttons */}
                    <div className="space-y-3 mb-6">
                        <Button
                            fullWidth
                            size="lg"
                            onClick={handleAddToCart}
                            disabled={!isInStock}
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            {isInStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" fullWidth>
                                <Heart className="w-5 h-5 mr-2" />
                                Save
                            </Button>
                            <Button variant="outline" fullWidth>
                                <Share2 className="w-5 h-5 mr-2" />
                                Share
                            </Button>
                        </div>
                    </div>

                    {/* Product Features */}
                    <Card>
                        <div className="p-4 space-y-3">
                            <div className="flex items-center text-gray-700">
                                <Check className="w-5 h-5 mr-3 text-teal-600" />
                                <span>Authentic Products</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Package className="w-5 h-5 mr-3 text-teal-600" />
                                <span>Secure Packaging</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Truck className="w-5 h-5 mr-3 text-teal-600" />
                                <span>Fast Delivery</span>
                            </div>
                        </div>
                    </Card>

                    {/* Aesthetic Tags */}
                    {product.aestheticTags && product.aestheticTags.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Aesthetics</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.aestheticTags.map((tag, index) => (
                                    <span
                                        key={`${tag}-${index}`}
                                        className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};