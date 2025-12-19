import React, { useState } from 'react';
import { Settings, Image, FileText, Activity } from 'lucide-react';
import { Card } from '@/components/common/Card';
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center mb-2">
                    <Settings className="w-8 h-8 text-teal-600 mr-3" />
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                </div>
                <p className="text-gray-600">Manage homepage content and settings</p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                                        ${activeTab === tab.id
                                            ? 'border-teal-600 text-teal-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <Icon className={`
                                        -ml-0.5 mr-2 h-5 w-5
                                        ${activeTab === tab.id ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-500'}
                                    `} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <Card className="p-6">
                {activeTab === 'carousel' && <CarouselManager />}
                {activeTab === 'content' && <ContentEditor />}
                {activeTab === 'activity' && <ActivityLogViewer />}
            </Card>
        </div>
    );
};