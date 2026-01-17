import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMerchant } from '@/hooks/useMerchant';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { useAesthetic } from '@/hooks/useAesthetic';
import { productApi, CreateProductRequest } from '@/api/product.api';
import { Product } from '@/types/product.types';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Package, ArrowLeft, Plus, X } from 'lucide-react';
import { PRODUCT_CATEGORIES, CATEGORY_INFO } from '@/constants/productCategories';

interface VariantForm {
    id: string;
    sku: string;
    name: string;
    size: string;
    color: string;
    price: string;
    stockQuantity: string;
}

interface ImageForm {
    id: string;
    imageUrl: string;
    isPrimary: boolean;
    displayOrder: number;
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
        basePrice: string;
        currency: string;
        aestheticTags: string[];
        isActive: boolean;
        variants: VariantForm[];
        images: ImageForm[];
    }>({
        name: '',
        description: '',
        category: '',
        basePrice: '',
        currency: 'USD',
        aestheticTags: [],
        isActive: true,
        variants: [],
        images: []
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

        // Parse and validate base price
        const basePrice = Number.parseFloat(formData.basePrice);
        if (Number.isNaN(basePrice) || basePrice < 0) {
            showToast('Please enter a valid base price', 'error');
            return;
        }

        // Validate and parse variants
        if (formData.variants.length === 0) {
            showToast('Please add at least one product variant', 'error');
            return;
        }

        const parsedVariants = [];
        for (let i = 0; i < formData.variants.length; i++) {
            const variant = formData.variants[i];

            // Validate SKU
            if (!variant.sku.trim()) {
                showToast(`Variant ${i + 1}: SKU is required`, 'error');
                return;
            }

            // Validate name
            if (!variant.name.trim()) {
                showToast(`Variant ${i + 1}: Name is required`, 'error');
                return;
            }

            // Parse and validate price
            const variantPrice = Number.parseFloat(variant.price);
            if (Number.isNaN(variantPrice) || variantPrice < 0) {
                showToast(`Variant ${i + 1}: Please enter a valid price`, 'error');
                return;
            }

            // Parse and validate stock quantity
            const stockQuantity = Number.parseInt(variant.stockQuantity, 10);
            if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
                showToast(`Variant ${i + 1}: Please enter a valid stock quantity`, 'error');
                return;
            }

            parsedVariants.push({
                sku: variant.sku.trim(),
                name: variant.name.trim(),
                size: variant.size.trim() || undefined,
                color: variant.color.trim() || undefined,
                price: {
                    amount: variantPrice,
                    currency: formData.currency
                },
                stockQuantity: stockQuantity,
                isActive: true
            });
        }

        // Validate and parse images
        const parsedImages = formData.images
            .filter(img => img.imageUrl.trim())
            .map((img, index) => ({
                imageUrl: img.imageUrl.trim(),
                isPrimary: img.isPrimary,
                displayOrder: index
            }));

        try {
            const productData: CreateProductRequest = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                category: formData.category.trim(),
                basePrice: {
                    amount: basePrice,
                    currency: formData.currency
                },
                aestheticTags: formData.aestheticTags,
                isActive: formData.isActive,
                variants: parsedVariants,
                images: parsedImages.length > 0 ? parsedImages : undefined
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
                    id: Date.now().toString(),
                    sku: '',
                    name: '',
                    size: '',
                    color: '',
                    price: prev.basePrice || '0',
                    stockQuantity: '0'
                }
            ]
        }));
    };

    const removeVariant = (id: string) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter(v => v.id !== id)
        }));
    };

    const updateVariant = (id: string, field: keyof Omit<VariantForm, 'id'>, value: string) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(v =>
                v.id === id ? { ...v, [field]: value } : v
            )
        }));
    };

    // Add image management functions after variant functions
    const addImage = () => {
        setFormData(prev => ({
            ...prev,
            images: [
                ...prev.images,
                {
                    id: Date.now().toString(),
                    imageUrl: '',
                    isPrimary: prev.images.length === 0, // First image is primary by default
                    displayOrder: prev.images.length
                }
            ]
        }));
    };

    const removeImage = (id: string) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter(img => img.id !== id)
        }));
    };

    const updateImage = (id: string, field: keyof Omit<ImageForm, 'id'>, value: string | boolean | number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.map(img =>
                img.id === id ? { ...img, [field]: value } : img
            )
        }));
    };

    const setPrimaryImage = (id: string) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.map(img => ({
                ...img,
                isPrimary: img.id === id
            }))
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
                    <p className="text-red-600 font-medium text-lg">You don't have permission to create products</p>
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
                            <h1 className="text-3xl font-bold text-text-primary">Create New Product</h1>
                            <p className="text-text-secondary mt-1">Add a new product to your store</p>
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

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-text-primary mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface text-text-primary"
                                >
                                    <option value="">Select a category...</option>
                                    {PRODUCT_CATEGORIES.map((category) => (
                                        <option key={category} value={category}>
                                            {CATEGORY_INFO[category].label}
                                            {CATEGORY_INFO[category].description &&
                                                ` - ${CATEGORY_INFO[category].description}`
                                            }
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <Input
                                    label="Base Price"
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.basePrice}
                                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
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

                    {/* Variants */}
                    <div className="pt-6 border-t border-border">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-text-primary">Product Variants</h2>
                                <p className="text-sm text-text-secondary mt-1">At least one variant is required</p>
                            </div>
                            <Button
                                type="button"
                                onClick={addVariant}
                                className="flex items-center px-4 py-2 bg-accent hover:bg-accent-dark text-surface font-medium rounded-lg transition-colors shadow-sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Variant
                            </Button>
                        </div>

                        {formData.variants.length === 0 ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                                <p className="text-sm text-amber-800 font-medium">
                                    No variants added. Click "Add Variant" to create your first variant.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {formData.variants.map((variant, index) => (
                                    <div key={variant.id} className="relative bg-surface border border-border rounded-xl p-6 shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => removeVariant(variant.id)}
                                            className="absolute top-4 right-4 text-red-600 hover:text-red-700 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>

                                        <h3 className="text-sm font-semibold text-text-primary mb-4">Variant {index + 1}</h3>

                                        <div className="grid grid-cols-2 gap-6">
                                            <Input
                                                label="SKU"
                                                required
                                                value={variant.sku}
                                                onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                                                placeholder="PROD-001"
                                            />

                                            <Input
                                                label="Variant Name"
                                                required
                                                value={variant.name}
                                                onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
                                                placeholder="e.g., Small / Black"
                                            />

                                            <Input
                                                label="Size (optional)"
                                                value={variant.size}
                                                onChange={(e) => updateVariant(variant.id, 'size', e.target.value)}
                                                placeholder="e.g., S, M, L, XL"
                                            />

                                            <Input
                                                label="Color (optional)"
                                                value={variant.color}
                                                onChange={(e) => updateVariant(variant.id, 'color', e.target.value)}
                                                placeholder="e.g., Black, White, Red"
                                            />

                                            <Input
                                                label="Price"
                                                type="number"
                                                required
                                                min="0"
                                                step="0.01"
                                                value={variant.price}
                                                onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                                                placeholder="0.00"
                                            />

                                            <Input
                                                label="Stock Quantity"
                                                type="number"
                                                required
                                                min="0"
                                                value={variant.stockQuantity}
                                                onChange={(e) => updateVariant(variant.id, 'stockQuantity', e.target.value)}
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Images */}
                    <div className="pt-6 border-t border-border">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-text-primary">Product Images</h2>
                                <p className="text-sm text-text-secondary mt-1">Add image URLs for your product</p>
                            </div>
                            <Button
                                type="button"
                                onClick={addImage}
                                className="flex items-center px-4 py-2 bg-accent hover:bg-accent-dark text-surface font-medium rounded-lg transition-colors shadow-sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Image
                            </Button>
                        </div>

                        {formData.images.length === 0 ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                                <p className="text-sm text-blue-800 font-medium">
                                    No images added. Click "Add Image" to upload product images.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {formData.images.map((image, index) => (
                                    <div key={image.id} className="relative bg-surface border border-border rounded-xl p-6 shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => removeImage(image.id)}
                                            className="absolute top-4 right-4 text-red-600 hover:text-red-700 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>

                                        <div className="flex items-start gap-4">
                                            {image.imageUrl && (
                                                <img
                                                    src={image.imageUrl}
                                                    alt={`Product ${index + 1}`}
                                                    className="w-24 h-24 object-cover rounded-lg border border-border"
                                                    onError={(e) => {
                                                        e.currentTarget.src = 'https://via.placeholder.com/100?text=Invalid+URL';
                                                    }}
                                                />
                                            )}

                                            <div className="flex-1 space-y-4">
                                                <Input
                                                    label="Image URL"
                                                    required
                                                    value={image.imageUrl}
                                                    onChange={(e) => updateImage(image.id, 'imageUrl', e.target.value)}
                                                    placeholder="https://example.com/image.jpg"
                                                />

                                                <div className="flex items-center gap-4">
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="primaryImage"
                                                            checked={image.isPrimary}
                                                            onChange={() => setPrimaryImage(image.id)}
                                                            className="rounded-full border-border text-accent focus:ring-accent mr-2"
                                                        />
                                                        <span className="text-sm text-text-primary font-medium">
                                                            Set as primary image
                                                        </span>
                                                    </label>
                                                    {image.isPrimary && (
                                                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">
                                                            Primary
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-border">
                        <Button
                            type="button"
                            onClick={() => navigate('/merchant/products')}
                            className="px-6 py-3 border border-border hover:bg-canvas text-text-primary! rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors disabled:opacity-50 shadow-md"
                        >
                            {isLoading ? 'Creating...' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};