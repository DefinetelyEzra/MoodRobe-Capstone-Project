import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { CartItem } from '@/components/features/cart/CartItem';
import { CartSummary } from '@/components/features/cart/CartSummary';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/common/Button';

export const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { cart, isLoading, updateQuantity, removeItem, clearCart } = useCart();
    const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

    const handleUpdateQuantity = async (productVariantId: string, quantity: number) => {
        if (quantity < 1) {
            showToast('Quantity must be at least 1', 'error');
            return;
        }

        setUpdatingItemId(productVariantId);
        try {
            await updateQuantity('', quantity, productVariantId);
            showToast('Cart updated', 'success');
        } catch (error) {
            console.error('Failed to update quantity:', error);
            showToast('Failed to update quantity', 'error');
        } finally {
            setUpdatingItemId(null);
        }
    };

    const handleRemoveItem = async (productVariantId: string) => {
        if (!globalThis.confirm('Are you sure you want to remove this item from your cart?')) {
            return;
        }

        setUpdatingItemId(productVariantId);
        try {
            await removeItem('', productVariantId);
            showToast('Item removed from cart', 'success');
        } catch (error) {
            console.error('Failed to remove item:', error);
            showToast('Failed to remove item', 'error');
        } finally {
            setUpdatingItemId(null);
        }
    };

    const handleClearCart = async () => {
        if (!cart || cart.items.length === 0) {
            return;
        }

        if (!globalThis.confirm('Are you sure you want to clear your cart?')) {
            return;
        }

        try {
            await clearCart();
            showToast('Cart cleared', 'success');
        } catch (error) {
            console.error('Failed to clear cart:', error);
            showToast('Failed to clear cart', 'error');
        }
    };

    const handleCheckout = () => {
        if (!cart || cart.items.length === 0) {
            showToast('Your cart is empty', 'error');
            return;
        }
        navigate('/checkout');
    };

    if (isLoading && !cart) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <LoadingSpinner text="Loading your cart..." />
            </div>
        );
    }

    const isEmpty = !cart || cart.items.length === 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-teal-600 hover:text-teal-700 mb-4 transition-colors"
                    type="button"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Shopping Cart</h1>
            </div>

            {isEmpty ? (
                /* Empty Cart State */
                <div className="text-center py-16">
                    <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8">
                        Add some items to your cart to get started!
                    </p>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate('/products')}
                    >
                        Start Shopping
                    </Button>
                </div>
            ) : (
                /* Cart with Items */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Items ({cart.itemCount})
                            </h2>
                            {cart.items.length > 0 && (
                                <button
                                    onClick={handleClearCart}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                                    type="button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Clearing...' : 'Clear Cart'}
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {cart.items.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemoveItem}
                                    isUpdating={updatingItemId === item.productVariantId}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary
                            itemCount={cart.itemCount}
                            subtotal={cart.subtotal}
                            onCheckout={handleCheckout}
                        />
                        <div className="mt-4 text-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/products')}
                                className="w-full"
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};