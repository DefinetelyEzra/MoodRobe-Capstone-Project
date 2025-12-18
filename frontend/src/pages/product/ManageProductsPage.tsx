// frontend/src/pages/ManageProductsPage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMerchant } from '@/hooks/useMerchant';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { productApi } from '@/api/product.api';
import { ProductSearchResponse } from '@/types/product.types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Package, Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

export const ManageProductsPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentMerchant, hasPermission } = useMerchant();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    const { data: productsData, isLoading, execute: fetchProducts } =
        useApi<ProductSearchResponse, { merchantId: string; searchTerm?: string; category?: string }>((params) =>
            productApi.search({
                merchantId: params.merchantId,
                searchTerm: params.searchTerm,
                category: params.category || undefined,
                limit: 100
            })
        );

    const { execute: deleteProduct } = useApi<void, string>((id) => productApi.delete(id));

    useEffect(() => {
        if (currentMerchant) {
            fetchProducts({
                merchantId: currentMerchant.id,
                searchTerm: searchTerm || undefined,
                category: filterCategory || undefined
            }).catch(console.error);
        }
    }, [currentMerchant, fetchProducts, searchTerm, filterCategory]);

    const products = productsData?.products || [];
    const categories = Array.from(new Set(products.map(p => p.category)));

    const handleDelete = async (productId: string) => {
        const confirmed = globalThis.confirm('Are you sure you want to delete this product?');
        if (!confirmed) return;

        try {
            await deleteProduct(productId);
            showToast('Product deleted successfully', 'success');
            if (currentMerchant) {
                await fetchProducts({ merchantId: currentMerchant.id });
            }
        } catch (error) {
            console.error('Failed to delete product:', error);
            showToast('Failed to delete product', 'error');
        }
    };

    if (!currentMerchant) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="text-center py-12">
                    <p className="text-gray-600">Please select a merchant account</p>
                </Card>
            </div>
        );
    }

    if (!hasPermission('canManageProducts')) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="text-center py-12">
                    <p className="text-red-600">You don't have permission to manage products</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
                    <p className="text-gray-600 mt-1">{currentMerchant.name}</p>
                </div>
                <Button
                    onClick={() => navigate('/merchant/products/new')}
                    className="mt-4 md:mt-0"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Product
                </Button>
            </div>

            {/* Search and Filter */}
            <Card className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </Card>

            {/* Products Table */}
            <Card>
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                        <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                ) : (
                    <ProductsTableContent
                        products={products}
                        searchTerm={searchTerm}
                        filterCategory={filterCategory}
                        onDelete={handleDelete}
                        navigate={navigate}
                    />
                )}
            </Card>
        </div>
    );
};

// Helper component to avoid nested ternary
interface ProductsTableContentProps {
    products: ProductSearchResponse['products'];
    searchTerm: string;
    filterCategory: string;
    onDelete: (id: string) => void;
    navigate: (path: string) => void;
}

const ProductsTableContent: React.FC<ProductsTableContentProps> = ({
    products,
    searchTerm,
    filterCategory,
    onDelete,
    navigate
}) => {
    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                    {searchTerm || filterCategory
                        ? 'Try adjusting your search or filters'
                        : 'Get started by creating your first product'
                    }
                </p>
                {!searchTerm && !filterCategory && (
                    <Button onClick={() => navigate('/merchant/products/new')}>
                        <Plus className="w-5 h-5 mr-2" />
                        Add Product
                    </Button>
                )}
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gray-200 rounded shrink-0">
                                        {product.images && product.images.length > 0 && (
                                            <img
                                                src={product.images.find(i => i.isPrimary)?.imageUrl || product.images[0].imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <div className="font-medium text-gray-900">{product.name}</div>
                                        <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">{product.category}</td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                                ${product.basePrice.amount.toFixed(2)}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">
                                {product.variants?.reduce((sum, v) => sum + v.stockQuantity, 0) || 0}
                            </td>
                            <td className="px-4 py-4">
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${product.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {product.isActive ? (
                                        <>
                                            <Eye className="w-3 h-3 mr-1" />
                                            Active
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff className="w-3 h-3 mr-1" />
                                            Inactive
                                        </>
                                    )}
                                </span>
                            </td>
                            <td className="px-4 py-4">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => navigate(`/merchant/products/${product.id}`)}
                                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(product.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};