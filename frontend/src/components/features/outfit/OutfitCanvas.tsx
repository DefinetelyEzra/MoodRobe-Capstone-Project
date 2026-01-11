import React from 'react';
import { OutfitSlot } from './OutfitSlot';
import { OutfitSlotType, OutfitType, OUTFIT_TEMPLATES } from '@/types/outfit.types';
import { Product } from '@/types/product.types';

interface OutfitCanvasProps {
    outfitType: OutfitType;
    selectedProducts: Record<string, Product>;
    onAddItem: (slotType: OutfitSlotType) => void;
    onRemoveItem: (slotType: OutfitSlotType) => void;
}

export const OutfitCanvas: React.FC<OutfitCanvasProps> = ({
    outfitType,
    selectedProducts,
    onAddItem,
    onRemoveItem
}) => {
    const template = OUTFIT_TEMPLATES.find(t => t.type === outfitType);
    
    if (!template) {
        return null;
    }

    // Layout configurations for different outfit types
    const getLayoutClasses = () => {
        switch (outfitType) {
            case 'full':
                return 'grid grid-cols-2 md:grid-cols-3 gap-8';
            case 'dress':
                return 'grid grid-cols-2 md:grid-cols-4 gap-8';
            case 'casual':
                return 'flex flex-wrap justify-center gap-8';
            case 'formal':
                return 'flex flex-wrap justify-center gap-8';
            default:
                return 'grid grid-cols-2 md:grid-cols-3 gap-8';
        }
    };

    return (
        <div className="bg-surface border border-border rounded-lg p-8">
            <div className="mb-6 text-center">
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {template.label}
                </h3>
                <p className="text-sm text-text-secondary">
                    {template.description}
                </p>
            </div>

            {/* Mannequin-style layout */}
            <div className={getLayoutClasses()}>
                {template.slots.map((slotType) => (
                    <OutfitSlot
                        key={slotType}
                        slotType={slotType}
                        product={selectedProducts[slotType] || null}
                        onAdd={onAddItem}
                        onRemove={onRemoveItem}
                    />
                ))}
            </div>

            {/* Total Price */}
            <div className="mt-8 pt-6 border-t border-border">
                <div className="flex justify-between items-center">
                    <span className="text-text-secondary font-medium">Total Outfit Price:</span>
                    <span className="text-2xl font-bold text-accent">
                        ₦{Object.values(selectedProducts).reduce(
                            (sum, product) => sum + product.basePrice.amount,
                            0
                        ).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};