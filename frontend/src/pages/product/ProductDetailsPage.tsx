import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Share2, Check, Package, Truck, ShoppingBag } from 'lucide-react';
import { productApi } from '@/api/product.api';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { useCart } from '@/hooks/useCart';
import { useAesthetic } from '@/hooks/useAesthetic';
import { Product, ProductVariant } from '@/types/product.types';
import { FavoriteButton } from '@/components/features/favorites/FavoriteButton';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const ProductDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { addItem } = useCart();
    const { availableAesthetics } = useAesthetic();

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

    const selectedVariant = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) return null;

        if (selectedVariantId) {
            return product.variants.find(v => v.id === selectedVariantId) ?? product.variants[0];
        }

        return product.variants[0];
    }, [product, selectedVariantId]);

    // Map aesthetic IDs to names
    const aestheticNames = useMemo(() => {
        if (!product?.aestheticTags || product.aestheticTags.length === 0) return [];
        return product.aestheticTags
            .map(tagId => {
                const aesthetic = availableAesthetics.find(a => a.id === tagId);
                return aesthetic?.name || null;
            })
            .filter((name): name is string => name !== null);
    }, [product, availableAesthetics]);

    const formatPrice = (amount: number) => {
        return `₦${amount.toLocaleString('en-NG')}`;
    };

    const handleAddToCart = async () => {
        if (!product) return;

        const variantToAdd = selectedVariant ?? product.variants?.[0];

        if (!variantToAdd?.id) {
            showToast('Please select a variant', 'error');
            return;
        }

        if (variantToAdd?.stockQuantity === 0) {
            showToast('This product is out of stock', 'error');
            return;
        }

        try {
            await addItem({
                productId: product.id,
                variantId: variantToAdd.id,
                quantity
            });

            showToast('Added to cart successfully', 'success');
        } catch (error) {
            console.error('Failed to add to cart:', error);
            showToast('Failed to add to cart', 'error');
        }
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
            <div className="min-h-screen bg-canvas flex items-center justify-center">
                <LoadingSpinner text="Loading product..." />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-canvas">
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <div className="bg-surface border border-border rounded-xl p-12 text-center">
                        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-10 h-10 text-accent" />
                        </div>
                        <h2 className="text-2xl font-bold text-text-primary mb-4">Product Not Found</h2>
                        <p className="text-text-secondary mb-6">The product you're looking for doesn't exist.</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="px-8 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors"
                        >
                            Back to Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentPrice = selectedVariant?.price ?? product.basePrice;
    const currentStock = selectedVariant?.stockQuantity ?? 0;
    const isInStock = currentStock > 0;

    const getImageSource = () => {
        if (product.images && product.images.length > 0) {
            return product.images[selectedImage]?.imageUrl;
        }
        return null;
    };

    const imageSource = getImageSource();

    // Extract variant selection logic to avoid nested ternary
    const getVariantButtonClass = (variant: ProductVariant) => {
        if (selectedVariant?.id === variant.id) {
            return 'border-accent bg-accent/5';
        }
        if (variant.stockQuantity === 0) {
            return 'border-border bg-canvas opacity-50 cursor-not-allowed';
        }
        return 'border-border hover:border-accent/50 bg-surface';
    };

    return (
        <div className="min-h-screen bg-canvas">
            {/* Header */}
            <div className="bg-linear-to-b from-accent/10 to-canvas border-b border-border">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <button
                        onClick={() => navigate('/products')}
                        className="flex items-center text-accent hover:text-accent-dark mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Products
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Product Images */}
                    <div>
                        <div className="bg-surface rounded-2xl overflow-hidden mb-4 aspect-square border border-border">
                            {imageSource ? (
                                <img
                                    src={imageSource}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-canvas">
                                    <ShoppingBag className="w-24 h-24 text-text-secondary" />
                                </div>
                            )}
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setSelectedImage(index)}
                                        className={`rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                            ? 'border-accent ring-2 ring-accent/20'
                                            : 'border-border hover:border-accent/50'
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
                            <span className="inline-block px-4 py-2 bg-accent/10 text-accent text-sm font-medium rounded-full border border-accent/20 mb-4">
                                {product.category}
                            </span>
                            <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
                                {product.name}
                            </h1>
                            <p className="text-4xl font-bold text-accent mb-4">
                                {formatPrice(currentPrice.amount)}
                            </p>
                            <p className="text-text-secondary leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Aesthetic Tags */}
                        {aestheticNames.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-semibold text-text-primary mb-3">Aesthetics</h3>
                                <div className="flex flex-wrap gap-2">
                                    {aestheticNames.map((name, index) => (
                                        <span
                                            key={`${name}-${index}`}
                                            className="px-4 py-2 bg-accent/10 text-accent rounded-lg text-sm font-medium border border-accent/20"
                                        >
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Variants */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="bg-surface border border-border rounded-xl p-6 mb-6">
                                <h3 className="font-semibold text-text-primary mb-4">Select Variant</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => handleVariantSelect(variant)}
                                            disabled={variant.stockQuantity === 0}
                                            className={`p-4 rounded-lg border-2 transition-all text-left ${getVariantButtonClass(variant)}`}
                                        >
                                            <div className="font-medium text-text-primary mb-1">
                                                {variant.attributes?.size ?? variant.attributes?.color ?? 'Standard'}
                                            </div>
                                            <div className="text-sm text-text-secondary">
                                                {variant.stockQuantity > 0
                                                    ? `${variant.stockQuantity} in stock`
                                                    : 'Out of stock'}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
                            <h3 className="font-semibold text-text-primary mb-4">Quantity</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border-2 border-border rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        disabled={quantity <= 1}
                                        className="px-6 py-3 text-text-primary hover:bg-canvas disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="px-6 py-3 font-semibold min-w-20 text-center text-text-primary border-x-2 border-border">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        disabled={quantity >= currentStock}
                                        className="px-6 py-3 text-text-primary hover:bg-canvas disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-sm text-text-secondary">
                                    {currentStock} available
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 mb-6">
                            <button
                                onClick={handleAddToCart}
                                disabled={!isInStock}
                                className="w-full flex items-center justify-center px-6 py-4 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                {isInStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                                <FavoriteButton productId={product.id} showLabel={true} size="lg" />
                                <button className="flex items-center justify-center px-6 py-3 border border-border hover:bg-canvas text-text-primary rounded-lg font-medium transition-colors">
                                    <Share2 className="w-5 h-5 mr-2" />
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Product Features */}
                        <div className="bg-surface border border-border rounded-xl p-6">
                            <div className="space-y-4">
                                <div className="flex items-center text-text-primary">
                                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                                        <Check className="w-5 h-5 text-accent" />
                                    </div>
                                    <span className="font-medium">Authentic Products</span>
                                </div>
                                <div className="flex items-center text-text-primary">
                                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                                        <Package className="w-5 h-5 text-accent" />
                                    </div>
                                    <span className="font-medium">Secure Packaging</span>
                                </div>
                                <div className="flex items-center text-text-primary">
                                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                                        <Truck className="w-5 h-5 text-accent" />
                                    </div>
                                    <span className="font-medium">Fast Delivery</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};