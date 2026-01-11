import { useState, useCallback } from 'react';
import { outfitApi } from '@/api/outfit.api';
import { useToast } from './useToast';
import {
    CreateOutfitDto,
    UpdateOutfitDto,
    OutfitResponseDto,
    OutfitItems,
    OutfitType
} from '@/types/outfit.types';

export const useOutfit = () => {
    const [outfits, setOutfits] = useState<OutfitResponseDto[]>([]);
    const [currentOutfit, setCurrentOutfit] = useState<OutfitResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const loadUserOutfits = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await outfitApi.getUserOutfits();
            setOutfits(data);
        } catch (error) {
            console.error('Failed to load outfits:', error);
            showToast('Failed to load outfits', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    const loadOutfitById = useCallback(async (id: string) => {
        try {
            setIsLoading(true);
            const data = await outfitApi.getById(id);
            setCurrentOutfit(data);
            return data;
        } catch (error) {
            console.error('Failed to load outfit:', error);
            showToast('Failed to load outfit', 'error');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    const createOutfit = useCallback(async (
        name: string,
        outfitType: OutfitType,
        items: OutfitItems,
        description?: string,
        aestheticTags?: string[],
        isPublic?: boolean
    ) => {
        try {
            setIsLoading(true);
            const dto: CreateOutfitDto = {
                name,
                outfitType,
                items,
                description,
                aestheticTags,
                isPublic
            };
            const newOutfit = await outfitApi.create(dto);
            setOutfits(prev => [...prev, newOutfit]);
            showToast('Outfit saved successfully!', 'success');
            return newOutfit;
        } catch (error) {
            console.error('Failed to create outfit:', error);
            showToast('Failed to save outfit', 'error');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    const updateOutfit = useCallback(async (id: string, data: UpdateOutfitDto) => {
        try {
            setIsLoading(true);
            const updated = await outfitApi.update(id, data);
            setOutfits(prev => prev.map(o => o.id === id ? updated : o));
            if (currentOutfit?.id === id) {
                setCurrentOutfit(updated);
            }
            showToast('Outfit updated successfully!', 'success');
            return updated;
        } catch (error) {
            console.error('Failed to update outfit:', error);
            showToast('Failed to update outfit', 'error');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [currentOutfit, showToast]);

    const deleteOutfit = useCallback(async (id: string) => {
        try {
            setIsLoading(true);
            await outfitApi.delete(id);
            setOutfits(prev => prev.filter(o => o.id !== id));
            if (currentOutfit?.id === id) {
                setCurrentOutfit(null);
            }
            showToast('Outfit deleted successfully!', 'success');
        } catch (error) {
            console.error('Failed to delete outfit:', error);
            showToast('Failed to delete outfit', 'error');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [currentOutfit, showToast]);

    return {
        outfits,
        currentOutfit,
        isLoading,
        loadUserOutfits,
        loadOutfitById,
        createOutfit,
        updateOutfit,
        deleteOutfit,
        setCurrentOutfit
    };
};