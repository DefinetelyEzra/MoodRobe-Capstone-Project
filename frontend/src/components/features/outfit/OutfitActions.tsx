import React, { useState } from 'react';
import { Save, ShoppingCart, Share2, Trash2 } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { useAesthetic } from '@/hooks/useAesthetic';

interface OutfitActionsProps {
    hasItems: boolean;
    onSave: (name: string, description: string, isPublic: boolean) => Promise<void>;
    onAddToCart: () => void;
    onClear: () => void;
    isEditing?: boolean;
    currentName?: string;
    currentDescription?: string;
}

export const OutfitActions: React.FC<OutfitActionsProps> = ({
    hasItems,
    onSave,
    onAddToCart,
    onClear,
    isEditing = false,
    currentName = '',
    currentDescription = ''
}) => {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [outfitName, setOutfitName] = useState(currentName);
    const [description, setDescription] = useState(currentDescription);
    const [isPublic, setIsPublic] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { selectedAesthetic } = useAesthetic();

    const handleSave = async () => {
        const trimmedName = outfitName.trim();

        if (!trimmedName) {
            alert('Please enter an outfit name');
            return;
        }

        try {
            setIsSaving(true);
            console.log('OutfitActions - Saving with:', {
                name: trimmedName,
                description: description.trim(),
                isPublic
            });

            await onSave(trimmedName, description.trim(), isPublic);

            // Only close modal and reset on success
            setShowSaveModal(false);
            setOutfitName('');
            setDescription('');
            setIsPublic(false);
        } catch (error) {
            console.error('OutfitActions - Save error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleShare = () => {
        // Implementation of sharing functionality
        // TODO: Add actual sharing logic (generate shareable link/image)
        console.log('Share outfit functionality not implemented yet');
        alert('Sharing feature coming soon!');
    };

    const getSaveButtonText = (): string => {
        if (isSaving) return 'Saving...';
        return isEditing ? 'Update' : 'Save';
    };

    return (
        <>
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={() => setShowSaveModal(true)}
                    disabled={!hasItems}
                    className="flex-1 md:flex-none px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Save className="w-5 h-5" />
                    {isEditing ? 'Update Outfit' : 'Save Outfit'}
                </button>

                <button
                    onClick={onAddToCart}
                    disabled={!hasItems}
                    className="flex-1 md:flex-none px-6 py-3 bg-text-primary hover:bg-text-primary/90 text-surface rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                </button>

                <button
                    onClick={handleShare}
                    disabled={!hasItems}
                    className="px-6 py-3 border border-border hover:bg-canvas text-text-primary rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Share2 className="w-5 h-5" />
                    Share
                </button>

                <button
                    onClick={onClear}
                    disabled={!hasItems}
                    className="px-6 py-3 border border-red-300 hover:bg-red-50 text-red-600 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Trash2 className="w-5 h-5" />
                    Clear
                </button>
            </div>

            {/* Save Modal */}
            <Modal
                isOpen={showSaveModal}
                onClose={() => !isSaving && setShowSaveModal(false)}
                title={isEditing ? 'Update Outfit' : 'Save Outfit'}
            >
                <div className="space-y-4">
                    <Input
                        label="Outfit Name"
                        value={outfitName}
                        onChange={(e) => setOutfitName(e.target.value)}
                        placeholder="My Awesome Outfit"
                        required
                        disabled={isSaving}
                    />

                    <div>
                        <label htmlFor="outfit-description" className="block text-sm font-medium text-text-primary mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your outfit..."
                            rows={3}
                            disabled={isSaving}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    {selectedAesthetic && (
                        <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                            <p className="text-sm text-text-secondary">
                                This outfit will be tagged with <span className="font-semibold text-accent">{selectedAesthetic.name}</span> aesthetic
                            </p>
                        </div>
                    )}

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            disabled={isSaving}
                            className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent disabled:cursor-not-allowed"
                        />
                        <label htmlFor="isPublic" className="ml-2 text-sm text-text-primary">
                            Make this outfit public (others can see it)
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => setShowSaveModal(false)}
                            disabled={isSaving}
                            className="flex-1 px-4 py-2 border border-border hover:bg-canvas text-text-primary rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!outfitName.trim() || isSaving}
                            className="flex-1 px-4 py-2 bg-accent hover:bg-accent-dark text-surface rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {getSaveButtonText()}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};