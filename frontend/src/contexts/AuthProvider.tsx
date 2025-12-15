import React, { useState, useCallback, useMemo, ReactNode } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';
import { LoginDto, RegisterDto, User } from '@/types/user.types';
import { authApi } from '@/api/auth.api';
import { userApi } from '@/api/user.api';
import { useToast } from '@/hooks/useToast';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { showToast } = useToast();

    // Initialize state from localStorage during first render
    const [state, setState] = useState<{
        user: User | null;
        token: string | null;
        isLoading: boolean;
    }>(() => {
        const storedToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        return {
            user: storedToken && storedUser ? JSON.parse(storedUser) : null,
            token: storedToken || null,
            isLoading: false,
        };
    });

    const login = useCallback(async (data: LoginDto): Promise<void> => {
        const response = await authApi.login(data);
        setState({
            user: response.user,
            token: response.token,
            isLoading: false,
        });
        localStorage.setItem('accessToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        showToast('Login successful! Welcome back.', 'success', 3000);
    }, [showToast]);

    const register = useCallback(async (data: RegisterDto): Promise<void> => {
        const response = await authApi.register(data);
        setState({
            user: response.user,
            token: response.token,
            isLoading: false,
        });
        localStorage.setItem('accessToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        showToast('Registration successful! Welcome to MoodRobe.', 'success', 3000);
    }, [showToast]);

    const logout = useCallback((): void => {
        setState({
            user: null,
            token: null,
            isLoading: false,
        });
        authApi.logout();
        showToast('You have been logged out successfully.', 'info', 3000);
    }, [showToast]);

    const refreshUser = useCallback(async (): Promise<void> => {
        if (state.token) {
            const updatedUser = await userApi.getProfile();
            setState((prev) => ({
                ...prev,
                user: updatedUser,
            }));
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    }, [state.token]);

    const contextValue = useMemo<AuthContextType>(
        () => ({
            user: state.user,
            token: state.token,
            isLoading: state.isLoading,
            isAuthenticated: !!state.user && !!state.token,
            login,
            register,
            logout,
            refreshUser,
        }),
        [state, login, register, logout, refreshUser]
    );

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};