import { useState, useCallback } from 'react';
import { collectionApi } from '@/api/collection.api';
import { Collection, CollectionWithItems, CreateCollectionDto, UpdateCollectionDto } from '@/types/collection.types';
import { useToast } from './useToast';

export const useCollections = () => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [currentCollection, setCurrentCollection] = useState<CollectionWithItems | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const fetchCollections = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await collectionApi.getUserCollections();
            setCollections(data);
        } catch (error) {
            console.error('Failed to fetch collections:', error);
            showToast('Failed to load collections', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    const fetchCollectionById = useCallback(async (id: string) => {
        try {
            setIsLoading(true);
            const data = await collectionApi.getCollectionById(id);
            setCurrentCollection(data);
            return data;
        } catch (error) {
            console.error('Failed to fetch collection:', error);
            showToast('Failed to load collection', 'error');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    const createCollection = useCallback(async (data: CreateCollectionDto) => {
        try {
            const newCollection = await collectionApi.createCollection(data);
            setCollections(prev => [newCollection, ...prev]);
            showToast('Collection created successfully', 'success');
            return newCollection;
        } catch (error) {
            console.error('Failed to create collection:', error);
            showToast('Failed to create collection', 'error');
            throw error;
        }
    }, [showToast]);

    const updateCollection = useCallback(async (id: string, data: UpdateCollectionDto) => {
        try {
            const updated = await collectionApi.updateCollection(id, data);
            setCollections(prev => prev.map(col => col.id === id ? updated : col));
            showToast('Collection updated successfully', 'success');
            return updated;
        } catch (error) {
            console.error('Failed to update collection:', error);
            showToast('Failed to update collection', 'error');
            throw error;
        }
    }, [showToast]);

    const deleteCollection = useCallback(async (id: string) => {
        try {
            await collectionApi.deleteCollection(id);
            setCollections(prev => prev.filter(col => col.id !== id));
            showToast('Collection deleted successfully', 'success');
        } catch (error) {
            console.error('Failed to delete collection:', error);
            showToast('Failed to delete collection', 'error');
            throw error;
        }
    }, [showToast]);

    const addToCollection = useCallback(async (collectionId: string, productId: string) => {
        try {
            await collectionApi.addToCollection(collectionId, { productId });
            showToast('Added to collection', 'success');
            // Refresh collection if it's currently loaded
            if (currentCollection?.id === collectionId) {
                await fetchCollectionById(collectionId);
            }
        } catch (error) {
            console.error('Failed to add to collection:', error);
            throw error;
        }
    }, [showToast, currentCollection?.id, fetchCollectionById]);

    const removeFromCollection = useCallback(async (collectionId: string, productId: string) => {
        try {
            await collectionApi.removeFromCollection(collectionId, productId);
            showToast('Removed from collection', 'success');
            // Update current collection if loaded
            if (currentCollection?.id === collectionId) {
                setCurrentCollection(prev =>
                    prev ? {
                        ...prev,
                        items: prev.items.filter(item => item.productId !== productId),
                        itemCount: prev.itemCount - 1
                    } : null
                );
            }
        } catch (error) {
            console.error('Failed to remove from collection:', error);
            throw error;
        }
    }, [showToast, currentCollection?.id]);

    return {
        collections,
        currentCollection,
        isLoading,
        fetchCollections,
        fetchCollectionById,
        createCollection,
        updateCollection,
        deleteCollection,
        addToCollection,
        removeFromCollection,
    };
};