import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';

interface CartSummaryProps {
    itemCount: number;
    subtotal: {
        amount: number;
        currency: string;
    };
    onCheckout?: () => void;
    isLoading?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
    itemCount,
    subtotal,
    onCheckout,
    isLoading = false,
}) => {
    const navigate = useNavigate();

    const formatPrice = (price: { amount: number; currency: string }) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: price.currency || 'USD',
        }).format(price.amount);
    };

    // Calculate estimated tax (example: 10%)
    const taxRate = 0.1;
    const estimatedTax = subtotal.amount * taxRate;

    // Calculate total
    const total = subtotal.amount + estimatedTax;

    const handleCheckout = () => {
        if (onCheckout) {
            onCheckout();
        } else {
            navigate('/checkout');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                    <span>Items ({itemCount})</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                    <span>Estimated Tax</span>
                    <span>
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: subtotal.currency || 'USD',
                        }).format(estimatedTax)}
                    </span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>
                            {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: subtotal.currency || 'USD',
                            }).format(total)}
                        </span>
                    </div>
                </div>
            </div>

            <Button
                variant="primary"
                size="lg"
                onClick={handleCheckout}
                disabled={isLoading || itemCount === 0}
                className="w-full"
            >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
            </Button>

            <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 text-teal-600 hover:text-teal-700 font-medium text-sm"
                type="button"
            >
                Continue Shopping
            </button>

            {/* Security Badge */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secure Checkout</span>
                </div>
            </div>
        </div>
    );
};