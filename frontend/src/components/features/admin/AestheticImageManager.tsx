import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Save, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { adminApi } from '@/api/admin.api';
import { aestheticApi } from '@/api/aesthetic.api';
import { Aesthetic } from '@/types/aesthetic.types';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export const AestheticImageManager: React.FC = () => {
    const { showToast } = useToast();

    const { data: aesthetics, isLoading, execute: fetchAesthetics } = useApi(() =>
        aestheticApi.getAll()
    );

    // Derive initial images from aesthetics data
    const initialImages = useMemo(() => {
        const images: Record<string, string> = {};
        if (aesthetics && aesthetics.length > 0) {
            aesthetics.forEach((aesthetic) => {
                images[aesthetic.id] = aesthetic.imageUrl || '';
            });
        }
        return images;
    }, [aesthetics]);

    const [editedImages, setEditedImages] = useState<Record<string, string>>(initialImages);

    // Update editedImages when initialImages changes (when aesthetics are loaded)
    useEffect(() => {
        setEditedImages(initialImages);
    }, [initialImages]);

    const loadAesthetics = useCallback(async () => {
        try {
            await fetchAesthetics();
        } catch (err) {
            console.error('Failed to load aesthetics:', err);
            showToast('Failed to load aesthetics', 'error');
        }
    }, [fetchAesthetics, showToast]);

    useEffect(() => {
        loadAesthetics();
    }, [loadAesthetics]);

    const handleImageChange = (aestheticId: string, value: string) => {
        setEditedImages((prev) => ({
            ...prev,
            [aestheticId]: value
        }));
    };

    const handleSave = async (aesthetic: Aesthetic) => {
        const newImageUrl = editedImages[aesthetic.id];
        if (newImageUrl === aesthetic.imageUrl) {
            showToast('No changes to save', 'warning');
            return;
        }

        try {
            await adminApi.updateAestheticImage(aesthetic.id, newImageUrl);
            showToast(`Image URL updated for ${aesthetic.name}`, 'success');
            loadAesthetics();
        } catch (err) {
            console.error('Failed to update aesthetic image:', err);
            showToast('Failed to update aesthetic image', 'error');
        }
    };

    const handleReset = (aesthetic: Aesthetic) => {
        setEditedImages((prev) => ({
            ...prev,
            [aesthetic.id]: aesthetic.imageUrl || ''
        }));
        showToast('Changes reset', 'info');
    };

    const hasChanges = (aesthetic: Aesthetic): boolean => {
        return editedImages[aesthetic.id] !== aesthetic.imageUrl;
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                <p className="mt-2 text-text-secondary">Loading aesthetics...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Aesthetic Image Manager
                </h2>
                <p className="text-sm text-text-secondary">
                    Manage banner images for each aesthetic
                </p>
            </div>

            {!aesthetics || aesthetics.length === 0 ? (
                <div className="text-center py-16 bg-canvas border border-border rounded-xl">
                    <ImageIcon className="w-12 h-12 text-accent mx-auto mb-4" />
                    <p className="text-text-secondary text-lg">No aesthetics available</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {aesthetics.map((aesthetic) => (
                        <div
                            key={aesthetic.id}
                            className="bg-surface border border-border rounded-xl p-6 shadow-sm"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-start space-x-4">
                                    {editedImages[aesthetic.id] && (
                                        <img
                                            src={editedImages[aesthetic.id]}
                                            alt={aesthetic.name}
                                            className="w-32 h-20 object-cover rounded-lg border border-border"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/150x100?text=Invalid+URL';
                                            }}
                                        />
                                    )}
                                    <div>
                                        <h3 className="text-lg font-semibold text-text-primary">
                                            {aesthetic.name}
                                        </h3>
                                        <p className="text-sm text-text-secondary mt-1">
                                            {aesthetic.description}
                                        </p>
                                    </div>
                                </div>
                                {hasChanges(aesthetic) && (
                                    <span className="text-xs bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200">
                                        Unsaved changes
                                    </span>
                                )}
                            </div>

                            <div className="mb-6">
                                <Input
                                    label="Image URL"
                                    value={editedImages[aesthetic.id] || ''}
                                    onChange={(e) =>
                                        handleImageChange(aesthetic.id, e.target.value)
                                    }
                                    placeholder="https://example.com/aesthetic-image.jpg"
                                    className="w-full"
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button
                                    onClick={() => handleReset(aesthetic)}
                                    disabled={!hasChanges(aesthetic)}
                                    className="px-6 py-3 border border-border hover:bg-canvas text-text-primary! rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Reset
                                </Button>
                                <Button
                                    onClick={() => handleSave(aesthetic)}
                                    disabled={!hasChanges(aesthetic)}
                                    className="px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors disabled:opacity-50 shadow-md"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};