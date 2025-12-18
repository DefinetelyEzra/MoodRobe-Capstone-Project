import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMerchant } from '@/hooks/useMerchant';
import { useApi } from '@/hooks/useApi';
import { productApi } from '@/api/product.api';
import { ProductSearchResponse } from '@/types/product.types';
import { Store, Package, Users, Settings, TrendingUp, Plus } from 'lucide-react';
import { Card } from '@/components/common/Card';

export const MerchantDashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        currentMerchant,
        merchants,
        setCurrentMerchant,
        hasPermission,
        isOwner
    } = useMerchant();

    // Fetch merchant's products
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="text-center py-12">
                    <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        No Merchant Account
                    </h2>
                    <p className="text-gray-600 mb-6">
                        You need to create a merchant account to access the dashboard.
                    </p>
                    <button
                        onClick={() => navigate('/merchant/create')}
                        className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Create Merchant Account
                    </button>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div className="mb-4 md:mb-0">
                    <h1 className="text-3xl font-bold text-gray-900">Merchant Dashboard</h1>
                    <p className="text-gray-600 mt-1">Manage your store and products</p>
                </div>

                {/* Merchant Selector */}
                {merchants.length > 1 && (
                    <select
                        value={currentMerchant.id}
                        onChange={(e) => handleMerchantChange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                        {merchants.map((merchant) => (
                            <option key={merchant.id} value={merchant.id}>
                                {merchant.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 bg-teal-100 rounded-lg">
                            <Package className="w-6 h-6 text-teal-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Active Products</p>
                            <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Store className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Stock</p>
                            <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <Users className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Status</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {currentMerchant.isActive ? (
                                    <span className="text-green-600">Active</span>
                                ) : (
                                    <span className="text-red-600">Inactive</span>
                                )}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {hasPermission('canManageProducts') && (
                    <button
                        onClick={() => navigate('/merchant/products/new')}
                        className="p-6 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors text-left group"
                    >
                        <Plus className="w-8 h-8 text-gray-400 group-hover:text-teal-600 mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-1">Add Product</h3>
                        <p className="text-sm text-gray-600">Create a new product</p>
                    </button>
                )}

                {hasPermission('canManageProducts') && (
                    <button
                        onClick={() => navigate('/merchant/products')}
                        className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors text-left group"
                    >
                        <Package className="w-8 h-8 text-gray-600 group-hover:text-teal-600 mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-1">Manage Products</h3>
                        <p className="text-sm text-gray-600">View and edit products</p>
                    </button>
                )}

                {hasPermission('canManageStaff') && (
                    <button
                        onClick={() => navigate('/merchant/staff')}
                        className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors text-left group"
                    >
                        <Users className="w-8 h-8 text-gray-600 group-hover:text-teal-600 mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-1">Manage Staff</h3>
                        <p className="text-sm text-gray-600">Add and manage team</p>
                    </button>
                )}

                {isOwner() && (
                    <button
                        onClick={() => navigate('/merchant/settings')}
                        className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors text-left group"
                    >
                        <Settings className="w-8 h-8 text-gray-600 group-hover:text-teal-600 mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-1">Settings</h3>
                        <p className="text-sm text-gray-600">Configure your store</p>
                    </button>
                )}
            </div>

            {/* Recent Products */}
            {hasPermission('canManageProducts') && (
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Products</h2>
                        <button
                            onClick={() => navigate('/merchant/products')}
                            className="text-teal-600 hover:text-teal-700 font-medium"
                        >
                            View All
                        </button>
                    </div>

                    <RecentProductsContent
                        loadingProducts={loadingProducts}
                        products={products}
                        navigate={navigate}
                    />
                </Card>
            )}
        </div>
    );
};

// Helper component to avoid nested ternary
interface RecentProductsContentProps {
    loadingProducts: boolean;
    products: ProductSearchResponse['products'];
    navigate: (path: string) => void;
}

const RecentProductsContent: React.FC<RecentProductsContentProps> = ({
    loadingProducts,
    products,
    navigate
}) => {
    if (loadingProducts) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No products yet</p>
                <button
                    onClick={() => navigate('/merchant/products/new')}
                    className="mt-4 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                >
                    Create Your First Product
                </button>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {products.slice(0, 5).map((product) => (
                        <tr
                            key={product.id}
                            onClick={() => navigate(`/merchant/products/${product.id}`)}
                            className="hover:bg-gray-50 cursor-pointer"
                        >
                            <td className="px-4 py-4">
                                <div className="font-medium text-gray-900">{product.name}</div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">{product.category}</td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                                ${product.basePrice.amount.toFixed(2)}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">
                                {product.variants?.reduce((sum, v) => sum + v.stockQuantity, 0) || 0}
                            </td>
                            <td className="px-4 py-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
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
};