import React, { useState, useCallback, useMemo, ReactNode } from 'react';
import { CartContext, CartItem, CartContextType } from './CartContext';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = useCallback((item: CartItem) => {
        setItems(prev => {
            const existingIndex = prev.findIndex(
                i => i.productId === item.productId && i.variantId === item.variantId
            );

            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + item.quantity
                };
                return updated;
            }

            return [...prev, item];
        });
    }, []);

    const removeItem = useCallback((productId: string, variantId?: string) => {
        setItems(prev =>
            prev.filter(item =>
                !(item.productId === productId && item.variantId === variantId)
            )
        );
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
        setItems(prev =>
            prev.map(item =>
                item.productId === productId && item.variantId === variantId
                    ? { ...item, quantity }
                    : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const getTotalItems = useCallback(() => {
        return items.reduce((total, item) => total + item.quantity, 0);
    }, [items]);

    const contextValue = useMemo<CartContextType>(
        () => ({
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            getTotalItems
        }),
        [items, addItem, removeItem, updateQuantity, clearCart, getTotalItems]
    );

    return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};