import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shirt, ArrowLeft } from 'lucide-react';
import { OutfitTypeSelector } from '@/components/features/outfit/OutfitTypeSelector';
import { OutfitCanvas } from '@/components/features/outfit/OutfitCanvas';
import { ProductSelector } from '@/components/features/outfit/ProductSelector';
import { OutfitActions } from '@/components/features/outfit/OutfitActions';
import { useOutfit } from '@/hooks/useOutfit';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { useAesthetic } from '@/hooks/useAesthetic';
import { OutfitType, OutfitSlotType, OutfitItems } from '@/types/outfit.types';
import { Product } from '@/types/product.types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { productApi } from '@/api/product.api';

export const OutfitBuilderPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const outfitId = searchParams.get('id');

    const [outfitType, setOutfitType] = useState<OutfitType>('full');
    const [selectedProducts, setSelectedProducts] = useState<Record<string, Product>>({});
    const [activeSlot, setActiveSlot] = useState<OutfitSlotType | null>(null);
    const [cartProducts, setCartProducts] = useState<Product[]>([]);
    const [isLoadingCartProducts, setIsLoadingCartProducts] = useState(false);

    const { createOutfit, updateOutfit, loadOutfitById, currentOutfit, isLoading } = useOutfit();
    const { cart, addItem } = useCart();
    const { showToast } = useToast();
    const { selectedAesthetic } = useAesthetic();

    // Load outfit if editing
    useEffect(() => {
        if (outfitId) {
            loadExistingOutfit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outfitId]);

    // Fetch full product details for cart items
    const fetchCartProducts = useCallback(async () => {
        if (!cart?.items || cart.items.length === 0) {
            setCartProducts([]);
            return;
        }

        try {
            setIsLoadingCartProducts(true);

            // Get unique product IDs from cart
            const productIds = new Set<string>();
            cart.items.forEach(item => {
                if (item.productId) {
                    productIds.add(item.productId);
                }
            });

            // Fetch full product details for each unique product
            const productPromises = Array.from(productIds).map(productId =>
                productApi.getById(productId).catch(error => {
                    console.error(`Failed to fetch product ${productId}:`, error);
                    return null;
                })
            );

            const products = await Promise.all(productPromises);

            // Filter out null values (failed fetches) and set cart products
            const validProducts = products.filter((p): p is Product => p !== null);
            setCartProducts(validProducts);
        } catch (error) {
            console.error('Failed to fetch cart products:', error);
            showToast('Failed to load cart products', 'warning');
            setCartProducts([]);
        } finally {
            setIsLoadingCartProducts(false);
        }
    }, [cart, showToast]);

    // Fetch cart products when cart changes
    useEffect(() => {
        fetchCartProducts();
    }, [fetchCartProducts]);

    const loadExistingOutfit = async () => {
        if (!outfitId) return;

        const outfit = await loadOutfitById(outfitId);
        if (outfit) {
            setOutfitType(outfit.outfitType);

            // Reconstruct selected products from itemDetails
            if (outfit.itemDetails) {
                const products: Record<string, Product> = {};
                outfit.itemDetails.forEach(item => {
                    const product: Product = {
                        id: item.productId,
                        merchantId: '',
                        name: item.productName,
                        description: '',
                        category: item.category,
                        basePrice: item.price,
                        aestheticTags: [],
                        isActive: true,
                        images: item.imageUrl ? [{
                            id: '',
                            productId: item.productId,
                            imageUrl: item.imageUrl,
                            displayOrder: 0,
                            isPrimary: true,
                            createdAt: ''
                        }] : [],
                        createdAt: '',
                        updatedAt: ''
                    };
                    products[item.slot] = product;
                });
                setSelectedProducts(products);
            }
        }
    };

    const handleAddItem = (slotType: OutfitSlotType) => {
        setActiveSlot(slotType);
    };

    const handleRemoveItem = (slotType: OutfitSlotType) => {
        setSelectedProducts(prev => {
            const updated = { ...prev };
            delete updated[slotType];
            return updated;
        });
    };

    const handleProductSelect = (product: Product) => {
        if (!activeSlot) return;

        setSelectedProducts(prev => ({
            ...prev,
            [activeSlot]: product
        }));
        setActiveSlot(null);
    };

    const handleSave = async (name: string, description: string, isPublic: boolean) => {
        // Validate inputs
        if (!name || name.trim().length === 0) {
            showToast('Please provide an outfit name', 'error');
            return;
        }

        if (Object.keys(selectedProducts).length === 0) {
            showToast('Please add at least one item to your outfit', 'warning');
            return;
        }

        // Build items object with only product IDs
        const items: OutfitItems = {};
        Object.entries(selectedProducts).forEach(([slot, product]) => {
            items[slot as OutfitSlotType] = product.id;
        });

        // Only include aesthetic tags if one is selected
        const aestheticTags = selectedAesthetic ? [selectedAesthetic.id] : [];

        console.log('Saving outfit with data:', {
            name: name.trim(),
            description: description.trim() || undefined,
            outfitType,
            items,
            aestheticTags,
            isPublic
        });

        try {
            if (outfitId && currentOutfit) {
                await updateOutfit(outfitId, {
                    name: name.trim(),
                    description: description.trim() || undefined,
                    items,
                    aestheticTags: aestheticTags.length > 0 ? aestheticTags : undefined,
                    isPublic
                });
            } else {
                await createOutfit(
                    name.trim(),
                    outfitType,
                    items,
                    description.trim() || undefined,
                    aestheticTags.length > 0 ? aestheticTags : undefined,
                    isPublic
                );
            }

            showToast('Outfit saved successfully!', 'success');
            navigate('/outfits');
        } catch (error) {
            console.error('Failed to save outfit:', error);

            // Extract error message if available
            let errorMessage = 'Failed to save outfit';
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
                errorMessage = axiosError.response?.data?.message ||
                    axiosError.response?.data?.error ||
                    errorMessage;
            }

            showToast(errorMessage, 'error');
        }
    };

    const handleAddToCart = async () => {
        try {
            const products = Object.values(selectedProducts);
            let addedCount = 0;
            let failedCount = 0;

            for (const product of products) {
                try {
                    // Get first active variant or use product ID
                    const activeVariant = product.variants?.find(v => v.isActive && v.stockQuantity > 0);
                    const variantId = activeVariant?.id || product.variants?.[0]?.id || product.id;

                    await addItem({
                        productId: product.id,
                        variantId,
                        quantity: 1
                    });
                    addedCount++;
                } catch (error) {
                    console.error(`Failed to add product ${product.id} to cart:`, error);
                    failedCount++;
                }
            }

            if (addedCount > 0) {
                showToast(
                    `Added ${addedCount} ${addedCount === 1 ? 'item' : 'items'} to cart!`,
                    failedCount > 0 ? 'warning' : 'success'
                );
                navigate('/cart');
            } else {
                showToast('Failed to add items to cart', 'error');
            }
        } catch (error) {
            console.error('Failed to add outfit to cart:', error);
            showToast('Failed to add outfit to cart', 'error');
        }
    };

    const handleClear = () => {
        if (globalThis.confirm('Are you sure you want to clear all items?')) {
            setSelectedProducts({});
        }
    };

    const hasItems = Object.keys(selectedProducts).length > 0;

    if (isLoading && outfitId) {
        return (
            <div className="min-h-screen bg-canvas flex items-center justify-center">
                <LoadingSpinner text="Loading outfit..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-canvas">
            {/* Header */}
            <div className="bg-linear-to-b from-accent/10 to-canvas border-b border-border">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <button
                        onClick={() => navigate('/outfits')}
                        className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Saved Outfits
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                            <Shirt className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary">
                                {outfitId ? 'Edit Outfit' : 'Create Outfit'}
                            </h1>
                            <p className="text-text-secondary">
                                Mix and match products to create your perfect look
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Outfit Type Selector */}
                {!outfitId && (
                    <OutfitTypeSelector
                        selectedType={outfitType}
                        onSelect={setOutfitType}
                    />
                )}

                {/* Outfit Canvas */}
                <div className="mb-8">
                    <OutfitCanvas
                        outfitType={outfitType}
                        selectedProducts={selectedProducts}
                        onAddItem={handleAddItem}
                        onRemoveItem={handleRemoveItem}
                    />
                </div>

                {/* Actions */}
                <OutfitActions
                    hasItems={hasItems}
                    onSave={handleSave}
                    onAddToCart={handleAddToCart}
                    onClear={handleClear}
                    isEditing={!!outfitId}
                    currentName={currentOutfit?.name}
                    currentDescription={currentOutfit?.description}
                />

                {/* Loading indicator for cart products */}
                {isLoadingCartProducts && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-text-secondary">Loading cart products...</p>
                    </div>
                )}
            </div>

            {/* Product Selector Modal */}
            {activeSlot && (
                <ProductSelector
                    isOpen={!!activeSlot}
                    onClose={() => setActiveSlot(null)}
                    slotType={activeSlot}
                    onSelect={handleProductSelect}
                    cartProducts={cartProducts}
                />
            )}
        </div>
    );
};