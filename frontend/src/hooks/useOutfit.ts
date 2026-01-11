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

interface AxiosErrorResponse {
    response?: {
        data?: {
            message?: string | string[];
            error?: string;
        };
    };
}

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

    const buildCreateOutfitDto = (
        name: string,
        outfitType: OutfitType,
        items: OutfitItems,
        description?: string,
        aestheticTags?: string[],
        isPublic?: boolean
    ): CreateOutfitDto => {
        const dto: CreateOutfitDto = {
            name: name.trim(),
            outfitType,
            items
        };

        if (description?.trim()) {
            dto.description = description.trim();
        }

        if (aestheticTags?.length) {
            dto.aestheticTags = aestheticTags;
        }

        if (typeof isPublic === 'boolean') {
            dto.isPublic = isPublic;
        }

        return dto;
    };

    const extractErrorMessage = (error: unknown): string => {
        if (!error || typeof error !== 'object' || !('response' in error)) {
            return 'Failed to save outfit';
        }

        const axiosError = error as AxiosErrorResponse;
        const responseData = axiosError.response?.data;

        if (responseData?.message) {
            return Array.isArray(responseData.message)
                ? responseData.message.join(', ')
                : responseData.message;
        }

        return responseData?.error ?? 'Failed to save outfit';
    };

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

            const dto = buildCreateOutfitDto(name, outfitType, items, description, aestheticTags, isPublic);
            console.log('Creating outfit with DTO:', dto);

            const newOutfit = await outfitApi.create(dto);
            setOutfits(prev => [...prev, newOutfit]);
            showToast('Outfit saved successfully!', 'success');
            return newOutfit;
        } catch (error) {
            console.error('Failed to create outfit:', error);
            const errorMessage = extractErrorMessage(error);
            showToast(errorMessage, 'error');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    const buildUpdateOutfitDto = (data: UpdateOutfitDto): UpdateOutfitDto => {
        const cleanData: UpdateOutfitDto = {};

        if (data.name?.trim()) {
            cleanData.name = data.name.trim();
        }

        if (data.description !== undefined) {
            cleanData.description = data.description.trim() || undefined;
        }

        if (data.outfitType) {
            cleanData.outfitType = data.outfitType;
        }

        if (data.items) {
            cleanData.items = data.items;
        }

        if (data.aestheticTags?.length) {
            cleanData.aestheticTags = data.aestheticTags;
        }

        if (typeof data.isPublic === 'boolean') {
            cleanData.isPublic = data.isPublic;
        }

        return cleanData;
    };

    const updateOutfit = useCallback(async (id: string, data: UpdateOutfitDto) => {
        try {
            setIsLoading(true);

            const cleanData = buildUpdateOutfitDto(data);
            console.log('Updating outfit with data:', cleanData);

            const updated = await outfitApi.update(id, cleanData);

            setOutfits(prev => prev.map(o => o.id === id ? updated : o));
            if (currentOutfit?.id === id) {
                setCurrentOutfit(updated);
            }

            showToast('Outfit updated successfully!', 'success');
            return updated;
        } catch (error) {
            console.error('Failed to update outfit:', error);
            const errorMessage = extractErrorMessage(error);
            showToast(errorMessage, 'error');
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