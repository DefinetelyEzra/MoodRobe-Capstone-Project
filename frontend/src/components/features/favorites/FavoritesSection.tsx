import React, { useEffect, useState } from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { productApi } from '@/api/product.api';
import { Product } from '@/types/product.types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useNavigate, Link } from 'react-router-dom';

export const FavoritesSection: React.FC = () => {
    const { favorites, isLoading: favoritesLoading, fetchFavorites, removeFavorite } = useFavorites();
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    useEffect(() => {
        const loadProducts = async () => {
            if (favorites.length === 0) {
                setProducts([]);
                return;
            }

            setLoadingProducts(true);
            try {
                const productPromises: Promise<Product | null>[] = [];
                for (const fav of favorites) {
                    productPromises.push(productApi.getById(fav.productId).catch(() => null));
                }
                const loadedProducts = await Promise.all(productPromises);
                setProducts(loadedProducts.filter((p): p is Product => p !== null));
            } catch (error) {
                console.error('Failed to load favorite products:', error);
            } finally {
                setLoadingProducts(false);
            }
        };

        loadProducts();
    }, [favorites]);

    const handleRemove = async (productId: string) => {
        try {
            await removeFavorite(productId);
        } catch (error) {
            console.error('Failed to remove favorite:', error);
        }
    };

    const formatPrice = (amount: number) => {
        return `₦${amount.toLocaleString('en-NG')}`;
    };

    if (favoritesLoading || loadingProducts) {
        return (
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner text="Loading favorites..." />
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="text-center py-12 bg-surface rounded-xl border border-border">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">No favorites yet</h3>
                <p className="text-text-secondary mb-6">Start saving items you love!</p>
                <button
                    onClick={() => navigate('/products')}
                    className="px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-medium transition-colors"
                >
                    Browse Products
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-text-primary">My Favorites</h2>
                <p className="text-text-secondary mt-1">{favorites.length} items saved</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-surface border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <Link
                            to={`/products/${product.id}`}
                            className="relative aspect-square bg-canvas cursor-pointer block"
                        >
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[0].imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ShoppingBag className="w-16 h-16 text-text-secondary" />
                                </div>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(product.id);
                                }}
                                className="absolute top-3 right-3 w-10 h-10 bg-surface/90 backdrop-blur-sm rounded-lg flex items-center justify-center border border-border hover:bg-accent/10 hover:border-accent hover:text-accent transition-all"
                                title="Remove from favorites"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </Link>

                        <div className="p-4">
                            <Link
                                to={`/products/${product.id}`}
                                className="font-semibold text-text-primary mb-2 line-clamp-2 cursor-pointer hover:text-accent transition-colors block"
                            >
                                {product.name}
                            </Link>
                            <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                                {product.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-accent">
                                    {formatPrice(product.basePrice.amount)}
                                </span>
                                <button
                                    onClick={() => navigate(`/products/${product.id}`)}
                                    className="px-4 py-2 bg-accent hover:bg-accent-dark text-surface rounded-lg text-sm font-medium transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};