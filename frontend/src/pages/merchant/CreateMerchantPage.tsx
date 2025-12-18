import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { useMerchant } from '@/hooks/useMerchant';
import { merchantApi } from '@/api/merchant.api';
import { CreateMerchantDto, Merchant } from '@/types/merchant.types';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Store, ArrowLeft } from 'lucide-react';

export const CreateMerchantPage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { refreshMerchants } = useMerchant();

    const [formData, setFormData] = useState<CreateMerchantDto>({
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
    });

    const { execute: createMerchant, isLoading } = useApi<Merchant, CreateMerchantDto>(
        (data) => merchantApi.create(data)
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createMerchant(formData);
            showToast('Merchant account created successfully!', 'success');
            await refreshMerchants();
            navigate('/merchant/dashboard');
        } catch (error) {
            console.error('Failed to create merchant:', error);
            showToast('Failed to create merchant account', 'error');
        }
    };

    const handleChange = (field: string, value: string) => {
        if (field.startsWith('businessDetails.address.')) {
            const addressField = field.split('.')[2];
            setFormData(prev => ({
                ...prev,
                businessDetails: {
                    ...prev.businessDetails,
                    address: {
                        ...prev.businessDetails.address!,
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

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
            </button>

            <Card>
                <div className="flex items-center mb-6">
                    <div className="p-3 bg-teal-100 rounded-lg">
                        <Store className="w-8 h-8 text-teal-600" />
                    </div>
                    <div className="ml-4">
                        <h1 className="text-2xl font-bold text-gray-900">Create Merchant Account</h1>
                        <p className="text-gray-600">Set up your store to start selling</p>
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
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="My Fashion Store"
                            />

                            <Input
                                label="Email"
                                type="email"
                                required
                                value={formData.email}
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
                                value={formData.businessDetails.businessName || ''}
                                onChange={(e) => handleChange('businessDetails.businessName', e.target.value)}
                                placeholder="Legal business name"
                            />

                            <Input
                                label="Business Type"
                                value={formData.businessDetails.businessType || ''}
                                onChange={(e) => handleChange('businessDetails.businessType', e.target.value)}
                                placeholder="e.g., Sole Proprietorship, LLC"
                            />

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={formData.businessDetails.description || ''}
                                    onChange={(e) => handleChange('businessDetails.description', e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="Tell us about your business..."
                                />
                            </div>

                            <Input
                                label="Website"
                                type="url"
                                value={formData.businessDetails.website || ''}
                                onChange={(e) => handleChange('businessDetails.website', e.target.value)}
                                placeholder="https://yourstore.com"
                            />

                            <Input
                                label="Contact Phone"
                                type="tel"
                                value={formData.businessDetails.contactPhone || ''}
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
                                value={formData.businessDetails.address?.street || ''}
                                onChange={(e) => handleChange('businessDetails.address.street', e.target.value)}
                                placeholder="123 Main St"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="City"
                                    value={formData.businessDetails.address?.city || ''}
                                    onChange={(e) => handleChange('businessDetails.address.city', e.target.value)}
                                    placeholder="New York"
                                />

                                <Input
                                    label="State/Province"
                                    value={formData.businessDetails.address?.state || ''}
                                    onChange={(e) => handleChange('businessDetails.address.state', e.target.value)}
                                    placeholder="NY"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Country"
                                    value={formData.businessDetails.address?.country || ''}
                                    onChange={(e) => handleChange('businessDetails.address.country', e.target.value)}
                                    placeholder="United States"
                                />

                                <Input
                                    label="Postal Code"
                                    value={formData.businessDetails.address?.postalCode || ''}
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
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Create Merchant Account'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};