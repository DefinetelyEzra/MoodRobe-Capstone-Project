import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { adminApi } from '@/api/admin.api';
import { ContentSectionKey } from '@/types/admin.types';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

const sectionLabels: Record<ContentSectionKey, string> = {
    hero_tagline: 'Hero Tagline',
    merchant_cta_title: 'Merchant CTA Title',
    merchant_cta_subtitle: 'Merchant CTA Subtitle',
    style_quiz_title: 'Style Quiz Title',
    style_quiz_subtitle: 'Style Quiz Subtitle'
};

export const ContentEditor: React.FC = () => {
    const { showToast } = useToast();
    const [editedContents, setEditedContents] = useState<Record<string, string>>({});

    const { data, isLoading, execute: fetchContent } = useApi(() => adminApi.getAllContent());

    // Use data directly instead of storing in state
    const contents = useMemo(() => data || [], [data]);

    // Initialize edited contents when data changes
    const initialEdits = useMemo(() => {
        const edits: Record<string, string> = {};
        contents.forEach((content) => {
            edits[content.sectionKey] = content.content;
        });
        return edits;
    }, [contents]);

    const loadContent = useCallback(async () => {
        try {
            await fetchContent();
        } catch (err) {
            console.error('Failed to load content:', err);
            showToast('Failed to load content', 'error');
        }
    }, [fetchContent, showToast]);

    useEffect(() => {
        loadContent();
    }, [loadContent]);

    // Update editedContents when initialEdits changes
    useEffect(() => {
        setEditedContents(initialEdits);
    }, [initialEdits]);

    const handleContentChange = (sectionKey: string, value: string) => {
        setEditedContents((prev) => ({
            ...prev,
            [sectionKey]: value
        }));
    };

    const handleSave = async (sectionKey: string) => {
        const content = contents.find((c) => c.sectionKey === sectionKey);
        if (!content) return;

        const newContent = editedContents[sectionKey];
        if (newContent === content.content) {
            showToast('No changes to save', 'warning');
            return;
        }

        try {
            await adminApi.updateContent(sectionKey, {
                content: newContent,
                metadata: content.metadata
            });
            showToast('Content updated successfully', 'success');
            loadContent();
        } catch (err) {
            console.error('Failed to update content:', err);
            showToast('Failed to update content', 'error');
        }
    };

    const handleReset = (sectionKey: string) => {
        const content = contents.find((c) => c.sectionKey === sectionKey);
        if (content) {
            setEditedContents((prev) => ({
                ...prev,
                [sectionKey]: content.content
            }));
            showToast('Changes reset', 'info');
        }
    };

    const hasChanges = (sectionKey: string): boolean => {
        const content = contents.find((c) => c.sectionKey === sectionKey);
        return content ? editedContents[sectionKey] !== content.content : false;
    };

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <p className="mt-2 text-gray-600">Loading content...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Homepage Content Editor
                </h2>
                <p className="text-sm text-gray-600">
                    Edit text content that appears on the homepage
                </p>
            </div>

            <div className="space-y-6">
                {contents.map((content) => (
                    <div
                        key={content.id}
                        className="bg-white border border-gray-200 rounded-lg p-6"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    {sectionLabels[content.sectionKey as ContentSectionKey] ||
                                        content.sectionKey}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    Section: {content.sectionKey} | Type: {content.contentType}
                                </p>
                            </div>
                            {hasChanges(content.sectionKey) && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    Unsaved changes
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            {content.contentType === 'text' ? (
                                <Input
                                    value={editedContents[content.sectionKey] || ''}
                                    onChange={(e) =>
                                        handleContentChange(content.sectionKey, e.target.value)
                                    }
                                    placeholder="Enter content..."
                                    className="w-full"
                                />
                            ) : (
                                <textarea
                                    value={editedContents[content.sectionKey] || ''}
                                    onChange={(e) =>
                                        handleContentChange(content.sectionKey, e.target.value)
                                    }
                                    placeholder="Enter content..."
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            )}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="secondary"
                                onClick={() => handleReset(content.sectionKey)}
                                disabled={!hasChanges(content.sectionKey)}
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Reset
                            </Button>
                            <Button
                                onClick={() => handleSave(content.sectionKey)}
                                disabled={!hasChanges(content.sectionKey)}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};