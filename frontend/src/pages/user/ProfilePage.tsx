import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Palette, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAesthetic } from '@/hooks/useAesthetic';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { userApi } from '@/api/user.api';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
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
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                <p className="text-gray-600">Manage your account information and preferences</p>
            </div>

            <div className="grid gap-6">
                {/* Profile Information Card */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-xl font-semibold text-gray-900 flex items-center">
                                <User className="w-5 h-5 mr-2" />
                                Profile Information
                            </div>
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancel}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSave}
                                        isLoading={isUpdating}
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
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
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1">
                                            Full Name
                                        </div>
                                        <p className="text-gray-900">{user.name}</p>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                                            <Mail className="w-4 h-4 mr-2" />
                                            Email
                                        </div>
                                        <p className="text-gray-900">{user.email}</p>
                                    </div>
                                    {user.createdAt && (
                                        <div>
                                            <div className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                Member Since
                                            </div>
                                            <p className="text-gray-900">
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
                <Card>
                    <div className="p-6">
                        <div className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <Palette className="w-5 h-5 mr-2" />
                            Current Aesthetic
                        </div>
                        {selectedAesthetic ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    {selectedAesthetic.imageUrl && (
                                        <img
                                            src={selectedAesthetic.imageUrl}
                                            alt={selectedAesthetic.name}
                                            className="w-20 h-20 rounded-lg object-cover"
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {selectedAesthetic.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {selectedAesthetic.description}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/aesthetic-selection')}
                                >
                                    Change
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-600 mb-4">No aesthetic selected</p>
                                <Button onClick={() => navigate('/aesthetic-selection')}>
                                    Choose Your Aesthetic
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Account Actions Card */}
                <Card>
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Account Actions
                        </h2>
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => navigate('/style-quiz')}
                            >
                                Retake Style Quiz
                            </Button>
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};