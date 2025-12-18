import { createContext } from 'react';
import { CartResponseDto } from '@/types/cart.types';

export interface CartItem {
    productId: string;
    variantId?: string;
    quantity: number;
}

export interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => Promise<CartResponseDto | void>;
    removeItem: (productId: string, variantId?: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number, variantId?: string) => Promise<void>;
    clearCart: () => Promise<void>;
    getTotalItems: () => number;
    isLoading?: boolean;
    cart?: CartResponseDto | null;
    refreshCart?: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);