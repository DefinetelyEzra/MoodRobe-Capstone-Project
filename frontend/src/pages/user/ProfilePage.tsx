import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Palette, Edit2, Save, X, Package, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAesthetic } from '@/hooks/useAesthetic';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { userApi } from '@/api/user.api';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface UpdateProfileForm {
    name: string;
    email: string;
}

export const ProfilePage: React.FC = () => {
    const { user, refreshUser, logout } = useAuth();
    const { selectedAesthetic } = useAesthetic();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UpdateProfileForm>({
        name: user?.name || '',
        email: user?.email || '',
    });

    const { isLoading: isUpdating, execute: updateProfile } = useApi(
        () => userApi.updateProfile(formData)
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await updateProfile();
            await refreshUser();
            setIsEditing(false);
            showToast('Profile updated successfully', 'success');
        } catch (error) {
            console.error('Failed to update profile:', error);
            showToast('Failed to update profile', 'error');
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
        });
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner text="Loading profile..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-canvas">
            {/* Header Section */}
            <div className="bg-linear-to-b from-accent/10 to-canvas border-b border-border">
                <div className="max-w-5xl mx-auto px-4 py-12">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                            <User className="w-10 h-10 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary">{user.name}</h1>
                            <p className="text-text-secondary">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Profile Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Information Card */}
                        <Card className="bg-surface border border-border">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="text-xl font-semibold text-text-primary flex items-center">
                                        <User className="w-5 h-5 mr-2 text-accent" />
                                        Profile Information
                                    </div>
                                    {isEditing ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleCancel}
                                                className="flex items-center px-3 py-2 text-sm border border-border rounded-lg text-text-secondary hover:bg-canvas transition-colors"
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                disabled={isUpdating}
                                                className="flex items-center px-4 py-2 text-sm bg-accent hover:bg-accent-dark text-surface rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                {isUpdating ? 'Saving...' : 'Save'}
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center px-4 py-2 text-sm border border-border rounded-lg text-text-primary hover:bg-canvas transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            Edit
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {isEditing ? (
                                        <>
                                            <Input
                                                label="Full Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter your name"
                                            />
                                            <Input
                                                label="Email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Enter email"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <div className="pb-4 border-b border-border">
                                                <div className="text-sm font-medium text-text-secondary mb-1">
                                                    Full Name
                                                </div>
                                                <p className="text-text-primary font-medium">{user.name}</p>
                                            </div>
                                            <div className="pb-4 border-b border-border">
                                                <div className="text-sm font-medium text-text-secondary mb-1 flex items-center">
                                                    <Mail className="w-4 h-4 mr-2" />
                                                    Email Address
                                                </div>
                                                <p className="text-text-primary font-medium">{user.email}</p>
                                            </div>
                                            {user.createdAt && (
                                                <div>
                                                    <div className="text-sm font-medium text-text-secondary mb-1 flex items-center">
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        Member Since
                                                    </div>
                                                    <p className="text-text-primary font-medium">
                                                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Current Aesthetic Card */}
                        <Card className="bg-surface border border-border">
                            <div className="p-6">
                                <div className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                                    <Palette className="w-5 h-5 mr-2 text-accent" />
                                    Your Aesthetic
                                </div>
                                {selectedAesthetic ? (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            {selectedAesthetic.imageUrl && (
                                                <img
                                                    src={selectedAesthetic.imageUrl}
                                                    alt={selectedAesthetic.name}
                                                    className="w-20 h-20 rounded-lg object-cover border border-border"
                                                />
                                            )}
                                            <div>
                                                <h3 className="font-semibold text-text-primary text-lg">
                                                    {selectedAesthetic.name}
                                                </h3>
                                                <p className="text-sm text-text-secondary mt-1">
                                                    {selectedAesthetic.description}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate('/aesthetic-selection')}
                                            className="px-4 py-2 border border-border rounded-lg text-text-primary hover:bg-canvas transition-colors text-sm font-medium"
                                        >
                                            Change
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-canvas rounded-lg border border-border">
                                        <Palette className="w-12 h-12 text-text-secondary mx-auto mb-3" />
                                        <p className="text-text-secondary mb-4">No aesthetic selected</p>
                                        <button
                                            onClick={() => navigate('/aesthetic-selection')}
                                            className="px-6 py-2 bg-accent hover:bg-accent-dark text-surface rounded-lg font-medium transition-colors"
                                        >
                                            Choose Your Aesthetic
                                        </button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Quick Actions */}
                    <div className="space-y-6">
                        {/* Quick Actions Card */}
                        <Card className="bg-surface border border-border">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-text-primary mb-4">
                                    Quick Actions
                                </h2>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => navigate('/orders')}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border hover:bg-canvas transition-colors group"
                                    >
                                        <div className="flex items-center">
                                            <Package className="w-5 h-5 mr-3 text-accent" />
                                            <span className="font-medium text-text-primary">Order History</span>
                                        </div>
                                        <span className="text-text-secondary group-hover:text-accent transition-colors">→</span>
                                    </button>

                                    <button
                                        onClick={() => navigate('/products')}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border hover:bg-canvas transition-colors group"
                                    >
                                        <div className="flex items-center">
                                            <ShoppingBag className="w-5 h-5 mr-3 text-accent" />
                                            <span className="font-medium text-text-primary">Continue Shopping</span>
                                        </div>
                                        <span className="text-text-secondary group-hover:text-accent transition-colors">→</span>
                                    </button>

                                    <button
                                        onClick={() => navigate('/style-quiz')}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border hover:bg-canvas transition-colors group"
                                    >
                                        <div className="flex items-center">
                                            <Palette className="w-5 h-5 mr-3 text-accent" />
                                            <span className="font-medium text-text-primary">Retake Style Quiz</span>
                                        </div>
                                        <span className="text-text-secondary group-hover:text-accent transition-colors">→</span>
                                    </button>
                                </div>
                            </div>
                        </Card>

                        {/* Account Actions Card */}
                        <Card className="bg-surface border border-border">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-text-primary mb-4">
                                    Account
                                </h2>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center px-4 py-3 rounded-lg border border-border hover:bg-accent/5 hover:border-accent text-text-primary hover:text-accent transition-colors"
                                >
                                    <LogOut className="w-5 h-5 mr-2" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};