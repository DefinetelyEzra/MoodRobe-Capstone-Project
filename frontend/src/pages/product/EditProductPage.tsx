import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMerchant } from '@/hooks/useMerchant';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { useAesthetic } from '@/hooks/useAesthetic';
import { productApi, UpdateProductRequest } from '@/api/product.api';
import { Product } from '@/types/product.types';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Package, ArrowLeft, Save, Plus, X } from 'lucide-react';
import { PRODUCT_CATEGORIES, CATEGORY_INFO } from '@/constants/productCategories';

interface VariantForm {
    id?: string;
    sku: string;
    name: string;
    size: string;
    color: string;
    price: string;
    stockQuantity: string;
    isNew?: boolean;
}

interface ImageForm {
    id?: string;
    imageUrl: string;
    isPrimary: boolean;
    displayOrder: number;
    isNew?: boolean;
}

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

    // State for tracking if user has made changes
    const [hasEdited, setHasEdited] = useState(false);

    // Form data - initialized from product or defaults
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        basePrice: 0,
        currency: 'USD',
        aestheticTags: [] as string[],
        isActive: true
    });

    const [variants, setVariants] = useState<VariantForm[]>([]);
    const [images, setImages] = useState<ImageForm[]>([]);

    // Initialize form data from product on first load
    useEffect(() => {
        if (id) {
            fetchProduct(id).catch(console.error);
        }
    }, [id, fetchProduct]);

    // Only update form when product loads AND user hasn't edited yet
    useEffect(() => {
        if (!product || hasEdited) return;

        // Use a microtask to avoid cascading render warning
        Promise.resolve().then(() => {
            setFormData({
                name: product.name,
                description: product.description,
                category: product.category,
                basePrice: product.basePrice.amount,
                currency: product.basePrice.currency,
                aestheticTags: product.aestheticTags,
                isActive: product.isActive
            });

            // Load existing variants
            if (product.variants) {
                setVariants(product.variants.map(v => ({
                    id: v.id,
                    sku: v.sku,
                    name: v.name || '',
                    size: v.size || '',
                    color: v.color || '',
                    price: v.price.amount.toString(),
                    stockQuantity: v.stockQuantity.toString(),
                    isNew: false
                })));
            }

            // Load existing images
            if (product.images) {
                setImages(product.images.map(img => ({
                    id: img.id,
                    imageUrl: img.imageUrl,
                    isPrimary: img.isPrimary,
                    displayOrder: img.displayOrder,
                    isNew: false
                })));
            }
        });
    }, [product, hasEdited]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Parse and validate variants
            const parsedVariants = [];
            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i];

                if (!variant.sku.trim()) {
                    showToast(`Variant ${i + 1}: SKU is required`, 'error');
                    return;
                }

                const variantPrice = Number.parseFloat(variant.price);
                if (Number.isNaN(variantPrice) || variantPrice < 0) {
                    showToast(`Variant ${i + 1}: Please enter a valid price`, 'error');
                    return;
                }

                const stockQuantity = Number.parseInt(variant.stockQuantity, 10);
                if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
                    showToast(`Variant ${i + 1}: Please enter a valid stock quantity`, 'error');
                    return;
                }

                parsedVariants.push({
                    id: variant.isNew ? undefined : variant.id,
                    sku: variant.sku.trim(),
                    name: variant.name.trim() || variant.sku.trim(),
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

            // Parse images
            const parsedImages = images
                .filter(img => img.imageUrl.trim())
                .map((img, index) => ({
                    id: img.isNew ? undefined : img.id,
                    imageUrl: img.imageUrl.trim(),
                    isPrimary: img.isPrimary,
                    displayOrder: index
                }));

            const updateData: UpdateProductRequest = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                basePrice: {
                    amount: formData.basePrice,
                    currency: formData.currency
                },
                aestheticTags: formData.aestheticTags,
                isActive: formData.isActive,
                variants: parsedVariants,
                images: parsedImages.length > 0 ? parsedImages : undefined
            };

            await updateProduct(updateData);
            showToast('Product updated successfully!', 'success');
            navigate('/merchant/products');
        } catch (error) {
            console.error('Failed to update product:', error);
            showToast('Failed to update product', 'error');
        }
    };

    const handleFormDataChange = useCallback((updates: Partial<typeof formData>) => {
        setHasEdited(true);
        setFormData(prev => ({ ...prev, ...updates }));
    }, []);

    const addVariant = useCallback(() => {
        setHasEdited(true);
        setVariants(prev => [
            ...prev,
            {
                sku: '',
                name: '',
                size: '',
                color: '',
                price: formData.basePrice.toString() || '0',
                stockQuantity: '0',
                isNew: true
            }
        ]);
    }, [formData.basePrice]);

    const removeVariant = useCallback((index: number) => {
        setHasEdited(true);
        setVariants(prev => prev.filter((_, i) => i !== index));
    }, []);

    const updateVariant = useCallback((index: number, field: keyof Omit<VariantForm, 'id' | 'isNew'>, value: string) => {
        setHasEdited(true);
        setVariants(prev => prev.map((v, i) =>
            i === index ? { ...v, [field]: value } : v
        ));
    }, []);

    const addImage = useCallback(() => {
        setHasEdited(true);
        setImages(prev => [
            ...prev,
            {
                imageUrl: '',
                isPrimary: prev.length === 0,
                displayOrder: prev.length,
                isNew: true
            }
        ]);
    }, []);

    const removeImage = useCallback((index: number) => {
        setHasEdited(true);
        setImages(prev => prev.filter((_, i) => i !== index));
    }, []);

    const updateImage = useCallback((index: number, field: keyof Omit<ImageForm, 'id' | 'isNew'>, value: string | boolean | number) => {
        setHasEdited(true);
        setImages(prev => prev.map((img, i) =>
            i === index ? { ...img, [field]: value } : img
        ));
    }, []);

    const setPrimaryImage = useCallback((index: number) => {
        setHasEdited(true);
        setImages(prev => prev.map((img, i) => ({
            ...img,
            isPrimary: i === index
        })));
    }, []);

    const toggleAesthetic = useCallback((aestheticId: string) => {
        setHasEdited(true);
        setFormData(prev => ({
            ...prev,
            aestheticTags: prev.aestheticTags.includes(aestheticId)
                ? prev.aestheticTags.filter(id => id !== aestheticId)
                : [...prev.aestheticTags, aestheticId]
        }));
    }, []);

    // Early returns for permission/loading checks
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
                    <p className="text-red-600 font-medium text-lg">
                        You don't have permission to edit products
                    </p>
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
                        onClick={() => navigate('/merchant/products')}
                        className="flex items-center text-accent hover:text-accent-dark mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Products
                    </button>
                    <div className="flex items-center">
                        <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center">
                            <Package className="w-8 h-8 text-accent" />
                        </div>
                        <div className="ml-4">
                            <h1 className="text-3xl font-bold text-text-primary">Edit Product</h1>
                            <p className="text-text-secondary mt-1">Update product information, variants, and images</p>
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
                                onChange={(e) => handleFormDataChange({ name: e.target.value })}
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
                                    onChange={(e) => handleFormDataChange({ description: e.target.value })}
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
                                    onChange={(e) => handleFormDataChange({ category: e.target.value })}
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
                                    onChange={(e) => handleFormDataChange({ basePrice: Number.parseFloat(e.target.value) })}
                                    placeholder="0.00"
                                />

                                <div>
                                    <label htmlFor="currency" className="block text-sm font-medium text-text-primary mb-2">
                                        Currency
                                    </label>
                                    <select
                                        id="currency"
                                        value={formData.currency}
                                        onChange={(e) => handleFormDataChange({ currency: e.target.value })}
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
                                    onChange={(e) => handleFormDataChange({ isActive: e.target.checked })}
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

                    {/* Product Variants */}
                    <div className="pt-6 border-t border-border">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-text-primary">Product Variants</h2>
                                <p className="text-sm text-text-secondary mt-1">Manage sizes, colors, and stock levels</p>
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

                        {variants.length === 0 ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                                <p className="text-sm text-amber-800 font-medium">
                                    No variants added. Click "Add Variant" to create variants.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {variants.map((variant, index) => (
                                    <div key={variant.id || index} className="relative bg-surface border border-border rounded-xl p-6 shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => removeVariant(index)}
                                            className="absolute top-4 right-4 text-red-600 hover:text-red-700 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>

                                        <div className="flex items-center gap-2 mb-4">
                                            <h3 className="text-sm font-semibold text-text-primary">
                                                Variant {index + 1}
                                            </h3>
                                            {variant.isNew && (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                                    New
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <Input
                                                label="SKU"
                                                required
                                                value={variant.sku}
                                                onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                                placeholder="PROD-001"
                                            />

                                            <Input
                                                label="Variant Name"
                                                value={variant.name}
                                                onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                                placeholder="e.g., Small / Black"
                                            />

                                            <Input
                                                label="Size (optional)"
                                                value={variant.size}
                                                onChange={(e) => updateVariant(index, 'size', e.target.value)}
                                                placeholder="e.g., S, M, L, XL"
                                            />

                                            <Input
                                                label="Color (optional)"
                                                value={variant.color}
                                                onChange={(e) => updateVariant(index, 'color', e.target.value)}
                                                placeholder="e.g., Black, White, Red"
                                            />

                                            <Input
                                                label="Price"
                                                type="number"
                                                required
                                                min="0"
                                                step="0.01"
                                                value={variant.price}
                                                onChange={(e) => updateVariant(index, 'price', e.target.value)}
                                                placeholder="0.00"
                                            />

                                            <Input
                                                label="Stock Quantity"
                                                type="number"
                                                required
                                                min="0"
                                                value={variant.stockQuantity}
                                                onChange={(e) => updateVariant(index, 'stockQuantity', e.target.value)}
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

                        {images.length === 0 ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                                <p className="text-sm text-blue-800 font-medium">
                                    No images added. Click "Add Image" to upload product images.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {images.map((image, index) => (
                                    <div key={image.id || index} className="relative bg-surface border border-border rounded-xl p-6 shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
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
                                                    onChange={(e) => updateImage(index, 'imageUrl', e.target.value)}
                                                    placeholder="https://example.com/image.jpg"
                                                />

                                                <div className="flex items-center gap-4 mt-2">
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="primaryImage"
                                                            checked={image.isPrimary}
                                                            onChange={() => setPrimaryImage(index)}
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
                                                    {image.isNew && (
                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                                            New
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
                            className="px-6 py-3 border border-border hover:bg-surface text-text-primary! rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isUpdating}
                            className="flex items-center px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors disabled:opacity-50 shadow-md"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};