import React, { useState, useCallback, useMemo, ReactNode, useRef } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';
import { LoginDto, RegisterDto, User } from '@/types/user.types';
import { authApi } from '@/api/auth.api';
import { userApi } from '@/api/user.api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Use ref to track if we're in the middle of auth operations
    const authInProgressRef = useRef(false);

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
        // Prevent multiple simultaneous login attempts
        if (authInProgressRef.current) {
            throw new Error('Authentication already in progress');
        }

        authInProgressRef.current = true;

        try {
            // Don't update loading state to prevent re-renders
            const response = await authApi.login(data);

            // Store in localStorage first
            localStorage.setItem('accessToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Then update state in one atomic operation
            setState({
                user: response.user,
                token: response.token,
                isLoading: false,
            });
        } catch (error) {
            // Don't update state on error to prevent re-renders
            authInProgressRef.current = false;
            throw error; // Re-throw for component to handle
        } finally {
            authInProgressRef.current = false;
        }
    }, []);

    const register = useCallback(async (data: RegisterDto): Promise<void> => {
        if (authInProgressRef.current) {
            throw new Error('Authentication already in progress');
        }

        authInProgressRef.current = true;

        try {
            const response = await authApi.register(data);

            // Store in localStorage first
            localStorage.setItem('accessToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Then update state
            setState({
                user: response.user,
                token: response.token,
                isLoading: false,
            });
        } catch (error) {
            authInProgressRef.current = false;
            throw error;
        } finally {
            authInProgressRef.current = false;
        }
    }, []);

    const logout = useCallback((): void => {
        authApi.logout();
        setState({
            user: null,
            token: null,
            isLoading: false,
        });
    }, []);

    const refreshUser = useCallback(async (): Promise<void> => {
        if (state.token) {
            try {
                const updatedUser = await userApi.getProfile();
                setState((prev) => ({
                    ...prev,
                    user: updatedUser,
                }));
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } catch (error) {
                console.error('Failed to refresh user:', error);
            }
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