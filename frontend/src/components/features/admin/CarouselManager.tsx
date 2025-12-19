import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Plus, Edit2, Trash2, Save, X, MoveUp, MoveDown } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { adminApi } from '@/api/admin.api';
import { CarouselItem, CreateCarouselDto } from '@/types/admin.types';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';

export const CarouselManager: React.FC = () => {
    const { showToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CarouselItem | null>(null);
    const [formData, setFormData] = useState<CreateCarouselDto>({
        imageUrl: '',
        title: '',
        subtitle: '',
        linkUrl: '',
        displayOrder: 0
    });

    const { data, isLoading, execute: fetchCarousel } = useApi(() => adminApi.getAllCarousel());

    const { execute: createCarousel, isLoading: isCreating } = useApi(
        (data: CreateCarouselDto) => adminApi.createCarousel(data)
    );

    const { execute: deleteCarousel } = useApi((id: string) => adminApi.deleteCarousel(id));

    // Use data directly instead of storing in state
    const items = useMemo(() => data || [], [data]);

    const loadCarousel = useCallback(async () => {
        try {
            await fetchCarousel();
        } catch (err) {
            console.error('Failed to load carousel:', err);
            showToast('Failed to load carousel', 'error');
        }
    }, [fetchCarousel, showToast]);

    useEffect(() => {
        loadCarousel();
    }, [loadCarousel]);

    const handleOpenModal = (item?: CarouselItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                imageUrl: item.imageUrl,
                title: item.title,
                subtitle: item.subtitle,
                linkUrl: item.linkUrl,
                displayOrder: item.displayOrder
            });
        } else {
            setEditingItem(null);
            setFormData({
                imageUrl: '',
                title: '',
                subtitle: '',
                linkUrl: '',
                displayOrder: items.length
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({
            imageUrl: '',
            title: '',
            subtitle: '',
            linkUrl: '',
            displayOrder: 0
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingItem) {
                await adminApi.updateCarousel(editingItem.id, formData);
                showToast('Carousel item updated successfully', 'success');
            } else {
                await createCarousel(formData);
                showToast('Carousel item created successfully', 'success');
            }
            handleCloseModal();
            loadCarousel();
        } catch (err) {
            console.error('Failed to save carousel item:', err);
            showToast(
                `Failed to ${editingItem ? 'update' : 'create'} carousel item`,
                'error'
            );
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this carousel item?')) return;

        try {
            await deleteCarousel(id);
            showToast('Carousel item deleted successfully', 'success');
            loadCarousel();
        } catch (err) {
            console.error('Failed to delete carousel item:', err);
            showToast('Failed to delete carousel item', 'error');
        }
    };

    const handleToggleActive = async (item: CarouselItem) => {
        try {
            await adminApi.updateCarousel(item.id, { isActive: !item.isActive });
            showToast(
                `Carousel item ${item.isActive ? 'deactivated' : 'activated'}`,
                'success'
            );
            loadCarousel();
        } catch (err) {
            console.error('Failed to update carousel item:', err);
            showToast('Failed to update carousel item', 'error');
        }
    };

    const handleReorder = async (item: CarouselItem, direction: 'up' | 'down') => {
        const newOrder = direction === 'up' ? item.displayOrder - 1 : item.displayOrder + 1;
        try {
            await adminApi.updateCarousel(item.id, { displayOrder: newOrder });
            loadCarousel();
        } catch (err) {
            console.error('Failed to reorder item:', err);
            showToast('Failed to reorder item', 'error');
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <p className="mt-2 text-gray-600">Loading carousel...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Hero Carousel Images</h2>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Image
                </Button>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No carousel items yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <img
                                src={item.imageUrl}
                                alt={item.title || 'Carousel image'}
                                className="w-32 h-20 object-cover rounded mr-4"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                    {item.title || 'Untitled'}
                                </h3>
                                {item.subtitle && (
                                    <p className="text-sm text-gray-600">{item.subtitle}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Order: {item.displayOrder} | Status:{' '}
                                    <span
                                        className={
                                            item.isActive ? 'text-green-600' : 'text-red-600'
                                        }
                                    >
                                        {item.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleReorder(item, 'up')}
                                    disabled={item.displayOrder === 0}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                                >
                                    <MoveUp className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleReorder(item, 'down')}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    <MoveDown className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleToggleActive(item)}
                                    className={`px-3 py-1 text-sm rounded ${item.isActive
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {item.isActive ? 'Active' : 'Inactive'}
                                </button>
                                <button
                                    onClick={() => handleOpenModal(item)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingItem ? 'Edit Carousel Item' : 'Add Carousel Item'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Image URL"
                        value={formData.imageUrl}
                        onChange={(e) =>
                            setFormData({ ...formData, imageUrl: e.target.value })
                        }
                        required
                        placeholder="https://example.com/image.jpg"
                    />
                    <Input
                        label="Title (Optional)"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Shop By Vibe"
                    />
                    <Input
                        label="Subtitle (Optional)"
                        value={formData.subtitle}
                        onChange={(e) =>
                            setFormData({ ...formData, subtitle: e.target.value })
                        }
                        placeholder="Discover Your Perfect Style"
                    />
                    <Input
                        label="Link URL (Optional)"
                        value={formData.linkUrl}
                        onChange={(e) =>
                            setFormData({ ...formData, linkUrl: e.target.value })
                        }
                        placeholder="https://example.com/page"
                    />
                    <Input
                        label="Display Order"
                        type="number"
                        value={formData.displayOrder}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                displayOrder: Number.parseInt(e.target.value, 10)
                            })
                        }
                        min={0}
                    />

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isCreating}>
                            <Save className="w-4 h-4 mr-2" />
                            {editingItem ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};