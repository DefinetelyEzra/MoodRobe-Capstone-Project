import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Package, ArrowLeft, Truck, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { useApi } from '@/hooks/useApi';
import { orderApi } from '@/api/order.api';
import { paymentApi } from '@/api/payment.api';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Order, Address } from '@/types/order.types';
import { InitiatePaymentResponse } from '@/types/payment.types';

const SHIPPING_FEE = 500;
const FREE_SHIPPING_THRESHOLD = 50000;

export const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { cart } = useCart();
    const { showToast } = useToast();
    const [step, setStep] = useState<'address' | 'review'>('address');
    const [address, setAddress] = useState<Address>({
        street: '',
        city: '',
        state: '',
        country: 'Nigeria',
        postalCode: ''
    });

    const { execute: createOrder, isLoading: isCreatingOrder } = useApi<Order, { shippingAddress: Address; discountPercentage: number }>(
        (data) => orderApi.createOrder(data)
    );

    const { execute: initiatePayment, isLoading: isInitiatingPayment } = useApi<InitiatePaymentResponse, { orderId: string; callbackUrl: string }>(
        (data) => paymentApi.initiatePayment(data)
    );

    const cartItems = cart?.items || [];
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.unitPrice.amount * item.quantity,
        0
    );

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!address.street || !address.city || !address.state || !address.postalCode) {
            showToast('Please fill in all address fields', 'error');
            return;
        }

        setStep('review');
    };

    const handlePlaceOrder = async () => {
        try {
            if (!cart?.items || cart.items.length === 0) {
                showToast('Your cart is empty. Please add items first.', 'error');
                navigate('/products');
                return;
            }

            const order = await createOrder({
                shippingAddress: address,
                discountPercentage: 0
            });

            if (!order) {
                throw new Error('Failed to create order');
            }

            showToast('Order created successfully!', 'success');

            const callbackUrl = `${globalThis.location.origin}/payment/callback`;
            const paymentData = await initiatePayment({
                orderId: order.id,
                callbackUrl: callbackUrl
            });

            if (!paymentData) {
                throw new Error('Failed to initiate payment');
            }

            globalThis.location.href = paymentData.authorizationUrl;
        } catch (error) {
            console.error('Checkout error:', error);

            let errorMessage = 'Failed to complete checkout';

            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as {
                    response?: {
                        data?: {
                            error?: string;
                            message?: string;
                            errors?: Array<{ msg: string }>
                        }
                    }
                };

                if (axiosError.response?.data?.error) {
                    errorMessage = axiosError.response.data.error;
                } else if (axiosError.response?.data?.message) {
                    errorMessage = axiosError.response.data.message;
                } else if (axiosError.response?.data?.errors && Array.isArray(axiosError.response.data.errors)) {
                    errorMessage = axiosError.response.data.errors.map(e => e.msg).join(', ');
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            showToast(errorMessage, 'error', 5000);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-canvas">
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <Card className="bg-surface border border-border text-center py-12">
                        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-10 h-10 text-accent" />
                        </div>
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            Your cart is empty
                        </h2>
                        <p className="text-text-secondary mb-6">
                            Add some items to your cart to checkout
                        </p>
                        <button
                            onClick={() => navigate('/products')}
                            className="px-8 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-canvas">
            {/* Header */}
            <div className="bg-linear-to-b from-accent/10 to-canvas border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => navigate('/cart')}
                        className="flex items-center text-accent hover:text-accent-dark mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Cart
                    </button>
                    <h1 className="text-4xl font-bold text-text-primary">Checkout</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-2">
                        {/* Step Indicator */}
                        <div className="flex items-center mb-8 bg-surface p-4 rounded-xl border border-border">
                            <div className={`flex items-center ${step === 'address' ? 'text-accent' : 'text-text-secondary'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step === 'address' ? 'bg-accent text-surface' : 'bg-canvas text-text-secondary border border-border'
                                    }`}>
                                    {step === 'review' ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                                </div>
                                <span className="ml-3 font-semibold">Shipping</span>
                            </div>
                            <div className="flex-1 h-0.5 bg-border mx-4" />
                            <div className={`flex items-center ${step === 'review' ? 'text-accent' : 'text-text-secondary'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step === 'review' ? 'bg-accent text-surface' : 'bg-canvas text-text-secondary border border-border'
                                    }`}>
                                    2
                                </div>
                                <span className="ml-3 font-semibold">Review</span>
                            </div>
                        </div>

                        {/* Address Form */}
                        {step === 'address' && (
                            <Card className="bg-surface border border-border p-6">
                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                                        <MapPin className="w-5 h-5 text-accent" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-text-primary">
                                        Shipping Address
                                    </h2>
                                </div>

                                <form onSubmit={handleAddressSubmit} className="space-y-4">
                                    <Input
                                        label="Street Address"
                                        value={address.street}
                                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                        placeholder="123 Main Street"
                                        required
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="City"
                                            value={address.city}
                                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                            placeholder="Lagos"
                                            required
                                        />
                                        <Input
                                            label="State"
                                            value={address.state}
                                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                            placeholder="Lagos"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Postal Code"
                                            value={address.postalCode}
                                            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                                            placeholder="100001"
                                            required
                                        />
                                        <Input
                                            label="Country"
                                            value={address.country}
                                            onChange={(e) => setAddress({ ...address, country: e.target.value })}
                                            placeholder="Nigeria"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full mt-6 px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors"
                                    >
                                        Continue to Review
                                    </button>
                                </form>
                            </Card>
                        )}

                        {/* Review & Pay */}
                        {step === 'review' && (
                            <>
                                <Card className="bg-surface border border-border p-6 mb-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                                                <MapPin className="w-5 h-5 text-accent" />
                                            </div>
                                            <h2 className="text-xl font-semibold text-text-primary">
                                                Shipping Address
                                            </h2>
                                        </div>
                                        <button
                                            onClick={() => setStep('address')}
                                            className="text-accent hover:text-accent-dark text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <div className="text-text-primary bg-canvas p-4 rounded-lg border border-border">
                                        <p className="font-medium">{address.street}</p>
                                        <p className="mt-1">{address.city}, {address.state} {address.postalCode}</p>
                                        <p className="mt-1">{address.country}</p>
                                    </div>
                                </Card>

                                <Card className="bg-surface border border-border p-6">
                                    <div className="flex items-center mb-6">
                                        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                                            <Package className="w-5 h-5 text-accent" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-text-primary">
                                            Order Items
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-border last:border-b-0">
                                                <div className="w-16 h-16 bg-canvas rounded-lg border border-border flex items-center justify-center overflow-hidden">
                                                    <Package className="w-6 h-6 text-text-secondary" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-text-primary">{item.productName}</h3>
                                                    <p className="text-sm text-text-secondary">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-semibold text-text-primary">
                                                    ₦{(item.unitPrice.amount * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </>
                        )}
                    </div>

                    {/* Right Column - Summary */}
                    <div>
                        <Card className="bg-surface border border-border p-6 sticky top-24">
                            <h2 className="text-xl font-semibold text-text-primary mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-6 pb-6 border-b border-border">
                                <div className="flex justify-between text-text-primary">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-text-primary">
                                    <div className="flex items-center">
                                        <Truck className="w-4 h-4 mr-2 text-accent" />
                                        <span>Shipping</span>
                                    </div>
                                    {shipping === 0 ? (
                                        <span className="text-green-700 font-semibold">FREE</span>
                                    ) : (
                                        <span className="font-medium">₦{shipping.toLocaleString()}</span>
                                    )}
                                </div>
                                {subtotal < FREE_SHIPPING_THRESHOLD && (
                                    <p className="text-xs text-text-secondary italic bg-canvas p-2 rounded border border-border">
                                        Add ₦{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for free shipping
                                    </p>
                                )}
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between text-text-primary">
                                    <span className="text-lg font-semibold">Total</span>
                                    <span className="text-2xl font-bold text-accent">₦{total.toLocaleString()}</span>
                                </div>
                            </div>

                            {step === 'review' && (
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isCreatingOrder || isInitiatingPayment}
                                    className="w-full flex items-center justify-center px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                >
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    {isCreatingOrder || isInitiatingPayment
                                        ? 'Processing...'
                                        : 'Pay with Paystack'}
                                </button>
                            )}

                            <div className="mt-6 text-center text-sm text-text-secondary bg-canvas p-3 rounded-lg border border-border">
                                <p>🔒 Secure payment powered by Paystack</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};