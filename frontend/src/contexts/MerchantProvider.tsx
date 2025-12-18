import React, { useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { MerchantContext, MerchantContextType } from './MerchantContext';
import { Merchant, MerchantStaff } from '@/types/merchant.types';
import { merchantApi } from '@/api/merchant.api';
import { useAuth } from '@/hooks/useAuth';

export const MerchantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [currentMerchant, setCurrentMerchant] = useState<Merchant | null>(null);
    const [staff, setStaff] = useState<MerchantStaff[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshMerchants = useCallback(async (): Promise<void> => {
        if (!user) return;
        
        setIsLoading(true);
        try {
            const data = await merchantApi.getUserMerchants();
            setMerchants(data);
            
            // Auto-select first merchant if none selected
            if (!currentMerchant && data.length > 0) {
                setCurrentMerchant(data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch merchants:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user, currentMerchant]);

    const refreshStaff = useCallback(async (): Promise<void> => {
        if (!currentMerchant) return;

        setIsLoading(true);
        try {
            const data = await merchantApi.getStaff(currentMerchant.id);
            setStaff(data);
        } catch (error) {
            console.error('Failed to fetch staff:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentMerchant]);

    // Load user's merchants on mount
    useEffect(() => {
        if (user) {
            refreshMerchants().catch(console.error);
        }
    }, [user, refreshMerchants]);

    // Load staff when merchant changes
    useEffect(() => {
        if (currentMerchant) {
            refreshStaff().catch(console.error);
        } else {
            setStaff([]);
        }
    }, [currentMerchant, refreshStaff]);

    const currentUserStaff = useMemo(() => {
        if (!user || !currentMerchant) return null;
        return staff.find(s => s.userId === user.id) || null;
    }, [staff, user, currentMerchant]);

    const hasPermission = useCallback((permission: keyof MerchantStaff['permissions']): boolean => {
        if (!currentUserStaff) return false;
        return currentUserStaff.permissions[permission];
    }, [currentUserStaff]);

    const isOwner = useCallback((): boolean => {
        if (!currentUserStaff) return false;
        return currentUserStaff.role === 'owner';
    }, [currentUserStaff]);

    const contextValue = useMemo<MerchantContextType>(
        () => ({
            merchants,
            currentMerchant,
            staff,
            currentUserStaff,
            isLoading,
            setCurrentMerchant,
            refreshMerchants,
            refreshStaff,
            hasPermission,
            isOwner
        }),
        [
            merchants,
            currentMerchant,
            staff,
            currentUserStaff,
            isLoading,
            refreshMerchants,
            refreshStaff,
            hasPermission,
            isOwner
        ]
    );

    return (
        <MerchantContext.Provider value={contextValue}>
            {children}
        </MerchantContext.Provider>
    );
};