import React, { useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { CartContext, CartItem, CartContextType } from './CartContext';
import { cartApi } from '@/api/cart.api';
import { CartResponseDto } from '@/types/cart.types';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Load cart from backend on mount
    useEffect(() => {
        const loadCart = async () => {
            try {
                setIsLoading(true);
                const cartData = await cartApi.getCart();
                setCart(cartData);
            } catch (error) {
                console.error('Failed to load cart:', error);
                // If cart doesn't exist, it will be created on first add
            } finally {
                setIsLoading(false);
            }
        };

        loadCart();
    }, []);

    const addItem = useCallback(async (item: CartItem): Promise<void> => {
        try {
            setIsLoading(true);
            const updatedCart = await cartApi.addItem({
                productVariantId: item.variantId || '',
                quantity: item.quantity
            });
            setCart(updatedCart);
        } catch (error) {
            console.error('Failed to add item to cart:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const removeItem = useCallback(async (productId: string, variantId?: string): Promise<void> => {
        try {
            setIsLoading(true);
            const updatedCart = await cartApi.removeItem(variantId || productId);
            setCart(updatedCart);
        } catch (error) {
            console.error('Failed to remove item from cart:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateQuantity = useCallback(async (productId: string, quantity: number, variantId?: string): Promise<void> => {
        try {
            setIsLoading(true);
            const updatedCart = await cartApi.updateItemQuantity(
                variantId || productId,
                { quantity }
            );
            setCart(updatedCart);
        } catch (error) {
            console.error('Failed to update quantity:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearCart = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);
            await cartApi.clearCart();
            // Fetch the empty cart instead of setting to null
            const emptyCart = await cartApi.getCart();
            setCart(emptyCart);
        } catch (error) {
            console.error('Failed to clear cart:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getTotalItems = useCallback(() => {
        return cart?.itemCount || 0;
    }, [cart]);

    const refreshCart = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);
            const cartData = await cartApi.getCart();
            setCart(cartData);
        } catch (error) {
            console.error('Failed to refresh cart:', error);
            // Don't throw - just log the error
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Convert backend cart items to frontend CartItem format for compatibility
    const items = useMemo(() => {
        if (!cart?.items) return [];
        return cart.items.map(item => ({
            productId: item.productId || item.productVariantId,
            variantId: item.productVariantId,
            quantity: item.quantity
        }));
    }, [cart]);

    const contextValue = useMemo<CartContextType>(
        () => ({
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            getTotalItems,
            isLoading,
            cart,
            refreshCart
        }),
        [items, addItem, removeItem, updateQuantity, clearCart, getTotalItems, isLoading, cart, refreshCart]
    );

    return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};