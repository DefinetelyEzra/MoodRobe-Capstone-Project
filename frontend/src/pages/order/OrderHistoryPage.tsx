import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Filter, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { orderApi } from '@/api/order.api';
import { OrderStatus } from '@/types/order.types';
import { Card } from '@/components/common/Card';

const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    processing: 'bg-purple-50 text-purple-700 border-purple-200',
    shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    refunded: 'bg-gray-50 text-gray-700 border-gray-200'
};

const paymentStatusColors = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    paid: 'bg-green-50 text-green-700 border-green-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
    refunded: 'bg-gray-50 text-gray-700 border-gray-200'
};

export const OrderHistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

    const { data: orders, isLoading, execute: fetchOrders } = useApi(() =>
        orderApi.getUserOrders({ limit: 50, offset: 0 })
    );

    const loadOrders = useCallback(async () => {
        try {
            await fetchOrders();
        } catch (error) {
            console.error('Failed to load orders:', error);
        }
    }, [fetchOrders]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const filteredOrders = orders?.filter((order) =>
        filterStatus === 'all' ? true : order.status === filterStatus
    ) || [];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-canvas flex items-center justify-center">
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                    <p className="mt-4 text-text-secondary">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-canvas">
            {/* Header */}
            <div className="bg-linear-to-b from-accent/10 to-canvas border-b border-border">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center text-accent hover:text-accent-dark mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Profile
                    </button>
                    <h1 className="text-4xl font-bold text-text-primary mb-2">Order History</h1>
                    <p className="text-text-secondary">Track and manage your orders</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Filters */}
                <div className="mb-8 flex items-center space-x-3 overflow-x-auto pb-2">
                    <div className="flex items-center text-text-primary bg-surface px-3 py-2 rounded-lg border border-border">
                        <Filter className="w-5 h-5 mr-2 text-accent" />
                        <span className="font-medium">Filter:</span>
                    </div>
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filterStatus === 'all'
                            ? 'bg-accent text-surface shadow-sm'
                            : 'bg-surface text-text-primary hover:bg-canvas border border-border'
                            }`}
                    >
                        All Orders
                    </button>
                    {(['pending', 'processing', 'shipped', 'delivered'] as OrderStatus[]).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filterStatus === status
                                ? 'bg-accent text-surface shadow-sm'
                                : 'bg-surface text-text-primary hover:bg-canvas border border-border'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <Card className="bg-surface border border-border">
                        <div className="text-center py-16 px-4">
                            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-10 h-10 text-accent" />
                            </div>
                            <h2 className="text-2xl font-bold text-text-primary mb-2">
                                {filterStatus === 'all' ? 'No Orders Yet' : `No ${filterStatus} Orders`}
                            </h2>
                            <p className="text-text-secondary mb-6">
                                {filterStatus === 'all'
                                    ? "You haven't placed any orders yet. Start exploring our collections!"
                                    : `You don't have any ${filterStatus} orders at the moment.`}
                            </p>
                            <button
                                onClick={() => navigate('/products')}
                                className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-medium transition-colors"
                            >
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Start Shopping
                            </button>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <Card
                                key={order.id}
                                className="bg-surface border border-border hover:shadow-lg transition-all cursor-pointer group"
                                onClick={() => navigate(`/orders/${order.id}`)}
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {/* Order Header */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">
                                                        Order #{order.orderNumber}
                                                    </h3>
                                                    <p className="text-sm text-text-secondary mt-1">
                                                        Placed on {formatDate(order.createdAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Status Badges */}
                                            <div className="flex items-center space-x-2 mb-4 flex-wrap gap-2">
                                                <span
                                                    className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColors[order.status]
                                                        }`}
                                                >
                                                    {order.status.toUpperCase()}
                                                </span>
                                                <span
                                                    className={`px-3 py-1 text-xs font-medium rounded-full border ${paymentStatusColors[order.paymentStatus]
                                                        }`}
                                                >
                                                    {order.paymentStatus === 'paid' ? 'PAID' : 'PAYMENT ' + order.paymentStatus.toUpperCase()}
                                                </span>
                                            </div>

                                            {/* Order Items Preview */}
                                            <div className="space-y-3">
                                                <p className="text-sm font-medium text-text-secondary">
                                                    {order.orderLines.length} {order.orderLines.length === 1 ? 'item' : 'items'}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {order.orderLines.slice(0, 3).map((line) => (
                                                        <span
                                                            key={line.id}
                                                            className="text-sm text-text-primary bg-canvas px-3 py-1.5 rounded-lg border border-border"
                                                        >
                                                            {line.productName} <span className="text-text-secondary">×{line.quantity}</span>
                                                        </span>
                                                    ))}
                                                    {order.orderLines.length > 3 && (
                                                        <span className="text-sm text-text-secondary bg-canvas px-3 py-1.5 rounded-lg border border-border">
                                                            +{order.orderLines.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side - Total & Arrow */}
                                        <div className="flex items-center space-x-4 ml-6">
                                            <div className="text-right">
                                                <p className="text-sm text-text-secondary mb-1">Total</p>
                                                <p className="text-2xl font-bold text-text-primary">
                                                    ₦{order.totalAmount.amount.toLocaleString()}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-6 h-6 text-text-secondary group-hover:text-accent transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};