import React, { useState } from 'react';
import { Settings, Image, FileText, Activity } from 'lucide-react';
import { CarouselManager } from '@/components/features/admin/CarouselManager';
import { ContentEditor } from '@/components/features/admin/ContentEditor';
import { ActivityLogViewer } from '@/components/features/admin/ActivityLogViewer';

type TabType = 'carousel' | 'content' | 'activity';

export const AdminDashboardPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('carousel');

    const tabs = [
        { id: 'carousel' as TabType, label: 'Hero Carousel', icon: Image },
        { id: 'content' as TabType, label: 'Content Editor', icon: FileText },
        { id: 'activity' as TabType, label: 'Activity Log', icon: Activity }
    ];

    return (
        <div className="min-h-screen bg-canvas">
            {/* Header */}
            <div className="bg-linear-to-b from-accent/10 to-canvas border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center">
                        <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center">
                            <Settings className="w-8 h-8 text-accent" />
                        </div>
                        <div className="ml-4">
                            <h1 className="text-4xl font-bold text-text-primary">Admin Dashboard</h1>
                            <p className="text-text-secondary mt-2">Manage homepage content and settings</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="mb-8 border-b border-border">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                        ${activeTab === tab.id
                                            ? 'border-accent text-accent'
                                            : 'border-transparent text-text-secondary hover:text-text-primary hover:border-accent'
                                        }
                                    `}
                                >
                                    <Icon className={`
                                        -ml-0.5 mr-2 h-5 w-5
                                        ${activeTab === tab.id ? 'text-accent' : 'text-text-secondary group-hover:text-accent'}
                                    `} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden p-8">
                    {activeTab === 'carousel' && <CarouselManager />}
                    {activeTab === 'content' && <ContentEditor />}
                    {activeTab === 'activity' && <ActivityLogViewer />}
                </div>
            </div>
        </div>
    );
};