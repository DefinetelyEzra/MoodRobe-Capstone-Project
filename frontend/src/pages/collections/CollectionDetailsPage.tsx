import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, ShoppingBag } from 'lucide-react';
import { useCollections } from '@/hooks/useCollections';
import { productApi } from '@/api/product.api';
import { Product } from '@/types/product.types';
import { CollectionWithItems } from '@/types/collection.types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const CollectionDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { fetchCollectionById, removeFromCollection } = useCollections();
    const [collection, setCollection] = useState<CollectionWithItems | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCollection = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const data = await fetchCollectionById(id);
                setCollection(data);

                // Load products
                const productPromises: Promise<Product | null>[] = [];
                for (const item of data.items) {
                    productPromises.push(productApi.getById(item.productId).catch(() => null));
                }
                const loadedProducts = await Promise.all(productPromises);
                setProducts(loadedProducts.filter((p): p is Product => p !== null));
            } catch (error) {
                console.error('Failed to load collection:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadCollection();
    }, [id, fetchCollectionById]);

    const handleRemove = async (productId: string) => {
        if (!id) return;

        try {
            await removeFromCollection(id, productId);
            setProducts(prev => prev.filter(p => p.id !== productId));
        } catch (error) {
            console.error('Failed to remove product:', error);
        }
    };

    const formatPrice = (amount: number) => {
        return `₦${amount.toLocaleString('en-NG')}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-canvas flex items-center justify-center">
                <LoadingSpinner text="Loading collection..." />
            </div>
        );
    }

    if (!collection) {
        return (
            <div className="min-h-screen bg-canvas">
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <div className="bg-surface border border-border rounded-xl p-12 text-center">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">Collection Not Found</h2>
                        <button
                            onClick={() => navigate('/profile')}
                            className="px-8 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors"
                        >
                            Back to Profile
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-canvas">
            {/* Header */}
            <div className="bg-linear-to-b from-accent/10 to-canvas border-b border-border">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center text-accent hover:text-accent-dark mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Profile
                    </button>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary mb-2">{collection.name}</h1>
                            {collection.description && (
                                <p className="text-text-secondary">{collection.description}</p>
                            )}
                            <p className="text-sm text-text-secondary mt-2">
                                {products.length} {products.length === 1 ? 'item' : 'items'}
                            </p>
                        </div>
                        {collection.isPublic && (
                            <span className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full border border-accent/20">
                                Public
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {products.length === 0 ? (
                    <div className="text-center py-12 bg-surface rounded-xl border border-border">
                        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-10 h-10 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">No items yet</h3>
                        <p className="text-text-secondary mb-6">Add products to this collection!</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-medium transition-colors"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                                        title="Remove from collection"
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
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-accent">
                                            {formatPrice(product.basePrice.amount)}
                                        </span>
                                        <button
                                            onClick={() => navigate(`/products/${product.id}`)}
                                            className="px-4 py-2 bg-accent hover:bg-accent-dark text-surface rounded-lg text-sm font-medium transition-colors"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};