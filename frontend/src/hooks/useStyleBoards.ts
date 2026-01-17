import { useState, useCallback } from 'react';
import { styleBoardApi } from '@/api/styleboard.api';
import { StyleBoard, CreateStyleBoardDto, UpdateStyleBoardDto, AddStyleBoardItemDto } from '@/types/styleboard.types';
import { useToast } from './useToast';

export const useStyleBoards = () => {
    const [styleBoards, setStyleBoards] = useState<StyleBoard[]>([]);
    const [currentBoard, setCurrentBoard] = useState<StyleBoard | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const fetchStyleBoards = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await styleBoardApi.getUserStyleBoards();
            setStyleBoards(data);
        } catch (error) {
            console.error('Failed to fetch style boards:', error);
            showToast('Failed to load style boards', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    const fetchStyleBoardById = useCallback(async (id: string) => {
        try {
            setIsLoading(true);
            const data = await styleBoardApi.getStyleBoardById(id);
            setCurrentBoard(data);
            return data;
        } catch (error) {
            console.error('Failed to fetch style board:', error);
            showToast('Failed to load style board', 'error');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    const createStyleBoard = useCallback(async (data: CreateStyleBoardDto) => {
        try {
            const newBoard = await styleBoardApi.createStyleBoard(data);
            setStyleBoards(prev => [newBoard, ...prev]);
            showToast('Style board created successfully', 'success');
            return newBoard;
        } catch (error) {
            console.error('Failed to create style board:', error);
            showToast('Failed to create style board', 'error');
            throw error;
        }
    }, [showToast]);

    const updateStyleBoard = useCallback(async (id: string, data: UpdateStyleBoardDto) => {
        try {
            const updated = await styleBoardApi.updateStyleBoard(id, data);
            setStyleBoards(prev => prev.map(board => board.id === id ? updated : board));
            if (currentBoard?.id === id) {
                setCurrentBoard(updated);
            }
            showToast('Style board updated successfully', 'success');
            return updated;
        } catch (error) {
            console.error('Failed to update style board:', error);
            showToast('Failed to update style board', 'error');
            throw error;
        }
    }, [showToast, currentBoard]);

    const deleteStyleBoard = useCallback(async (id: string) => {
        try {
            await styleBoardApi.deleteStyleBoard(id);
            setStyleBoards(prev => prev.filter(board => board.id !== id));
            if (currentBoard?.id === id) {
                setCurrentBoard(null);
            }
            showToast('Style board deleted successfully', 'success');
        } catch (error) {
            console.error('Failed to delete style board:', error);
            showToast('Failed to delete style board', 'error');
            throw error;
        }
    }, [showToast, currentBoard]);

    const addItem = useCallback(async (boardId: string, data: AddStyleBoardItemDto) => {
        try {
            await styleBoardApi.addItem(boardId, data);
            showToast('Item added to style board', 'success');
            // Refresh board if currently loaded
            if (currentBoard?.id === boardId) {
                await fetchStyleBoardById(boardId);
            }
        } catch (error) {
            console.error('Failed to add item:', error);
            throw error;
        }
    }, [showToast, currentBoard, fetchStyleBoardById]);

    const removeItem = useCallback(async (boardId: string, productId: string) => {
        try {
            await styleBoardApi.removeItem(boardId, productId);
            showToast('Item removed from style board', 'success');
            // Update current board if loaded
            if (currentBoard?.id === boardId) {
                setCurrentBoard(prev =>
                    prev ? {
                        ...prev,
                        items: prev.items.filter(item => item.productId !== productId)
                    } : null
                );
            }
        } catch (error) {
            console.error('Failed to remove item:', error);
            throw error;
        }
    }, [showToast, currentBoard]);

    return {
        styleBoards,
        currentBoard,
        isLoading,
        fetchStyleBoards,
        fetchStyleBoardById,
        createStyleBoard,
        updateStyleBoard,
        deleteStyleBoard,
        addItem,
        removeItem,
    };
};