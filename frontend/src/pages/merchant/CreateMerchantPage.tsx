import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { useMerchant } from '@/hooks/useMerchant';
import { merchantApi } from '@/api/merchant.api';
import { CreateMerchantDto, Merchant } from '@/types/merchant.types';
import { Input } from '@/components/common/Input';
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
        <div className="min-h-screen bg-canvas">
            {/* Header */}
            <div className="bg-linear-to-b from-accent/10 to-canvas border-b border-border">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-accent hover:text-accent-dark mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </button>
                    <div className="flex items-center">
                        <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center">
                            <Store className="w-8 h-8 text-accent" />
                        </div>
                        <div className="ml-4">
                            <h1 className="text-3xl font-bold text-text-primary">Create Merchant Account</h1>
                            <p className="text-text-secondary mt-1">Set up your store to start selling</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-surface rounded-xl border border-border shadow-sm">
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Basic Information */}
                        <div>
                            <h2 className="text-xl font-semibold text-text-primary mb-6">Basic Information</h2>
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
                        <div className="pt-6 border-t border-border">
                            <h2 className="text-xl font-semibold text-text-primary mb-6">Business Details</h2>
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
                                    <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={formData.businessDetails.description || ''}
                                        onChange={(e) => handleChange('businessDetails.description', e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface text-text-primary placeholder-text-secondary"
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
                        <div className="pt-6 border-t border-border">
                            <h2 className="text-xl font-semibold text-text-primary mb-6">Business Address</h2>
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
                        <div className="flex justify-end space-x-4 pt-6 border-t border-border">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 border border-border hover:bg-canvas text-text-primary rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                {isLoading ? 'Creating...' : 'Create Merchant Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};