import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Truck, CheckCircle2, Clock } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { orderApi } from '@/api/order.api';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

const statusColors = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    processing: 'bg-purple-50 text-purple-700 border-purple-200',
    shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    refunded: 'bg-gray-50 text-gray-700 border-gray-200'
};

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
            <div className="min-h-screen bg-canvas flex items-center justify-center">
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                    <p className="mt-4 text-text-secondary">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-canvas">
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <Card className="bg-surface border border-border text-center py-12">
                        <Package className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-text-primary mb-4">Order Not Found</h2>
                        <p className="text-text-secondary mb-6">We couldn't find the order you're looking for.</p>
                        <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-canvas">
            {/* Header */}
            <div className="bg-linear-to-b from-accent/10 to-canvas border-b border-border">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <button
                        onClick={() => navigate('/orders')}
                        className="flex items-center text-accent hover:text-accent-dark mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Orders
                    </button>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary">
                                Order #{order.orderNumber}
                            </h1>
                            <p className="text-text-secondary mt-2">
                                Placed on {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <span className={`inline-block px-6 py-3 rounded-lg text-sm font-semibold border ${statusColors[order.status]}`}>
                            {order.status.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <Card className="bg-surface border border-border">
                            <div className="p-6">
                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                                        <Package className="w-5 h-5 text-accent" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-text-primary">Order Items</h2>
                                </div>

                                <div className="space-y-4">
                                    {order.orderLines.map((line) => (
                                        <div
                                            key={line.id}
                                            className="flex items-center space-x-4 pb-4 border-b border-border last:border-b-0"
                                        >
                                            <div className="w-20 h-20 bg-canvas rounded-lg border border-border shrink-0" />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-text-primary">{line.productName}</h3>
                                                <div className="flex items-center space-x-4 text-sm text-text-secondary mt-1.5">
                                                    {line.variantDetails.size && (
                                                        <span className="bg-canvas px-2 py-1 rounded border border-border">
                                                            Size: {line.variantDetails.size}
                                                        </span>
                                                    )}
                                                    {line.variantDetails.color && (
                                                        <span className="bg-canvas px-2 py-1 rounded border border-border">
                                                            {line.variantDetails.color}
                                                        </span>
                                                    )}
                                                    <span className="bg-canvas px-2 py-1 rounded border border-border">
                                                        Qty: {line.quantity}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-text-secondary mt-2">
                                                    SKU: {line.variantDetails.sku}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-text-primary text-lg">
                                                    ₦{line.lineTotal.amount.toLocaleString()}
                                                </p>
                                                <p className="text-sm text-text-secondary">
                                                    ₦{line.unitPrice.amount.toLocaleString()} each
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* Shipping Address */}
                        <Card className="bg-surface border border-border">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                                        <MapPin className="w-5 h-5 text-accent" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-text-primary">
                                        Shipping Address
                                    </h2>
                                </div>
                                <div className="text-text-primary bg-canvas p-4 rounded-lg border border-border">
                                    <p className="font-medium">{order.shippingAddress.street}</p>
                                    <p className="mt-1">
                                        {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                        {order.shippingAddress.postalCode}
                                    </p>
                                    <p className="mt-1">{order.shippingAddress.country}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Order Timeline */}
                        <Card className="bg-surface border border-border">
                            <div className="p-6">
                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                                        <Truck className="w-5 h-5 text-accent" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-text-primary">Order Timeline</h2>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mr-4 shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-accent" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-text-primary">Order Placed</p>
                                            <p className="text-sm text-text-secondary mt-1">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    {order.paymentStatus === 'paid' && (
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center mr-4 border border-green-200 shrink-0">
                                                <CheckCircle2 className="w-4 h-4 text-green-700" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-text-primary">Payment Confirmed</p>
                                                <p className="text-sm text-text-secondary mt-1">Payment received successfully</p>
                                            </div>
                                        </div>
                                    )}
                                    {order.paymentStatus === 'pending' && (
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center mr-4 border border-amber-200 shrink-0">
                                                <Clock className="w-4 h-4 text-amber-700" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-text-primary">Awaiting Payment</p>
                                                <p className="text-sm text-text-secondary mt-1">Complete payment to process order</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Summary */}
                    <div>
                        <Card className="bg-surface border border-border sticky top-24">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-text-primary mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                                    <div className="flex justify-between text-text-primary">
                                        <span>Subtotal</span>
                                        <span className="font-medium">₦{order.subtotal.amount.toLocaleString()}</span>
                                    </div>
                                    {order.shipping && (
                                        <div className="flex justify-between text-text-primary">
                                            <span>Shipping</span>
                                            {order.shipping.amount === 0 ? (
                                                <span className="text-green-700 font-semibold">FREE</span>
                                            ) : (
                                                <span className="font-medium">₦{order.shipping.amount.toLocaleString()}</span>
                                            )}
                                        </div>
                                    )}
                                    {order.discount.amount > 0 && (
                                        <div className="flex justify-between text-green-700">
                                            <span>Discount</span>
                                            <span className="font-semibold">-₦{order.discount.amount.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <div className="flex justify-between text-text-primary">
                                        <span className="text-lg font-semibold">Total</span>
                                        <span className="text-2xl font-bold">₦{order.totalAmount.amount.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Payment Status */}
                                <div className="mb-6 p-4 bg-canvas rounded-lg border border-border">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <CreditCard className="w-5 h-5 text-accent mr-2" />
                                            <span className="font-medium text-text-primary">Payment</span>
                                        </div>
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-full ${order.paymentStatus === 'paid'
                                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                }`}
                                        >
                                            {order.paymentStatus.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="space-y-3">
                                    {order.status === 'pending' && order.paymentStatus !== 'paid' && (
                                        <button className="w-full px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors">
                                            Pay Now
                                        </button>
                                    )}

                                    <button
                                        onClick={() => navigate('/orders')}
                                        className="w-full px-6 py-3 border border-border hover:bg-canvas text-text-primary rounded-lg font-medium transition-colors"
                                    >
                                        Back to All Orders
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};