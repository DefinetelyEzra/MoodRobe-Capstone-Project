import React from 'react';
import { Edit2, Trash2, ShoppingCart, Eye, EyeOff } from 'lucide-react';
import { OutfitResponseDto } from '@/types/outfit.types';
import { Card } from '@/components/common/Card';
import { useAesthetic } from '@/hooks/useAesthetic';

interface SavedOutfitCardProps {
    outfit: OutfitResponseDto;
    onEdit: (outfit: OutfitResponseDto) => void;
    onDelete: (id: string) => void;
    onAddToCart: (outfit: OutfitResponseDto) => void;
}

export const SavedOutfitCard: React.FC<SavedOutfitCardProps> = ({
    outfit,
    onEdit,
    onDelete,
    onAddToCart
}) => {
    const { availableAesthetics } = useAesthetic();

    const getAestheticNames = () => {
        if (!outfit.aestheticTags || outfit.aestheticTags.length === 0) return [];
        return outfit.aestheticTags
            .map(tagId => {
                const aesthetic = availableAesthetics.find(a => a.id === tagId);
                return aesthetic?.name || null;
            })
            .filter((name): name is string => name !== null);
    };

    const aestheticNames = getAestheticNames();
    const itemCount = outfit.itemDetails?.length || Object.keys(outfit.items).length;

    return (
        <Card className="bg-surface border border-border hover:shadow-lg transition-all">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-text-primary mb-1">
                            {outfit.name}
                        </h3>
                        {outfit.description && (
                            <p className="text-sm text-text-secondary line-clamp-2">
                                {outfit.description}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                        {outfit.isPublic ? (
                            <span title="Public outfit">
                                <Eye className="w-4 h-4 text-accent" />
                            </span>
                        ) : (
                            <span title="Private outfit">
                                <EyeOff className="w-4 h-4 text-text-secondary" />
                            </span>
                        )}
                    </div>
                </div>

                {/* Outfit Type & Item Count */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full border border-accent/20">
                        {outfit.outfitType}
                    </span>
                    <span className="text-sm text-text-secondary">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </span>
                </div>

                {/* Aesthetic Tags */}
                {aestheticNames.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1">
                        {aestheticNames.map((name, index) => (
                            <span
                                key={`${name}-${index}`}
                                className="px-2 py-0.5 bg-canvas text-text-secondary text-xs rounded-full border border-border"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Item Details Preview */}
                {outfit.itemDetails && outfit.itemDetails.length > 0 && (
                    <div className="mb-4">
                        <div className="grid grid-cols-4 gap-2">
                            {outfit.itemDetails.slice(0, 4).map((item) => (
                                <div
                                    key={item.productId}
                                    className="aspect-square rounded-lg overflow-hidden bg-canvas border border-border"
                                >
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ShoppingCart className="w-6 h-6 text-text-secondary" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Total Price */}
                {outfit.itemDetails && outfit.itemDetails.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-border">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-text-secondary">Total:</span>
                            <span className="text-lg font-bold text-accent">
                                ₦{outfit.itemDetails.reduce(
                                    (sum, item) => sum + item.price.amount,
                                    0
                                ).toLocaleString()}
                            </span>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(outfit)}
                        className="flex-1 px-4 py-2 bg-accent hover:bg-accent-dark text-surface rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit
                    </button>
                    <button
                        onClick={() => onAddToCart(outfit)}
                        className="flex-1 px-4 py-2 border border-border hover:bg-canvas text-text-primary rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                    </button>
                    <button
                        onClick={() => onDelete(outfit.id)}
                        className="px-4 py-2 border border-red-300 hover:bg-red-50 text-red-600 rounded-lg font-medium transition-colors"
                        aria-label="Delete outfit"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Created Date */}
                <p className="text-xs text-text-secondary mt-4 text-center">
                    Created {new Date(outfit.createdAt).toLocaleDateString()}
                </p>
            </div>
        </Card>
    );
};