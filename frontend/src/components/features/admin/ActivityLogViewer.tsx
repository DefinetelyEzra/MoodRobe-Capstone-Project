import React, { useEffect, useCallback } from 'react';
import { Clock, User, FileText } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { adminApi } from '@/api/admin.api';

export const ActivityLogViewer: React.FC = () => {
    const { showToast } = useToast();
    const { data: logs, isLoading, execute: fetchLogs } = useApi(() => adminApi.getActivityLog(50));

    const loadLogs = useCallback(async () => {
        try {
            await fetchLogs();
        } catch (err) {
            console.error('Failed to load activity log:', err);
            showToast('Failed to load activity log', 'error');
        }
    }, [fetchLogs, showToast]);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'create':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'update':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'delete':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-canvas text-text-secondary border-border';
        }
    };

    const getResourceIcon = (resourceType: string) => {
        switch (resourceType) {
            case 'carousel':
                return '🖼️';
            case 'content':
                return '📝';
            default:
                return '📄';
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                <p className="mt-2 text-text-secondary">Loading activity log...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-2">Activity Log</h2>
                <p className="text-sm text-text-secondary">Recent admin actions and changes</p>
            </div>

            {!logs || logs.length === 0 ? (
                <div className="text-center py-16 bg-canvas border border-border rounded-xl">
                    <FileText className="w-12 h-12 text-accent mx-auto mb-4" />
                    <p className="text-text-secondary text-lg">No activity logged yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {logs.map((log) => (
                        <div
                            key={log.id}
                            className="bg-surface border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    <div className="text-3xl mt-1">
                                        {getResourceIcon(log.resourceType)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <span
                                                className={`px-3 py-1 text-xs font-medium rounded-full border ${getActionColor(
                                                    log.action
                                                )}`}
                                            >
                                                {log.action.toUpperCase()}
                                            </span>
                                            <span className="text-base font-medium text-text-primary">
                                                {log.resourceType}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-text-secondary space-x-6">
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 mr-2 text-accent" />
                                                {log.adminEmail}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-2 text-accent" />
                                                {formatDate(log.createdAt)}
                                            </div>
                                        </div>
                                        {Object.keys(log.details).length > 0 && (
                                            <details className="mt-4">
                                                <summary className="text-sm text-text-secondary cursor-pointer hover:text-accent transition-colors">
                                                    View details
                                                </summary>
                                                <pre className="mt-3 text-xs bg-canvas p-4 rounded-lg border border-border overflow-x-auto">
                                                    {JSON.stringify(log.details, null, 2)}
                                                </pre>
                                            </details>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};