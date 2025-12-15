import { createContext } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

export interface ToastContextType {
    showToast: (message: string, type: ToastType, duration?: number) => void;
    hideToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);