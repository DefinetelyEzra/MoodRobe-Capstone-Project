import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                <p className="mt-2 text-text-secondary">Loading content...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Homepage Content Editor
                </h2>
                <p className="text-sm text-text-secondary">
                    Edit text content that appears on the homepage
                </p>
            </div>

            <div className="space-y-8">
                {contents.map((content) => (
                    <div
                        key={content.id}
                        className="bg-surface border border-border rounded-xl p-8 shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-text-primary">
                                    {sectionLabels[content.sectionKey as ContentSectionKey] ||
                                        content.sectionKey}
                                </h3>
                                <p className="text-xs text-text-secondary mt-1">
                                    Section: {content.sectionKey} | Type: {content.contentType}
                                </p>
                            </div>
                            {hasChanges(content.sectionKey) && (
                                <span className="text-xs bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200">
                                    Unsaved changes
                                </span>
                            )}
                        </div>

                        <div className="mb-6">
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
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface text-text-primary placeholder-text-secondary"
                                />
                            )}
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                onClick={() => handleReset(content.sectionKey)}
                                disabled={!hasChanges(content.sectionKey)}
                                className="px-6 py-3 border border-border hover:bg-canvas text-text-primary! rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Reset
                            </Button>
                            <Button
                                onClick={() => handleSave(content.sectionKey)}
                                disabled={!hasChanges(content.sectionKey)}
                                className="px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors disabled:opacity-50 shadow-md"
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