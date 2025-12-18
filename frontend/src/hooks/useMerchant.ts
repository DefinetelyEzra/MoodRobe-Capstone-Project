import { useContext } from 'react';
import { MerchantContext } from '@/contexts/MerchantContext';

export const useMerchant = () => {
    const context = useContext(MerchantContext);
    if (!context) {
        throw new Error('useMerchant must be used within MerchantProvider');
    }
    return context;
};