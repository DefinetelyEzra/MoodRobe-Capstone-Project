import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

interface FavoriteButtonProps {
    productId: string;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
    productId,
    size = 'md',
    showLabel = false
}) => {
    const { isAuthenticated } = useAuth();
    const { addFavorite, removeFavorite, checkFavorite } = useFavorites();
    const { showToast } = useToast();
    const [favorited, setFavorited] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            const checkStatus = async () => {
                const status = await checkFavorite(productId);
                setFavorited(status);
            };
            checkStatus();
        }
    }, [productId, isAuthenticated, checkFavorite]);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            showToast('Please login to save favorites', 'error');
            return;
        }

        setIsLoading(true);
        try {
            if (favorited) {
                await removeFavorite(productId);
                setFavorited(false);
            } else {
                await addFavorite(productId);
                setFavorited(true);
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            showToast('Failed to update favorite', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const baseClasses = 'flex items-center justify-center rounded-lg border transition-all disabled:opacity-50';

    let stateClasses: string;
    if (favorited) {
        stateClasses = 'bg-accent/10 border-accent text-accent hover:bg-accent/20';
    } else if (showLabel) {
        stateClasses = 'bg-surface border-border text-text-primary hover:bg-canvas hover:border-accent';
    } else {
        stateClasses = 'bg-surface border-border text-text-secondary hover:bg-canvas hover:text-accent';
    }

    const containerClass = showLabel ? 'px-6 py-3 w-full' : sizeClasses[size];

    const iconClass = showLabel ? 'w-5 h-5' : iconSizes[size];

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`${baseClasses} ${stateClasses} ${containerClass}`}
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
            <Heart
                className={`${iconClass} transition-all ${favorited ? 'fill-current' : ''}`}
            />
            {showLabel && (
                <span className="ml-2 text-sm font-medium">
                    {favorited ? 'Saved' : 'Save'}
                </span>
            )}
        </button>
    );
};