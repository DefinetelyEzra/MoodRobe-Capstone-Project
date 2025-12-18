import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMerchant } from '@/hooks/useMerchant';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { useAesthetic } from '@/hooks/useAesthetic';
import { productApi, UpdateProductRequest } from '@/api/product.api';
import { Product } from '@/types/product.types';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Package, ArrowLeft, Save } from 'lucide-react';

export const EditProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentMerchant, hasPermission } = useMerchant();
    const { availableAesthetics } = useAesthetic();
    const { showToast } = useToast();

    const { data: product, isLoading: loadingProduct, execute: fetchProduct } =
        useApi<Product, string>((productId) => productApi.getById(productId));

    const { execute: updateProduct, isLoading: isUpdating } = useApi<Product, UpdateProductRequest>(
        (data) => productApi.update(id!, data)
    );

    useEffect(() => {
        if (id) {
            fetchProduct(id).catch(console.error);
        }
    }, [id, fetchProduct]);

    // Derive form data from product (no need for separate state until editing)
    const initialFormData = product ? {
        name: product.name,
        description: product.description,
        category: product.category,
        basePrice: product.basePrice.amount,
        currency: product.basePrice.currency,
        aestheticTags: product.aestheticTags,
        isActive: product.isActive
    } : {
        name: '',
        description: '',
        category: '',
        basePrice: 0,
        currency: 'USD',
        aestheticTags: [],
        isActive: true
    };

    const [formData, setFormData] = useState(initialFormData);

    // Update form data when product first loads
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                category: product.category,
                basePrice: product.basePrice.amount,
                currency: product.basePrice.currency,
                aestheticTags: product.aestheticTags,
                isActive: product.isActive
            });
        }
        // Only run when product changes from null to a value
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product?.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const updateData: UpdateProductRequest = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                basePrice: {
                    amount: formData.basePrice,
                    currency: formData.currency
                },
                aestheticTags: formData.aestheticTags,
                isActive: formData.isActive
            };

            await updateProduct(updateData);
            showToast('Product updated successfully!', 'success');
            navigate('/merchant/products');
        } catch (error) {
            console.error('Failed to update product:', error);
            showToast('Failed to update product', 'error');
        }
    };

    const toggleAesthetic = (aestheticId: string) => {
        setFormData(prev => ({
            ...prev,
            aestheticTags: prev.aestheticTags.includes(aestheticId)
                ? prev.aestheticTags.filter(id => id !== aestheticId)
                : [...prev.aestheticTags, aestheticId]
        }));
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
                    <p className="text-red-600">You don't have permission to edit products</p>
                </Card>
            </div>
        );
    }

    if (loadingProduct) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                    <p className="mt-4 text-gray-600">Loading product...</p>
                </Card>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="text-center py-12">
                    <p className="text-gray-600">Product not found</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => navigate('/merchant/products')}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Products
            </button>

            <Card>
                <div className="flex items-center mb-6">
                    <div className="p-3 bg-teal-100 rounded-lg">
                        <Package className="w-8 h-8 text-teal-600" />
                    </div>
                    <div className="ml-4">
                        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                        <p className="text-gray-600">Update product information</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                        <div className="space-y-4">
                            <Input
                                label="Product Name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Minimalist Cotton T-Shirt"
                            />

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="Describe your product..."
                                />
                            </div>

                            <Input
                                label="Category"
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                placeholder="e.g., T-Shirts, Dresses, Pants"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Base Price"
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.basePrice}
                                    onChange={(e) => setFormData({ ...formData, basePrice: Number.parseFloat(e.target.value) })}
                                    placeholder="0.00"
                                />

                                <div>
                                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                                        Currency
                                    </label>
                                    <select
                                        id="currency"
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    >
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                        <option value="NGN">NGN</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                />
                                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                                    Active (visible to customers)
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Aesthetic Tags */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aesthetic Tags</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {availableAesthetics?.map((aesthetic) => (
                                <button
                                    key={aesthetic.id}
                                    type="button"
                                    onClick={() => toggleAesthetic(aesthetic.id)}
                                    className={`p-3 rounded-lg border-2 transition-all ${formData.aestheticTags.includes(aesthetic.id)
                                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-teal-300'
                                        }`}
                                >
                                    {aesthetic.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Variants Info */}
                    {product.variants && product.variants.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Variants</h2>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-3">
                                    This product has {product.variants.length} variant(s).
                                    To manage variants and stock, use the product detail view.
                                </p>
                                <div className="space-y-2">
                                    {product.variants.slice(0, 3).map((variant) => (
                                        <div key={variant.id} className="flex justify-between text-sm">
                                            <span className="text-gray-700">{variant.name}</span>
                                            <span className="text-gray-500">Stock: {variant.stockQuantity}</span>
                                        </div>
                                    ))}
                                    {product.variants.length > 3 && (
                                        <p className="text-sm text-gray-500">
                                            and {product.variants.length - 3} more...
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/merchant/products')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                            <Save className="w-4 h-4 mr-2" />
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};