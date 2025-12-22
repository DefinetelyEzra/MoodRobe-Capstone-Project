import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard } from 'lucide-react';

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

    const formatPrice = (amount: number) => {
        return `₦${amount.toLocaleString('en-NG')}`;
    };

    const handleCheckout = () => {
        if (onCheckout) {
            onCheckout();
        } else {
            navigate('/checkout');
        }
    };

    return (
        <div className="bg-surface rounded-xl shadow-md border border-border p-6 sticky top-24">
            <h2 className="text-xl font-bold text-text-primary mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-text-primary">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span className="font-medium">{formatPrice(subtotal.amount)}</span>
                </div>

                <div className="border-t border-border pt-4">
                    <div className="flex justify-between">
                        <span className="text-lg font-semibold text-text-primary">Total</span>
                        <span className="text-2xl font-bold text-accent">{formatPrice(subtotal.amount)}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={handleCheckout}
                disabled={isLoading || itemCount === 0}
                className="w-full flex items-center justify-center px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md mb-3"
            >
                <CreditCard className="w-5 h-5 mr-2" />
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            {/* Security Badge */}
            <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-center gap-2 text-sm text-text-secondary bg-canvas px-4 py-3 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-accent" />
                    <span>Secure Checkout Guaranteed</span>
                </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 space-y-2 text-xs text-text-secondary">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    <span>Free shipping on orders over ₦50,000</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    <span>Secure payment processing</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    <span>Easy returns within 30 days</span>
                </div>
            </div>
        </div>
    );
};