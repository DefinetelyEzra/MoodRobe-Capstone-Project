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
                return 'bg-green-100 text-green-800';
            case 'update':
                return 'bg-blue-100 text-blue-800';
            case 'delete':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
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
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <p className="mt-2 text-gray-600">Loading activity log...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Activity Log</h2>
                <p className="text-sm text-gray-600">Recent admin actions and changes</p>
            </div>

            {!logs || logs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No activity logged yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {logs.map((log) => (
                        <div
                            key={log.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                    <div className="text-2xl mt-1">
                                        {getResourceIcon(log.resourceType)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span
                                                className={`px-2 py-0.5 text-xs font-medium rounded ${getActionColor(
                                                    log.action
                                                )}`}
                                            >
                                                {log.action.toUpperCase()}
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {log.resourceType}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 mr-1" />
                                                {log.adminEmail}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {formatDate(log.createdAt)}
                                            </div>
                                        </div>
                                        {Object.keys(log.details).length > 0 && (
                                            <details className="mt-2">
                                                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                                                    View details
                                                </summary>
                                                <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
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