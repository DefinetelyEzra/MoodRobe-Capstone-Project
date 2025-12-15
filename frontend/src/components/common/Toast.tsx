import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Toast as ToastType } from '@/contexts/ToastContext';

interface ToastItemProps {
    toast: ToastType;
    onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if ((toast.duration ?? 0) > 0) {
            const timer = setTimeout(() => {
                setIsExiting(true);
                setTimeout(() => onDismiss(toast.id), 300);
            }, toast.duration);

            return () => clearTimeout(timer);
        }
    }, [toast, onDismiss]);

    const handleDismiss = (): void => {
        setIsExiting(true);
        setTimeout(() => onDismiss(toast.id), 300);
    };

    const getToastStyles = (): string => {
        const baseStyles = 'flex items-start gap-3 p-4 rounded-lg shadow-lg backdrop-blur-sm border max-w-md w-full';

        switch (toast.type) {
            case 'success':
                return `${baseStyles} bg-green-50/95 border-green-200 text-green-800`;
            case 'error':
                return `${baseStyles} bg-red-50/95 border-red-200 text-red-800`;
            case 'warning':
                return `${baseStyles} bg-yellow-50/95 border-yellow-200 text-yellow-800`;
            case 'info':
                return `${baseStyles} bg-blue-50/95 border-blue-200 text-blue-800`;
            default:
                return `${baseStyles} bg-gray-50/95 border-gray-200 text-gray-800`;
        }
    };

    const getIcon = (): React.ReactNode => {
        const iconProps = { className: 'w-5 h-5 shrink-0 mt-0.5' };

        switch (toast.type) {
            case 'success':
                return <CheckCircle {...iconProps} className={`${iconProps.className} text-green-600`} />;
            case 'error':
                return <XCircle {...iconProps} className={`${iconProps.className} text-red-600`} />;
            case 'warning':
                return <AlertTriangle {...iconProps} className={`${iconProps.className} text-yellow-600`} />;
            case 'info':
                return <Info {...iconProps} className={`${iconProps.className} text-blue-600`} />;
            default:
                return <Info {...iconProps} />;
        }
    };

    const animationClass = isExiting
        ? 'animate-slideOut'
        : 'animate-slideIn';

    return (
        <div className={`${getToastStyles()} ${animationClass} transition-all duration-300`}>
            {getIcon()}
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
                onClick={handleDismiss}
                className="shrink-0 hover:opacity-70 transition-opacity"
                aria-label="Dismiss notification"
                type="button"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

interface ToastContainerProps {
    toasts: ToastType[];
    onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
    if (toasts.length === 0) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            <div className="pointer-events-auto">
                {toasts.map((toast) => (
                    <div key={toast.id} className="mb-2">
                        <ToastItem toast={toast} onDismiss={onDismiss} />
                    </div>
                ))}
            </div>
        </div>
    );
};