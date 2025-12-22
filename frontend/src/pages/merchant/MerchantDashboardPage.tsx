import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMerchant } from '@/hooks/useMerchant';
import { useApi } from '@/hooks/useApi';
import { productApi } from '@/api/product.api';
import { ProductSearchResponse } from '@/types/product.types';
import { Store, Package, Users, Settings, TrendingUp, Plus } from 'lucide-react';

export const MerchantDashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        currentMerchant,
        merchants,
        setCurrentMerchant,
        hasPermission,
        isOwner
    } = useMerchant();

    const { data: productsData, isLoading: loadingProducts, execute: fetchProducts } =
        useApi<ProductSearchResponse, { merchantId: string }>((params) =>
            productApi.search({ merchantId: params.merchantId, limit: 100 })
        );

    useEffect(() => {
        if (currentMerchant) {
            fetchProducts({ merchantId: currentMerchant.id }).catch(console.error);
        }
    }, [currentMerchant, fetchProducts]);

    const handleMerchantChange = (merchantId: string) => {
        const merchant = merchants.find(m => m.id === merchantId);
        if (merchant) {
            setCurrentMerchant(merchant);
        }
    };

    const products = productsData?.products || [];
    const activeProducts = products.filter(p => p.isActive).length;
    const totalStock = products.reduce((sum, p) =>
        sum + (p.variants?.reduce((vSum, v) => vSum + v.stockQuantity, 0) || 0), 0
    );

    if (!currentMerchant) {
        return (
            <div className="min-h-screen bg-canvas flex items-center justify-center">
                <div className="bg-surface border border-border rounded-xl p-12 text-center max-w-md">
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Store className="w-10 h-10 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">
                        No Merchant Account
                    </h2>
                    <p className="text-text-secondary mb-6">
                        You need to create a merchant account to access the dashboard.
                    </p>
                    <button
                        onClick={() => navigate('/merchant/create')}
                        className="px-8 py-3 bg-accent hover:bg-accent-dark text-surface font-semibold rounded-lg transition-colors shadow-md"
                    >
                        Create Merchant Account
                    </button>
                </div>
            </div>
        );
    }

    let recentProductsContent;
    if (loadingProducts) {
        recentProductsContent = (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                <p className="mt-2 text-text-secondary">Loading products...</p>
            </div>
        );
    } else if (products.length === 0) {
        recentProductsContent = (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-8 h-8 text-accent" />
                </div>
                <p className="text-text-secondary mb-4">No products yet</p>
                <button
                    onClick={() => navigate('/merchant/products/new')}
                    className="px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg transition-colors font-semibold"
                >
                    Create Your First Product
                </button>
            </div>
        );
    } else {
        recentProductsContent = (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-canvas border-b border-border">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Product</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {products.slice(0, 5).map((product) => (
                            <tr
                                key={product.id}
                                onClick={() => navigate(`/merchant/products/${product.id}`)}
                                className="hover:bg-canvas cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="font-medium text-text-primary">{product.name}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-text-secondary">{product.category}</td>
                                <td className="px-6 py-4 text-sm text-text-primary font-medium">
                                    ₦{product.basePrice.amount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-text-secondary">
                                    {product.variants?.reduce((sum, v) => sum + v.stockQuantity, 0) || 0}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${product.isActive
                                            ? 'bg-green-50 text-green-700 border-green-200'
                                            : 'bg-canvas text-text-secondary border-border'
                                        }`}>
                                        {product.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-canvas">
            {/* Header */}
            <div className="bg-linear-to-b from-accent/10 to-canvas border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-text-primary">Merchant Dashboard</h1>
                            <p className="text-text-secondary mt-2">Manage your store and products</p>
                        </div>

                        {merchants.length > 1 && (
                            <select
                                value={currentMerchant.id}
                                onChange={(e) => handleMerchantChange(e.target.value)}
                                className="mt-4 md:mt-0 px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface text-text-primary"
                            >
                                {merchants.map((merchant) => (
                                    <option key={merchant.id} value={merchant.id}>
                                        {merchant.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-surface border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-accent" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-text-secondary font-medium">Total Products</p>
                                <p className="text-2xl font-bold text-text-primary">{products.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-text-secondary font-medium">Active Products</p>
                                <p className="text-2xl font-bold text-text-primary">{activeProducts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Store className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-text-secondary font-medium">Total Stock</p>
                                <p className="text-2xl font-bold text-text-primary">{totalStock}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-text-secondary font-medium">Status</p>
                                <p className="text-lg font-semibold">
                                    {currentMerchant.isActive ? (
                                        <span className="text-green-600">Active</span>
                                    ) : (
                                        <span className="text-red-600">Inactive</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {hasPermission('canManageProducts') && (
                        <button
                            onClick={() => navigate('/merchant/products/new')}
                            className="p-6 bg-surface border-2 border-dashed border-border rounded-xl hover:border-accent hover:bg-accent/5 transition-all text-left group"
                        >
                            <Plus className="w-8 h-8 text-accent mb-3" />
                            <h3 className="font-semibold text-text-primary mb-1">Add Product</h3>
                            <p className="text-sm text-text-secondary">Create a new product</p>
                        </button>
                    )}

                    {hasPermission('canManageProducts') && (
                        <button
                            onClick={() => navigate('/merchant/products')}
                            className="p-6 bg-surface border border-border rounded-xl hover:border-accent hover:shadow-md transition-all text-left"
                        >
                            <Package className="w-8 h-8 text-accent mb-3" />
                            <h3 className="font-semibold text-text-primary mb-1">Manage Products</h3>
                            <p className="text-sm text-text-secondary">View and edit products</p>
                        </button>
                    )}

                    {hasPermission('canManageStaff') && (
                        <button
                            onClick={() => navigate('/merchant/staff')}
                            className="p-6 bg-surface border border-border rounded-xl hover:border-accent hover:shadow-md transition-all text-left"
                        >
                            <Users className="w-8 h-8 text-accent mb-3" />
                            <h3 className="font-semibold text-text-primary mb-1">Manage Staff</h3>
                            <p className="text-sm text-text-secondary">Add and manage team</p>
                        </button>
                    )}

                    {isOwner() && (
                        <button
                            onClick={() => navigate('/merchant/settings')}
                            className="p-6 bg-surface border border-border rounded-xl hover:border-accent hover:shadow-md transition-all text-left"
                        >
                            <Settings className="w-8 h-8 text-accent mb-3" />
                            <h3 className="font-semibold text-text-primary mb-1">Settings</h3>
                            <p className="text-sm text-text-secondary">Configure your store</p>
                        </button>
                    )}
                </div>

                {/* Recent Products */}
                {hasPermission('canManageProducts') && (
                    <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-text-primary">Recent Products</h2>
                            <button
                                onClick={() => navigate('/merchant/products')}
                                className="text-accent hover:text-accent-dark font-medium transition-colors"
                            >
                                View All
                            </button>
                        </div>

                        {recentProductsContent}
                    </div>
                )}
            </div>
        </div>
    );
};