import React from 'react';
import { Plus, X } from 'lucide-react';
import { OutfitSlotType, SLOT_LABELS } from '@/types/outfit.types';
import { Product } from '@/types/product.types';

interface OutfitSlotProps {
    slotType: OutfitSlotType;
    product: Product | null;
    onAdd: (slotType: OutfitSlotType) => void;
    onRemove: (slotType: OutfitSlotType) => void;
}

export const OutfitSlot: React.FC<OutfitSlotProps> = ({
    slotType,
    product,
    onAdd,
    onRemove
}) => {
    const getProductImage = (product: Product) => {
        if (product.images && product.images.length > 0) {
            const primaryImage = product.images.find(img => img.isPrimary);
            return primaryImage?.imageUrl || product.images[0].imageUrl;
        }
        return null;
    };

    const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    };

    return (
        <div className="flex flex-col items-center">
            <label className="text-sm font-medium text-text-secondary mb-2 text-center">
                {SLOT_LABELS[slotType]}
            </label>
            
            <div className="relative w-32 h-32 border-2 border-dashed rounded-lg overflow-hidden bg-surface transition-all hover:border-accent">
                {product ? (
                    <>
                        {/* Product Image */}
                        <img
                            src={getProductImage(product) || ''}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        
                        {/* Remove Button */}
                        <button
                            onClick={() => onRemove(slotType)}
                            onKeyDown={(e) => handleKeyDown(e, () => onRemove(slotType))}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                            aria-label={`Remove ${product.name} from ${SLOT_LABELS[slotType]}`}
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Product Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-2">
                            <p className="text-white text-xs font-medium truncate">
                                {product.name}
                            </p>
                            <p className="text-white/80 text-xs">
                                ₦{product.basePrice.amount.toLocaleString()}
                            </p>
                        </div>
                    </>
                ) : (
                    /* Empty Slot */
                    <button
                        onClick={() => onAdd(slotType)}
                        onKeyDown={(e) => handleKeyDown(e, () => onAdd(slotType))}
                        className="w-full h-full flex flex-col items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/5 transition-colors"
                        aria-label={`Add item to ${SLOT_LABELS[slotType]}`}
                    >
                        <Plus className="w-8 h-8 mb-1" />
                        <span className="text-xs">Add Item</span>
                    </button>
                )}
            </div>
        </div>
    );
};