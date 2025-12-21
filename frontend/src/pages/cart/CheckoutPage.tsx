import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Package, ArrowLeft, Truck } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { useApi } from '@/hooks/useApi';
import { orderApi } from '@/api/order.api';
import { paymentApi } from '@/api/payment.api';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Order, Address } from '@/types/order.types';
import { InitiatePaymentResponse } from '@/types/payment.types';

const SHIPPING_FEE = 500; // 500 NGN
const FREE_SHIPPING_THRESHOLD = 50000; // Free shipping above 50,000 NGN

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

    // Calculate shipping
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

    const total = subtotal + shipping;

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate address
        if (!address.street || !address.city || !address.state || !address.postalCode) {
            showToast('Please fill in all address fields', 'error');
            return;
        }

        setStep('review');
    };

    const handlePlaceOrder = async () => {
        try {
            // Validate cart before proceeding
            if (!cart?.items || cart.items.length === 0) {
                showToast('Your cart is empty. Please add items first.', 'error');
                navigate('/products');
                return;
            }

            console.log('🛒 Cart validation passed:', {
                itemCount: cart.items.length,
                cartId: cart.id
            });

            // Create order
            const order = await createOrder({
                shippingAddress: address,
                discountPercentage: 0
            });

            if (!order) {
                throw new Error('Failed to create order');
            }

            console.log('✅ Order created successfully:', {
                orderId: order.id,
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount
            });

            showToast('Order created successfully!', 'success');

            const callbackUrl = `${globalThis.location.origin}/payment/callback`;

            console.log('💳 Initiating payment:', {
                orderId: order.id,
                callbackUrl: callbackUrl
            });

            const paymentData = await initiatePayment({
                orderId: order.id,
                callbackUrl: callbackUrl
            });

            if (!paymentData) {
                throw new Error('Failed to initiate payment');
            }

            console.log('✅ Payment initiated:', {
                paymentId: paymentData.paymentId,
                reference: paymentData.reference
            });

            // Redirect to payment gateway
            globalThis.location.href = paymentData.authorizationUrl;
        } catch (error) {
            console.error('❌ Checkout error:', error);

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Your cart is empty
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Add some items to your cart to checkout
                    </p>
                    <Button onClick={() => navigate('/products')}>
                        Continue Shopping
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center text-teal-600 hover:text-teal-700 mb-4"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Cart
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Form */}
                <div className="lg:col-span-2">
                    {/* Step Indicator */}
                    <div className="flex items-center mb-8">
                        <div className={`flex items-center ${step === 'address' ? 'text-teal-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'address' ? 'bg-teal-600 text-white' : 'bg-gray-200'
                                }`}>
                                1
                            </div>
                            <span className="ml-2 font-medium">Shipping</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-200 mx-4" />
                        <div className={`flex items-center ${step === 'review' ? 'text-teal-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'review' ? 'bg-teal-600 text-white' : 'bg-gray-200'
                                }`}>
                                2
                            </div>
                            <span className="ml-2 font-medium">Review</span>
                        </div>
                    </div>

                    {/* Address Form */}
                    {step === 'address' && (
                        <Card className="p-6">
                            <div className="flex items-center mb-6">
                                <MapPin className="w-6 h-6 text-teal-600 mr-3" />
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Shipping Address
                                </h2>
                            </div>

                            <form onSubmit={handleAddressSubmit} className="space-y-4">
                                <Input
                                    label="Street Address"
                                    value={address.street}
                                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                    placeholder="123 Main St"
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

                                <Button type="submit" className="w-full mt-6">
                                    Continue to Review
                                </Button>
                            </form>
                        </Card>
                    )}

                    {/* Review & Pay */}
                    {step === 'review' && (
                        <>
                            <Card className="p-6 mb-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <MapPin className="w-6 h-6 text-teal-600 mr-3" />
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Shipping Address
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setStep('address')}
                                        className="text-teal-600 hover:text-teal-700 text-sm"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className="text-gray-700">
                                    <p>{address.street}</p>
                                    <p>{address.city}, {address.state} {address.postalCode}</p>
                                    <p>{address.country}</p>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center mb-6">
                                    <Package className="w-6 h-6 text-teal-600 mr-3" />
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Order Items
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-4 pb-4 border-b">
                                            <div className="w-16 h-16 bg-gray-100 rounded" />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{item.productName}</h3>
                                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium text-gray-900">
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
                    <Card className="p-6 sticky top-24">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            Order Summary
                        </h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal ({cartItems.length} items)</span>
                                <span>₦{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <div className="flex items-center">
                                    <Truck className="w-4 h-4 mr-2" />
                                    <span>Shipping</span>
                                </div>
                                {shipping === 0 ? (
                                    <span className="text-green-600 font-medium">FREE</span>
                                ) : (
                                    <span>₦{shipping.toLocaleString()}</span>
                                )}
                            </div>
                            {subtotal < FREE_SHIPPING_THRESHOLD && (
                                <p className="text-xs text-gray-600 italic">
                                    Add ₦{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for free shipping
                                </p>
                            )}
                            <div className="pt-3 border-t">
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>₦{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {step === 'review' && (
                            <Button
                                onClick={handlePlaceOrder}
                                disabled={isCreatingOrder || isInitiatingPayment}
                                className="w-full"
                            >
                                <CreditCard className="w-5 h-5 mr-2" />
                                {isCreatingOrder || isInitiatingPayment
                                    ? 'Processing...'
                                    : 'Pay with Paystack'}
                            </Button>
                        )}

                        <div className="mt-6 text-center text-sm text-gray-600">
                            <p>Secure payment powered by Paystack</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};