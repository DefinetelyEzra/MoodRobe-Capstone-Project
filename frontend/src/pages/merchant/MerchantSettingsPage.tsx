import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMerchant } from '@/hooks/useMerchant';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { merchantApi } from '@/api/merchant.api';
import { Merchant, UpdateMerchantDto } from '@/types/merchant.types';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Settings, Save, ArrowLeft, AlertCircle } from 'lucide-react';

export const MerchantSettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentMerchant, isOwner, refreshMerchants } = useMerchant();
    const { showToast } = useToast();

    const { execute: updateMerchant, isLoading } = useApi<Merchant, { id: string; data: UpdateMerchantDto }>(
        ({ id, data }) => merchantApi.update(id, data)
    );

    const { execute: deactivateMerchant } = useApi<void, string>(
        (id) => merchantApi.deactivate(id)
    );

    // Derive initial form data from current merchant
    const initialFormData = currentMerchant ? {
        name: currentMerchant.name,
        email: currentMerchant.email,
        businessDetails: currentMerchant.businessDetails
    } : {
        name: '',
        email: '',
        businessDetails: {
            businessName: '',
            businessType: '',
            description: '',
            website: '',
            contactPhone: '',
            address: {
                street: '',
                city: '',
                state: '',
                country: '',
                postalCode: ''
            }
        }
    };

    const [formData, setFormData] = useState<UpdateMerchantDto>(initialFormData);

    // Update form data when merchant first loads
    useEffect(() => {
        if (currentMerchant) {
            setFormData({
                name: currentMerchant.name,
                email: currentMerchant.email,
                businessDetails: currentMerchant.businessDetails
            });
        }
        // Only run when currentMerchant changes from null to a value
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMerchant?.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentMerchant) return;

        try {
            await updateMerchant({ id: currentMerchant.id, data: formData });
            showToast('Settings updated successfully!', 'success');
            await refreshMerchants();
        } catch (error) {
            console.error('Failed to update settings:', error);
            showToast('Failed to update settings', 'error');
        }
    };

    const handleDeactivate = async () => {
        if (!currentMerchant) return;

        const confirmed = globalThis.confirm(
            'Are you sure you want to deactivate this merchant account? This will hide all products from customers.'
        );

        if (!confirmed) return;

        try {
            await deactivateMerchant(currentMerchant.id);
            showToast('Merchant account deactivated', 'success');
            await refreshMerchants();
            navigate('/merchant/dashboard');
        } catch (error) {
            console.error('Failed to deactivate merchant:', error);
            showToast('Failed to deactivate merchant', 'error');
        }
    };

    const handleChange = (field: string, value: string) => {
        if (field.startsWith('businessDetails.address.')) {
            const addressField = field.split('.')[2];
            setFormData(prev => ({
                ...prev,
                businessDetails: {
                    ...prev.businessDetails!,
                    address: {
                        street: prev.businessDetails?.address?.street || '',
                        city: prev.businessDetails?.address?.city || '',
                        state: prev.businessDetails?.address?.state || '',
                        country: prev.businessDetails?.address?.country || '',
                        postalCode: prev.businessDetails?.address?.postalCode || '',
                        [addressField]: value
                    }
                }
            }));
        } else if (field.startsWith('businessDetails.')) {
            const bdField = field.split('.')[1];
            setFormData(prev => ({
                ...prev,
                businessDetails: {
                    ...prev.businessDetails,
                    [bdField]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    if (!currentMerchant) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="text-center py-12">
                    <p className="text-gray-600">Please select a merchant account</p>
                </Card>
            </div>
        );
    }

    if (!isOwner()) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="text-center py-12">
                    <p className="text-red-600">Only the merchant owner can access settings</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => navigate('/merchant/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
            </button>

            <Card>
                <div className="flex items-center mb-6">
                    <div className="p-3 bg-teal-100 rounded-lg">
                        <Settings className="w-8 h-8 text-teal-600" />
                    </div>
                    <div className="ml-4">
                        <h1 className="text-2xl font-bold text-gray-900">Merchant Settings</h1>
                        <p className="text-gray-600">Manage your merchant account</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                        <div className="space-y-4">
                            <Input
                                label="Store Name"
                                required
                                value={formData.name || ''}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="My Fashion Store"
                            />

                            <Input
                                label="Email"
                                type="email"
                                required
                                value={formData.email || ''}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="store@example.com"
                            />
                        </div>
                    </div>

                    {/* Business Details */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h2>
                        <div className="space-y-4">
                            <Input
                                label="Business Name"
                                value={formData.businessDetails?.businessName || ''}
                                onChange={(e) => handleChange('businessDetails.businessName', e.target.value)}
                                placeholder="Legal business name"
                            />

                            <Input
                                label="Business Type"
                                value={formData.businessDetails?.businessType || ''}
                                onChange={(e) => handleChange('businessDetails.businessType', e.target.value)}
                                placeholder="e.g., Sole Proprietorship, LLC"
                            />

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={formData.businessDetails?.description || ''}
                                    onChange={(e) => handleChange('businessDetails.description', e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="Tell us about your business..."
                                />
                            </div>

                            <Input
                                label="Website"
                                type="url"
                                value={formData.businessDetails?.website || ''}
                                onChange={(e) => handleChange('businessDetails.website', e.target.value)}
                                placeholder="https://yourstore.com"
                            />

                            <Input
                                label="Contact Phone"
                                type="tel"
                                value={formData.businessDetails?.contactPhone || ''}
                                onChange={(e) => handleChange('businessDetails.contactPhone', e.target.value)}
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Address</h2>
                        <div className="space-y-4">
                            <Input
                                label="Street Address"
                                value={formData.businessDetails?.address?.street || ''}
                                onChange={(e) => handleChange('businessDetails.address.street', e.target.value)}
                                placeholder="123 Main St"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="City"
                                    value={formData.businessDetails?.address?.city || ''}
                                    onChange={(e) => handleChange('businessDetails.address.city', e.target.value)}
                                    placeholder="New York"
                                />

                                <Input
                                    label="State/Province"
                                    value={formData.businessDetails?.address?.state || ''}
                                    onChange={(e) => handleChange('businessDetails.address.state', e.target.value)}
                                    placeholder="NY"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Country"
                                    value={formData.businessDetails?.address?.country || ''}
                                    onChange={(e) => handleChange('businessDetails.address.country', e.target.value)}
                                    placeholder="United States"
                                />

                                <Input
                                    label="Postal Code"
                                    value={formData.businessDetails?.address?.postalCode || ''}
                                    onChange={(e) => handleChange('businessDetails.address.postalCode', e.target.value)}
                                    placeholder="10001"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/merchant/dashboard')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            <Save className="w-4 h-4 mr-2" />
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>

                {/* Danger Zone */}
                {currentMerchant.isActive && (
                    <div className="mt-8 pt-6 border-t border-red-200">
                        <div className="flex items-start">
                            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                            <div className="ml-3 flex-1">
                                <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
                                <p className="text-sm text-red-700 mb-4">
                                    Deactivating your merchant account will hide all products from customers.
                                    You can reactivate it at any time.
                                </p>
                                <Button
                                    type="button"
                                    onClick={handleDeactivate}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Deactivate Merchant Account
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};