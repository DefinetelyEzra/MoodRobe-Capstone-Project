import React, { useState, useCallback, useMemo, ReactNode } from 'react';
import { ToastContext, Toast, ToastType } from './ToastContext';
import { ToastContainer } from '@/components/common/Toast';

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const hideToast = useCallback((id: string): void => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType, duration = 5000): void => {
        const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const newToast: Toast = { id, message, type, duration };
        
        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                hideToast(id);
            }, duration);
        }
    }, [hideToast]);

    const contextValue = useMemo(
        () => ({
            showToast,
            hideToast,
        }),
        [showToast, hideToast]
    );

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={hideToast} />
        </ToastContext.Provider>
    );
};