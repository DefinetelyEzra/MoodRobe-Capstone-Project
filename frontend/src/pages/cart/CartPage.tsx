import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { CartSummary } from '@/components/features/cart/CartSummary';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { cart, isLoading, updateQuantity, removeItem, clearCart, refreshCart } = useCart();
    const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

    // Refresh cart when component mounts
    useEffect(() => {
        if (refreshCart) {
            refreshCart();
        }
    }, [refreshCart]);

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
            <div className="min-h-screen bg-canvas flex items-center justify-center">
                <LoadingSpinner text="Loading your cart..." />
            </div>
        );
    }

    const isEmpty = !cart || cart.items.length === 0;

    return (
        <div className="min-h-screen bg-canvas">
            {/* Header */}
            <div className="bg-linear-to-b from-accent/10 to-canvas border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-accent hover:text-accent-dark mb-4 transition-colors"
                        type="button"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </button>
                    <h1 className="text-4xl font-bold text-text-primary">Shopping Cart</h1>
                    {!isEmpty && (
                        <p className="text-text-secondary mt-2">
                            {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} in your cart
                        </p>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isEmpty ? (
                    /* Empty Cart State */
                    <div className="bg-surface rounded-xl border border-border p-16 text-center">
                        <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-12 h-12 text-accent" />
                        </div>
                        <h2 className="text-2xl font-bold text-text-primary mb-2">Your cart is empty</h2>
                        <p className="text-text-secondary mb-8">
                            Add some items to your cart to get started!
                        </p>
                        <button
                            onClick={() => navigate('/products')}
                            className="px-8 py-3 bg-accent hover:bg-accent-dark text-surface font-semibold rounded-lg transition-colors shadow-md"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    /* Cart with Items */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-text-primary">
                                    Your Items
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
                                    <div
                                        key={item.id}
                                        className="bg-surface rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center space-x-4">
                                            {/* Product Image */}
                                            <div className="w-24 h-24 bg-canvas rounded-lg border border-border overflow-hidden shrink-0">
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="w-8 h-8 text-text-secondary" />
                                                </div>
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-text-primary text-lg mb-2">
                                                    {item.productName}
                                                </h3>
                                                <div className="flex items-center space-x-3 text-sm text-text-secondary">
                                                    {item.variantAttributes?.size && (
                                                        <span className="bg-canvas px-2 py-1 rounded border border-border">
                                                            Size: {item.variantAttributes.size as string}
                                                        </span>
                                                    )}
                                                    {item.variantAttributes?.color && (
                                                        <span className="bg-canvas px-2 py-1 rounded border border-border">
                                                            {item.variantAttributes.color as string}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-lg font-bold text-accent mt-2">
                                                    ₦{(item.unitPrice.amount * item.quantity).toLocaleString()}
                                                </p>
                                                <p className="text-sm text-text-secondary">
                                                    ₦{item.unitPrice.amount.toLocaleString()} each
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex flex-col items-end space-y-3">
                                                <div className="flex items-center space-x-2 bg-canvas border border-border rounded-lg">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.productVariantId, item.quantity - 1)}
                                                        disabled={item.quantity <= 1 || updatingItemId === item.productVariantId}
                                                        className="p-2 hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg"
                                                        type="button"
                                                    >
                                                        <Minus className="w-4 h-4 text-text-primary" />
                                                    </button>
                                                    <span className="w-12 text-center font-semibold text-text-primary">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.productVariantId, item.quantity + 1)}
                                                        disabled={updatingItemId === item.productVariantId}
                                                        className="p-2 hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-lg"
                                                        type="button"
                                                    >
                                                        <Plus className="w-4 h-4 text-text-primary" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveItem(item.productVariantId)}
                                                    disabled={updatingItemId === item.productVariantId}
                                                    className="flex items-center text-sm text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                                                    type="button"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cart Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <CartSummary
                                    itemCount={cart.itemCount}
                                    subtotal={cart.subtotal}
                                    onCheckout={handleCheckout}
                                />
                                <div className="mt-4">
                                    <button
                                        onClick={() => navigate('/products')}
                                        className="w-full px-6 py-3 border border-border hover:bg-canvas text-text-primary rounded-lg font-medium transition-colors"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};