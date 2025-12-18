import React, { useState } from 'react';
import { useMerchant } from '@/hooks/useMerchant';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { merchantApi } from '@/api/merchant.api';
import { MerchantStaff, AddStaffDto, UpdateStaffDto, StaffRole } from '@/types/merchant.types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Users, Plus, Edit, Trash2, Shield, CheckCircle } from 'lucide-react';

export const ManageStaffPage: React.FC = () => {
    const { currentMerchant, staff, refreshStaff, hasPermission } = useMerchant();
    const { showToast } = useToast();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<MerchantStaff | null>(null);

    const [addFormData, setAddFormData] = useState<AddStaffDto>({
        userId: '',
        role: 'staff'
    });

    const [editFormData, setEditFormData] = useState<UpdateStaffDto>({});

    const { execute: addStaff, isLoading: isAdding } = useApi<MerchantStaff, AddStaffDto>(
        (data) => merchantApi.addStaff(currentMerchant!.id, data)
    );

    const { execute: updateStaff, isLoading: isUpdating } = useApi<MerchantStaff, { id: string; data: UpdateStaffDto }>(
        ({ id, data }) => merchantApi.updateStaff(id, data)
    );

    const { execute: removeStaff } = useApi<void, string>(
        (id) => merchantApi.removeStaff(id)
    );

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addStaff(addFormData);
            showToast('Staff member added successfully', 'success');
            setShowAddModal(false);
            setAddFormData({ userId: '', role: 'staff' });
            await refreshStaff();
        } catch (error) {
            console.error('Failed to add staff:', error);
            showToast('Failed to add staff member', 'error');
        }
    };

    const handleEditStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStaff) return;

        try {
            await updateStaff({ id: selectedStaff.id, data: editFormData });
            showToast('Staff member updated successfully', 'success');
            setShowEditModal(false);
            setSelectedStaff(null);
            setEditFormData({});
            await refreshStaff();
        } catch (error) {
            console.error('Failed to update staff:', error);
            showToast('Failed to update staff member', 'error');
        }
    };

    const handleRemoveStaff = async (staffId: string, staffName: string) => {
        const confirmed = globalThis.confirm(`Are you sure you want to remove ${staffName}?`);
        if (!confirmed) return;

        try {
            await removeStaff(staffId);
            showToast('Staff member removed successfully', 'success');
            await refreshStaff();
        } catch (error) {
            console.error('Failed to remove staff:', error);
            showToast('Failed to remove staff member', 'error');
        }
    };

    const openEditModal = (staffMember: MerchantStaff) => {
        setSelectedStaff(staffMember);
        setEditFormData({
            role: staffMember.role,
            permissions: { ...staffMember.permissions }
        });
        setShowEditModal(true);
    };

    const getRoleBadgeColor = (role: StaffRole) => {
        switch (role) {
            case 'owner': return 'bg-purple-100 text-purple-800';
            case 'admin': return 'bg-blue-100 text-blue-800';
            case 'manager': return 'bg-green-100 text-green-800';
            case 'staff': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
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

    if (!hasPermission('canManageStaff')) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="text-center py-12">
                    <p className="text-red-600">You don't have permission to manage staff</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Staff</h1>
                    <p className="text-gray-600 mt-1">{currentMerchant.name}</p>
                </div>
                <Button
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 md:mt-0"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Staff Member
                </Button>
            </div>

            {/* Staff List */}
            <Card>
                {staff.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No staff members</h3>
                        <p className="text-gray-600 mb-6">Add your first team member to get started</p>
                        <Button onClick={() => setShowAddModal(true)}>
                            <Plus className="w-5 h-5 mr-2" />
                            Add Staff Member
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {staff.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                                                    <span className="text-teal-600 font-semibold">
                                                        {member.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="font-medium text-gray-900">
                                                        {member.user?.name || 'Unknown User'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{member.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(member.role)}`}>
                                                <Shield className="w-3 h-3 mr-1" />
                                                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {Object.entries(member.permissions).map(([key, value]) => (
                                                    value && (
                                                        <span
                                                            key={key}
                                                            className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded"
                                                        >
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            {key.replace('can', '').replaceAll(/([A-Z])/g, ' $1').trim()}
                                                        </span>
                                                    )
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center space-x-2">
                                                {member.role !== 'owner' && (
                                                    <>
                                                        <button
                                                            onClick={() => openEditModal(member)}
                                                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveStaff(member.id, member.user?.name || 'this user')}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Remove"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Add Staff Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Staff Member">
                <form onSubmit={handleAddStaff} className="space-y-4">
                    <div>
                        <label htmlFor="add-user-id" className="block text-sm font-medium text-gray-700 mb-1">
                            User ID
                        </label>
                        <input
                            id="add-user-id"
                            type="text"
                            required
                            value={addFormData.userId}
                            onChange={(e) => setAddFormData({ ...addFormData, userId: e.target.value })}
                            placeholder="Enter user ID or email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="add-role" className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            id="add-role"
                            value={addFormData.role}
                            onChange={(e) => setAddFormData({ ...addFormData, role: e.target.value as StaffRole })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                            <option value="staff">Staff</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowAddModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isAdding}>
                            {isAdding ? 'Adding...' : 'Add Staff'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Staff Modal */}
            <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Staff Member">
                <form onSubmit={handleEditStaff} className="space-y-4">
                    <div>
                        <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            id="edit-role"
                            value={editFormData.role || 'staff'}
                            onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as StaffRole })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                            <option value="staff">Staff</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div>
                        <span className="block text-sm font-medium text-gray-700 mb-3">
                            Permissions
                        </span>
                        <div className="space-y-2">
                            {[
                                { key: 'canManageProducts', label: 'Manage Products' },
                                { key: 'canManageOrders', label: 'Manage Orders' },
                                { key: 'canManageStaff', label: 'Manage Staff' },
                                { key: 'canViewAnalytics', label: 'View Analytics' },
                                { key: 'canManageSettings', label: 'Manage Settings' }
                            ].map(({ key, label }) => (
                                <label key={key} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={editFormData.permissions?.[key as keyof typeof editFormData.permissions] ?? false}
                                        onChange={(e) => setEditFormData({
                                            ...editFormData,
                                            permissions: {
                                                ...editFormData.permissions,
                                                [key]: e.target.checked
                                            }
                                        })}
                                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowEditModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? 'Updating...' : 'Update Staff'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};