import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAesthetic } from '@/hooks/useAesthetic';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { userApi } from '@/api/user.api';
import { Aesthetic } from '@/types/aesthetic.types';

export const AestheticSelectionPage: React.FC = () => {
    const { availableAesthetics, isLoading, setSelectedAesthetic } = useAesthetic();
    const { refreshUser } = useAuth();
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Use api hook for selecting aesthetic
    const {
        isLoading: isSaving,
        execute: selectAestheticApi
    } = useApi<void, string>((aestheticId) =>
        userApi.selectAesthetic(aestheticId)
    );

    const handleSelect = async (aesthetic: Aesthetic) => {
        setSelectedId(aesthetic.id);
    };

    const handleConfirm = async () => {
        if (!selectedId) return;

        try {
            await selectAestheticApi(selectedId);
            const selected = availableAesthetics.find((a) => a.id === selectedId);
            if (selected) {
                setSelectedAesthetic(selected);
            }
            await refreshUser();
            navigate('/');
        } catch (error) {
            console.error('Failed to save aesthetic:', error);
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <LoadingSpinner text="Loading aesthetics..." />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Aesthetic</h1>
                    <p className="text-lg text-gray-600">
                        Select the aesthetic that resonates with your style
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {availableAesthetics.map((aesthetic) => (
                        <Card
                            key={aesthetic.id}
                            hoverable
                            onClick={() => handleSelect(aesthetic)}
                            className={`cursor-pointer transition-all ${selectedId === aesthetic.id ? 'ring-4 ring-primary-500' : ''
                                }`}
                        >
                            {aesthetic.imageUrl && (
                                <img
                                    src={aesthetic.imageUrl}
                                    alt={aesthetic.name}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {aesthetic.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">{aesthetic.description}</p>
                                <div className="flex gap-2 flex-wrap">
                                    {aesthetic.themeProperties.colorPalette.slice(0, 5).map((color) => (
                                        <div
                                            key={color}
                                            className="w-8 h-8 rounded-full border-2 border-gray-200"
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {selectedId && (
                    <div className="flex justify-center">
                        <Button size="lg" onClick={handleConfirm} isLoading={isSaving}>
                            Confirm Selection
                        </Button>
                    </div>
                )}
            </div>
        </Layout>
    );
};