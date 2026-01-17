import React, { useEffect, useState } from 'react';
import { FolderOpen, Plus, Trash2, Eye } from 'lucide-react';
import { useCollections } from '@/hooks/useCollections';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { useNavigate } from 'react-router-dom';

export const CollectionsSection: React.FC = () => {
    const { collections, isLoading, fetchCollections, createCollection, deleteCollection } = useCollections();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', isPublic: false });
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCollections();
    }, [fetchCollections]);

    const handleCreate = async () => {
        if (!formData.name.trim()) return;

        setIsCreating(true);
        try {
            await createCollection(formData);
            setShowCreateModal(false);
            setFormData({ name: '', description: '', isPublic: false });
        } catch (error) {
            console.error('Failed to create collection:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (globalThis.confirm('Are you sure you want to delete this collection?')) {
            try {
                await deleteCollection(id);
            } catch (error) {
                console.error('Failed to delete collection:', error);
            }
        }
    };

    const handleCollectionClick = (id: string) => {
        navigate(`/collections/${id}`);
    };

    const handleCollectionKeyDown = (e: React.KeyboardEvent, id: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate(`/collections/${id}`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner text="Loading collections..." />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">My Collections</h2>
                    <p className="text-text-secondary mt-1">{collections.length} collections</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center px-4 py-2 bg-accent hover:bg-accent-dark text-surface rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Collection
                </button>
            </div>

            {collections.length === 0 ? (
                <div className="text-center py-12 bg-surface rounded-xl border border-border">
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FolderOpen className="w-10 h-10 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">No collections yet</h3>
                    <p className="text-text-secondary mb-6">Create collections to organize your favorite items!</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-medium transition-colors"
                    >
                        Create Your First Collection
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((collection) => (
                        <div
                            key={collection.id}
                            role="button"
                            tabIndex={0}
                            className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                            onClick={() => handleCollectionClick(collection.id)}
                            onKeyDown={(e) => handleCollectionKeyDown(e, collection.id)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center">
                                    <FolderOpen className="w-7 h-7 text-accent" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/collections/${collection.id}`);
                                        }}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-canvas hover:border-accent hover:text-accent transition-all opacity-0 group-hover:opacity-100"
                                        title="View collection"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(collection.id, e)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-accent/10 hover:border-accent hover:text-accent transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete collection"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-bold text-text-primary text-lg mb-2 line-clamp-1">
                                {collection.name}
                            </h3>

                            {collection.description && (
                                <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                                    {collection.description}
                                </p>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                <span className="text-sm text-text-secondary">
                                    {collection.itemCount} {collection.itemCount === 1 ? 'item' : 'items'}
                                </span>
                                {collection.isPublic && (
                                    <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                                        Public
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Collection Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Collection"
            >
                <div className="space-y-4">
                    <Input
                        label="Collection Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter collection name"
                    />

                    <div>
                        <label htmlFor="collection-description" className="block text-sm font-medium text-text-primary mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            id="collection-description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe your collection..."
                            className="w-full px-4 py-3 rounded-lg border border-border bg-canvas text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                            rows={3}
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={formData.isPublic}
                            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                            className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
                        />
                        <label htmlFor="isPublic" className="ml-2 text-sm text-text-primary">
                            Make this collection public
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="flex-1 px-4 py-2 border border-border rounded-lg text-text-primary hover:bg-canvas transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={!formData.name.trim() || isCreating}
                            className="flex-1 px-4 py-2 bg-accent hover:bg-accent-dark text-surface rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCreating ? 'Creating...' : 'Create Collection'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};