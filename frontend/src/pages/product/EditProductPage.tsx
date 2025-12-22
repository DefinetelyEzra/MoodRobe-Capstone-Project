import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMerchant } from '@/hooks/useMerchant';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { useAesthetic } from '@/hooks/useAesthetic';
import { productApi, UpdateProductRequest } from '@/api/product.api';
import { Product } from '@/types/product.types';
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
                    <p className="text-red-600 font-medium text-lg">You don't have permission to edit products</p>
                </div>
            </div>
        );
    }

    if (loadingProduct) {
        return (
            <div className="min-h-screen bg-canvas flex items-center justify-center">
                <div className="bg-surface border border-border rounded-xl p-12 text-center max-w-md">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                    <p className="mt-4 text-text-secondary text-lg">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-canvas flex items-center justify-center">
                <div className="bg-surface border border-border rounded-xl p-12 text-center max-w-md">
                    <p className="text-text-secondary text-lg">Product not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-canvas">
            {/* Header */}
            <div className="bg-linear-to-b from-accent/10 to-canvas border-b border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => navigate('/merchant/dashboard')}
                        className="flex items-center text-accent hover:text-accent-dark mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>
                    <div className="flex items-center">
                        <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center">
                            <Package className="w-8 h-8 text-accent" />
                        </div>
                        <div className="ml-4">
                            <h1 className="text-3xl font-bold text-text-primary">Edit Product</h1>
                            <p className="text-text-secondary mt-1">Update product information</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary mb-6">Basic Information</h2>
                        <div className="space-y-6">
                            <Input
                                label="Product Name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Minimalist Cotton T-Shirt"
                            />

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface text-text-primary placeholder-text-secondary"
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

                            <div className="grid grid-cols-2 gap-6">
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
                                    <label htmlFor="currency" className="block text-sm font-medium text-text-primary mb-2">
                                        Currency
                                    </label>
                                    <select
                                        id="currency"
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface text-text-primary"
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
                                    className="rounded border-border text-accent focus:ring-accent"
                                />
                                <label htmlFor="isActive" className="ml-3 text-sm text-text-primary font-medium">
                                    Active (visible to customers)
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Aesthetic Tags */}
                    <div className="pt-6 border-t border-border">
                        <h2 className="text-xl font-semibold text-text-primary mb-6">Aesthetic Tags</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {availableAesthetics?.map((aesthetic) => (
                                <button
                                    key={aesthetic.id}
                                    type="button"
                                    onClick={() => toggleAesthetic(aesthetic.id)}
                                    className={`p-4 rounded-lg border transition-all text-sm font-medium ${formData.aestheticTags.includes(aesthetic.id)
                                            ? 'border-accent bg-accent/10 text-accent shadow-sm'
                                            : 'border-border bg-surface text-text-primary hover:border-accent hover:bg-accent/5'
                                        }`}
                                >
                                    {aesthetic.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Variants Info */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="pt-6 border-t border-border">
                            <h2 className="text-xl font-semibold text-text-primary mb-6">Product Variants</h2>
                            <div className="bg-canvas border border-border rounded-xl p-6 shadow-sm">
                                <p className="text-sm text-text-secondary mb-4">
                                    This product has {product.variants.length} variant(s).
                                    To manage variants and stock, use the product detail view.
                                </p>
                                <div className="space-y-3">
                                    {product.variants.slice(0, 3).map((variant) => (
                                        <div key={variant.id} className="flex justify-between text-sm border-b border-border pb-3 last:border-b-0 last:pb-0">
                                            <span className="text-text-primary font-medium">{variant.name}</span>
                                            <span className="text-text-secondary">Stock: {variant.stockQuantity}</span>
                                        </div>
                                    ))}
                                    {product.variants.length > 3 && (
                                        <p className="text-sm text-text-secondary pt-3">
                                            and {product.variants.length - 3} more...
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-border">
                        <Button
                            type="button"
                            onClick={() => navigate('/merchant/products')}
                            className="px-6 py-3 border border-border hover:bg-canvas text-text-primary rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isUpdating} className="flex items-center px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors disabled:opacity-50 shadow-md">
                            <Save className="w-4 h-4 mr-2" />
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};