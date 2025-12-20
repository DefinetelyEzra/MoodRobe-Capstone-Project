import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Truck } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { orderApi } from '@/api/order.api';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export const OrderDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: order, isLoading, execute: fetchOrder } = useApi(() =>
        orderApi.getOrderById(id!)
    );

    const loadOrder = useCallback(async () => {
        try {
            await fetchOrder();
        } catch (error) {
            console.error('Failed to load order:', error);
        }
    }, [fetchOrder]);

    useEffect(() => {
        if (id) {
            loadOrder();
        }
    }, [id, loadOrder]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                    <p className="mt-4 text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
                    <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/orders')}
                    className="flex items-center text-teal-600 hover:text-teal-700 mb-4"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Orders
                </button>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Order #{order.orderNumber}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Placed on {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {order.status.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <Card className="p-6">
                        <div className="flex items-center mb-6">
                            <Package className="w-6 h-6 text-teal-600 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
                        </div>

                        <div className="space-y-4">
                            {order.orderLines.map((line) => (
                                <div
                                    key={line.id}
                                    className="flex items-center space-x-4 pb-4 border-b last:border-b-0"
                                >
                                    <div className="w-20 h-20 bg-gray-100 rounded shrink-0" />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{line.productName}</h3>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                            {line.variantDetails.size && (
                                                <span>Size: {line.variantDetails.size}</span>
                                            )}
                                            {line.variantDetails.color && (
                                                <span>Color: {line.variantDetails.color}</span>
                                            )}
                                            <span>Qty: {line.quantity}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            SKU: {line.variantDetails.sku}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">
                                            ₦{line.lineTotal.amount.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            ₦{line.unitPrice.amount} each
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Shipping Address */}
                    <Card className="p-6">
                        <div className="flex items-center mb-4">
                            <MapPin className="w-6 h-6 text-teal-600 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-900">
                                Shipping Address
                            </h2>
                        </div>
                        <div className="text-gray-700">
                            <p>{order.shippingAddress.street}</p>
                            <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                {order.shippingAddress.postalCode}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    </Card>

                    {/* Order Timeline */}
                    <Card className="p-6">
                        <div className="flex items-center mb-4">
                            <Truck className="w-6 h-6 text-teal-600 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-900">Order Timeline</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 mr-4"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Order Placed</p>
                                    <p className="text-sm text-gray-600">
                                        {formatDate(order.createdAt)}
                                    </p>
                                </div>
                            </div>
                            {order.paymentStatus === 'paid' && (
                                <div className="flex items-start">
                                    <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 mr-4"></div>
                                    <div>
                                        <p className="font-medium text-gray-900">Payment Confirmed</p>
                                        <p className="text-sm text-gray-600">Payment received</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column - Summary */}
                <div>
                    <Card className="p-6 sticky top-24">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            Order Summary
                        </h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span>₦{order.subtotal.amount.toLocaleString()}</span>
                            </div>
                            {order.shipping && (
                                <div className="flex justify-between text-gray-700">
                                    <span>Shipping</span>
                                    {order.shipping.amount === 0 ? (
                                        <span className="text-green-600 font-medium">FREE</span>
                                    ) : (
                                        <span>₦{order.shipping.amount.toLocaleString()}</span>
                                    )}
                                </div>
                            )}
                            {order.discount.amount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-₦{order.discount.amount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="pt-3 border-t">
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>₦{order.totalAmount.amount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Status */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                                    <span className="font-medium text-gray-900">Payment</span>
                                </div>
                                <span
                                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                                        order.paymentStatus === 'paid'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                >
                                    {order.paymentStatus.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        {order.status === 'pending' && order.paymentStatus !== 'paid' && (
                            <Button className="w-full mb-3">Pay Now</Button>
                        )}

                        <Button
                            variant="secondary"
                            onClick={() => navigate('/orders')}
                            className="w-full"
                        >
                            Back to All Orders
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};