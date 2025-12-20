import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Filter } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { orderApi } from '@/api/order.api';
import { OrderStatus } from '@/types/order.types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
};

const paymentStatusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
                <p className="text-gray-600">Track and manage your orders</p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex items-center space-x-4 overflow-x-auto pb-2">
                <div className="flex items-center text-gray-700">
                    <Filter className="w-5 h-5 mr-2" />
                    <span className="font-medium">Filter:</span>
                </div>
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        filterStatus === 'all'
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    All Orders
                </button>
                {(['pending', 'processing', 'shipped', 'delivered'] as OrderStatus[]).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                            filterStatus === status
                                ? 'bg-teal-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <Card className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {filterStatus === 'all' ? 'No Orders Yet' : `No ${filterStatus} Orders`}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {filterStatus === 'all'
                            ? "You haven't placed any orders yet"
                            : `You don't have any ${filterStatus} orders`}
                    </p>
                    <Button onClick={() => navigate('/products')}>
                        Start Shopping
                    </Button>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <Card
                            key={order.id}
                            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => navigate(`/orders/${order.id}`)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    {/* Order Header */}
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Order #{order.orderNumber}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Placed on {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Badges */}
                                    <div className="flex items-center space-x-3 mb-4">
                                        <span
                                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                statusColors[order.status]
                                            }`}
                                        >
                                            {order.status.toUpperCase()}
                                        </span>
                                        <span
                                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                paymentStatusColors[order.paymentStatus]
                                            }`}
                                        >
                                            {order.paymentStatus === 'paid' ? 'PAID' : 'PAYMENT ' + order.paymentStatus.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-700">
                                            {order.orderLines.length} item(s)
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {order.orderLines.slice(0, 3).map((line) => (
                                                <span
                                                    key={line.id}
                                                    className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded"
                                                >
                                                    {line.productName} x{line.quantity}
                                                </span>
                                            ))}
                                            {order.orderLines.length > 3 && (
                                                <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded">
                                                    +{order.orderLines.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Total & Arrow */}
                                <div className="flex items-center space-x-4 ml-4">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 mb-1">Total</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            ₦{order.totalAmount.amount.toLocaleString()}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-gray-400" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};