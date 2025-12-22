import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMerchant } from '@/hooks/useMerchant';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { productApi } from '@/api/product.api';
import { ProductSearchResponse } from '@/types/product.types';
import { Button } from '@/components/common/Button';
import { Package, Plus, Search, Edit, Trash2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

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
            <div className="min-h-screen bg-canvas flex items-center justify-center">
                <div className="bg-surface border border-border rounded-xl p-12 text-center max-w-md">
                    <p className="text-text-secondary text-lg">Please select a merchant account</p>
                </div>
            </div>
        );
    }

    if (!hasPermission('canManageProducts')) {
        return (
            <div className="min-h-screen bg-canvas flex items-center justify-center">
                <div className="bg-surface border border-border rounded-xl p-12 text-center max-w-md">
                    <p className="text-red-600 font-medium text-lg">You don't have permission to manage products</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-canvas">
            {/* Header */}
            <div className="bg-linear-to-b from-accent/10 to-canvas border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <button
                        onClick={() => navigate('/merchant/dashboard')}
                        className="flex items-center text-accent hover:text-accent-dark mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-text-primary">Manage Products</h1>
                            <p className="text-text-secondary mt-2">{currentMerchant.name}</p>
                        </div>
                        <Button
                            onClick={() => navigate('/merchant/products/new')}
                            className="mt-4 md:mt-0 flex items-center px-6 py-3 bg-accent hover:bg-accent-dark text-surface font-semibold rounded-lg transition-colors shadow-md"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Product
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filter */}
                <div className="bg-surface border border-border rounded-xl p-6 mb-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface text-text-primary placeholder-text-secondary"
                            />
                        </div>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface text-text-primary"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="text-center py-16">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                            <p className="mt-4 text-text-secondary text-lg">Loading products...</p>
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
                </div>
            </div>
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
            <div className="text-center py-16">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-2">No products found</h3>
                <p className="text-text-secondary mb-6 text-lg">
                    {searchTerm || filterCategory
                        ? 'Try adjusting your search or filters'
                        : 'Get started by creating your first product'
                    }
                </p>
                {!searchTerm && !filterCategory && (
                    <Button onClick={() => navigate('/merchant/products/new')} className="px-8 py-4 bg-accent hover:bg-accent-dark text-surface font-semibold rounded-lg transition-colors shadow-md">
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
                <thead className="bg-canvas border-b border-border">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Product</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-canvas transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-accent/10 rounded shrink-0 flex items-center justify-center">
                                        {product.images && product.images.length > 0 && (
                                            <img
                                                src={product.images.find(i => i.isPrimary)?.imageUrl || product.images[0].imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <div className="font-medium text-text-primary">{product.name}</div>
                                        <div className="text-sm text-text-secondary line-clamp-1">{product.description}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-text-secondary">{product.category}</td>
                            <td className="px-6 py-4 text-sm text-text-primary font-medium">
                                ${product.basePrice.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-sm text-text-secondary">
                                {product.variants?.reduce((sum, v) => sum + v.stockQuantity, 0) || 0}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${product.isActive
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-canvas text-text-secondary border-border'
                                    }`}>
                                    {product.isActive ? (
                                        <>
                                            <Eye className="w-3 h-3 mr-1 inline" />
                                            Active
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff className="w-3 h-3 mr-1 inline" />
                                            Inactive
                                        </>
                                    )}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => navigate(`/merchant/products/${product.id}`)}
                                        className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
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