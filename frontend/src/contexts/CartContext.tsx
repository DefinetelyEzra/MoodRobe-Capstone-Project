import { createContext } from 'react';

export interface CartItem {
    productId: string;
    variantId?: string;
    quantity: number;
}

export interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (productId: string, variantId?: string) => void;
    updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
    clearCart: () => void;
    getTotalItems: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);