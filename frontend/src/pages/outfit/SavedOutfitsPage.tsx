import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Shirt, Package } from 'lucide-react';
import { SavedOutfitCard } from '@/components/features/outfit/SavedOutfitCard';
import { useOutfit } from '@/hooks/useOutfit';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { OutfitResponseDto } from '@/types/outfit.types';
import { Card } from '@/components/common/Card';

export const SavedOutfitsPage: React.FC = () => {
    const navigate = useNavigate();
    const { outfits, isLoading, loadUserOutfits, deleteOutfit } = useOutfit();
    const { addItem } = useCart();
    const { showToast } = useToast();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        loadUserOutfits();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEdit = (outfit: OutfitResponseDto) => {
        navigate(`/outfit-builder?id=${outfit.id}`);
    };

    const handleDelete = async (id: string) => {
        if (!globalThis.confirm('Are you sure you want to delete this outfit?')) {
            return;
        }

        try {
            setDeletingId(id);
            await deleteOutfit(id);
            showToast('Outfit deleted successfully', 'success');
        } catch (error) {
            console.error('Failed to delete outfit:', error);
            showToast('Failed to delete outfit', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const handleAddToCart = async (outfit: OutfitResponseDto) => {
        if (!outfit.itemDetails || outfit.itemDetails.length === 0) {
            showToast('No items in this outfit', 'warning');
            return;
        }

        try {
            for (const item of outfit.itemDetails) {
                await addItem({
                    productId: item.productId,
                    variantId: item.productId, // Use product ID as fallback
                    quantity: 1
                });
            }

            showToast(`Added ${outfit.itemDetails.length} items to cart!`, 'success');
            navigate('/cart');
        } catch (error) {
            console.error('Failed to add outfit to cart:', error);
            showToast('Failed to add some items to cart', 'error');
        }
    };

    let content;
    if (isLoading) {
        content = (
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner text="Loading your outfits..." />
            </div>
        );
    } else if (outfits.length === 0) {
        content = (
            <Card className="bg-surface border border-border">
                <div className="p-12 text-center">
                    <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-12 h-12 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-text-primary mb-3">
                        No saved outfits yet
                    </h3>
                    <p className="text-text-secondary mb-6 max-w-md mx-auto">
                        Start creating your perfect looks by mixing and matching products from your favorite aesthetics
                    </p>
                    <button
                        onClick={() => navigate('/outfit-builder')}
                        className="px-8 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Create Your First Outfit
                    </button>
                </div>
            </Card>
        );
    } else {
        content = (
            <>
                <div className="mb-6">
                    <p className="text-text-secondary">
                        {outfits.length} {outfits.length === 1 ? 'outfit' : 'outfits'} saved
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {outfits.map((outfit) => (
                        <div
                            key={outfit.id}
                            className={deletingId === outfit.id ? 'opacity-50 pointer-events-none' : ''}
                        >
                            <SavedOutfitCard
                                outfit={outfit}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onAddToCart={handleAddToCart}
                            />
                        </div>
                    ))}
                </div>
            </>
        );
    }

    return (
        <div className="min-h-screen bg-canvas">
            {/* Header */}
            <div className="bg-linear-to-b from-accent/10 to-canvas border-b border-border">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                                <Shirt className="w-8 h-8 text-accent" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-text-primary mb-2">
                                    My Outfits
                                </h1>
                                <p className="text-text-secondary">
                                    View and manage your saved outfit combinations
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/outfit-builder')}
                            className="px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create New Outfit
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {content}
            </div>
        </div>
    );
};