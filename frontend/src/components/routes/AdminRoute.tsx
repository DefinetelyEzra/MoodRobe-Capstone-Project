import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AdminRouteProps {
    children: React.ReactNode;
}

const ADMIN_EMAIL = 'ezraagun@gmail.com';

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.email !== ADMIN_EMAIL) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-6">
                        You don't have permission to access this area. Admin privileges are required.
                    </p>
                    <button
                        onClick={() => globalThis.history.back()}
                        className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};