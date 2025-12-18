import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItemResponseDto } from '@/types/cart.types';
import { Button } from '@/components/common/Button';

interface CartItemProps {
    item: CartItemResponseDto;
    onUpdateQuantity: (productVariantId: string, quantity: number) => Promise<void>;
    onRemove: (productVariantId: string) => Promise<void>;
    isUpdating: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({
    item,
    onUpdateQuantity,
    onRemove,
    isUpdating,
}) => {
    const formatPrice = (price: { amount: number; currency: string }) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: price.currency || 'USD',
        }).format(price.amount);
    };

    const handleIncrement = async () => {
        await onUpdateQuantity(item.productVariantId, item.quantity + 1);
    };

    const handleDecrement = async () => {
        if (item.quantity > 1) {
            await onUpdateQuantity(item.productVariantId, item.quantity - 1);
        }
    };

    const handleRemove = async () => {
        await onRemove(item.productVariantId);
    };

    return (
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Product Info */}
            <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{item.productName}</h3>
                <p className="text-sm text-gray-600">
                    {formatPrice(item.unitPrice)} each
                </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
                <button
                    onClick={handleDecrement}
                    disabled={isUpdating || item.quantity <= 1}
                    className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                    type="button"
                >
                    <Minus className="w-4 h-4 text-gray-600" />
                </button>

                <span className="w-12 text-center font-medium text-gray-900">
                    {item.quantity}
                </span>

                <button
                    onClick={handleIncrement}
                    disabled={isUpdating}
                    className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                    type="button"
                >
                    <Plus className="w-4 h-4 text-gray-600" />
                </button>
            </div>

            {/* Line Total */}
            <div className="text-right min-w-25">
                <p className="font-bold text-gray-900">
                    {formatPrice(item.lineTotal)}
                </p>
            </div>

            {/* Remove Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={isUpdating}
                aria-label="Remove item"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
                <Trash2 className="w-5 h-5" />
            </Button>
        </div>
    );
};