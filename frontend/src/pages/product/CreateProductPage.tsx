import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMerchant } from '@/hooks/useMerchant';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { useAesthetic } from '@/hooks/useAesthetic';
import { productApi, CreateProductRequest } from '@/api/product.api';
import { Product } from '@/types/product.types';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Package, ArrowLeft, Plus, X } from 'lucide-react';

interface VariantForm {
    sku: string;
    name: string;
    price: number;
    stockQuantity: number;
    attributes: Record<string, string>;
}

export const CreateProductPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentMerchant, hasPermission } = useMerchant();
    const { availableAesthetics } = useAesthetic();
    const { showToast } = useToast();

    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        category: string;
        basePrice: number;
        currency: string;
        aestheticTags: string[];
        isActive: boolean;
        variants: VariantForm[];
    }>({
        name: '',
        description: '',
        category: '',
        basePrice: 0,
        currency: 'USD',
        aestheticTags: [],
        isActive: true,
        variants: []
    });

    const { execute: createProduct, isLoading } = useApi<Product, CreateProductRequest>(
        (data) => productApi.create(currentMerchant!.id, data)
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentMerchant) {
            showToast('Please select a merchant account', 'error');
            return;
        }

        try {
            const productData: CreateProductRequest = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                basePrice: {
                    amount: formData.basePrice,
                    currency: formData.currency
                },
                aestheticTags: formData.aestheticTags,
                isActive: formData.isActive,
                variants: formData.variants.map(v => ({
                    sku: v.sku,
                    name: v.name,
                    price: {
                        amount: v.price,
                        currency: formData.currency
                    },
                    stockQuantity: v.stockQuantity,
                    attributes: v.attributes,
                    isActive: true
                }))
            };

            await createProduct(productData);
            showToast('Product created successfully!', 'success');
            navigate('/merchant/products');
        } catch (error) {
            console.error('Failed to create product:', error);
            showToast('Failed to create product', 'error');
        }
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    sku: '',
                    name: '',
                    price: prev.basePrice,
                    stockQuantity: 0,
                    attributes: {}
                }
            ]
        }));
    };

    const removeVariant = (index: number) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const updateVariant = (index: number, field: keyof VariantForm, value: string | number | Record<string, string>) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map((v, i) =>
                i === index ? { ...v, [field]: value } : v
            )
        }));
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
                    <p className="text-red-600">You don't have permission to create products</p>
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
                        <h1 className="text-2xl font-bold text-gray-900">Create New Product</h1>
                        <p className="text-gray-600">Add a new product to your store</p>
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
                                    className={`p-3 rounded-lg border-2 transition-all ${
                                        formData.aestheticTags.includes(aesthetic.id)
                                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-teal-300'
                                    }`}
                                >
                                    {aesthetic.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Variants */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Product Variants</h2>
                            <Button type="button" variant="secondary" onClick={addVariant}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Variant
                            </Button>
                        </div>

                        {formData.variants.length === 0 ? (
                            <p className="text-sm text-gray-600">No variants added. Add variants for different sizes, colors, etc.</p>
                        ) : (
                            <div className="space-y-4">
                                {formData.variants.map((variant, index) => (
                                    <Card key={`variant-${variant.sku || index}`} className="relative">
                                        <button
                                            type="button"
                                            onClick={() => removeVariant(index)}
                                            className="absolute top-4 right-4 text-red-600 hover:text-red-700"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="SKU"
                                                required
                                                value={variant.sku}
                                                onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                                placeholder="PROD-001"
                                            />

                                            <Input
                                                label="Variant Name"
                                                required
                                                value={variant.name}
                                                onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                                placeholder="e.g., Small / Black"
                                            />

                                            <Input
                                                label="Price"
                                                type="number"
                                                required
                                                min="0"
                                                step="0.01"
                                                value={variant.price}
                                                onChange={(e) => updateVariant(index, 'price', Number.parseFloat(e.target.value))}
                                            />

                                            <Input
                                                label="Stock Quantity"
                                                type="number"
                                                required
                                                min="0"
                                                value={variant.stockQuantity}
                                                onChange={(e) => updateVariant(index, 'stockQuantity', Number.parseInt(e.target.value, 10))}
                                            />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/merchant/products')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};