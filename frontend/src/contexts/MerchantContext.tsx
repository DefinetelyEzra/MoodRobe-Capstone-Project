import { createContext } from 'react';
import { Merchant, MerchantStaff } from '@/types/merchant.types';

export interface MerchantContextType {
    merchants: Merchant[];
    currentMerchant: Merchant | null;
    staff: MerchantStaff[];
    currentUserStaff: MerchantStaff | null;
    isLoading: boolean;
    setCurrentMerchant: (merchant: Merchant | null) => void;
    refreshMerchants: () => Promise<void>;
    refreshStaff: () => Promise<void>;
    hasPermission: (permission: keyof MerchantStaff['permissions']) => boolean;
    isOwner: () => boolean;
}

export const MerchantContext = createContext<MerchantContextType | undefined>(undefined);