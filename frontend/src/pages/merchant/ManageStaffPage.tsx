import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMerchant } from '@/hooks/useMerchant';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { merchantApi } from '@/api/merchant.api';
import { MerchantStaff, AddStaffDto, UpdateStaffDto, StaffRole } from '@/types/merchant.types';
import { Modal } from '@/components/common/Modal';
import { Users, Plus, Edit, Trash2, Shield, CheckCircle, ArrowLeft } from 'lucide-react';

export const ManageStaffPage: React.FC = () => {
    const { currentMerchant, staff, refreshStaff, hasPermission } = useMerchant();
    const { showToast } = useToast();
    const navigate = useNavigate();
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
            case 'owner': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'admin': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'manager': return 'bg-green-50 text-green-700 border-green-200';
            case 'staff': return 'bg-canvas text-text-secondary border-border';
            default: return 'bg-canvas text-text-secondary border-border';
        }
    };

    if (!currentMerchant) {
        return (
            <div className="min-h-screen bg-canvas flex items-center justify-center">
                <div className="bg-surface border border-border rounded-xl p-12 text-center max-w-md">
                    <Users className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                    <p className="text-text-primary">Please select a merchant account</p>
                </div>
            </div>
        );
    }

    if (!hasPermission('canManageStaff')) {
        return (
            <div className="min-h-screen bg-canvas flex items-center justify-center">
                <div className="bg-surface border border-border rounded-xl p-12 text-center max-w-md">
                    <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <p className="text-red-600 font-medium">You don't have permission to manage staff</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-canvas">
            {/* Header */}
            <div className="bg-linear-to-b from-accent/10 to-canvas border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <button
                        onClick={() => navigate('/merchant/dashboard')}
                        className="flex items-center text-accent hover:text-accent-dark mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-text-primary">Manage Staff</h1>
                            <p className="text-text-secondary mt-2">{currentMerchant.name}</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="mt-4 md:mt-0 flex items-center px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors shadow-md"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Staff Member
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Staff List */}
                <div className="bg-surface rounded-xl border border-border shadow-sm">
                    {staff.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-10 h-10 text-accent" />
                            </div>
                            <h3 className="text-xl font-semibold text-text-primary mb-2">No staff members</h3>
                            <p className="text-text-secondary mb-6">Add your first team member to get started</p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors"
                            >
                                <Plus className="w-5 h-5 inline mr-2" />
                                Add Staff Member
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-canvas border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Member</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Permissions</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {staff.map((member) => (
                                        <tr key={member.id} className="hover:bg-canvas transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                                                        <span className="text-accent font-semibold">
                                                            {member.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium text-text-primary">
                                                            {member.user?.name || 'Unknown User'}
                                                        </div>
                                                        <div className="text-sm text-text-secondary">{member.user?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border ${getRoleBadgeColor(member.role)}`}>
                                                    <Shield className="w-3 h-3 mr-1" />
                                                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {Object.entries(member.permissions).map(([key, value]) => (
                                                        value && (
                                                            <span
                                                                key={key}
                                                                className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-200"
                                                            >
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                {key.replace('can', '').replaceAll(/([A-Z])/g, ' $1').trim()}
                                                            </span>
                                                        )
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    {member.role !== 'owner' && (
                                                        <>
                                                            <button
                                                                onClick={() => openEditModal(member)}
                                                                className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
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
                </div>
            </div>

            {/* Add Staff Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Staff Member">
                <form onSubmit={handleAddStaff} className="space-y-4">
                    <div>
                        <label htmlFor="add-user-id" className="block text-sm font-medium text-text-primary mb-2">
                            User ID
                        </label>
                        <input
                            id="add-user-id"
                            type="text"
                            required
                            value={addFormData.userId}
                            onChange={(e) => setAddFormData({ ...addFormData, userId: e.target.value })}
                            placeholder="Enter user ID or email"
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface"
                        />
                    </div>

                    <div>
                        <label htmlFor="add-role" className="block text-sm font-medium text-text-primary mb-2">
                            Role
                        </label>
                        <select
                            id="add-role"
                            value={addFormData.role}
                            onChange={(e) => setAddFormData({ ...addFormData, role: e.target.value as StaffRole })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface"
                        >
                            <option value="staff">Staff</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            className="px-6 py-3 border border-border hover:bg-canvas text-text-primary rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isAdding}
                            className="px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                            {isAdding ? 'Adding...' : 'Add Staff'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Staff Modal */}
            <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Staff Member">
                <form onSubmit={handleEditStaff} className="space-y-4">
                    <div>
                        <label htmlFor="edit-role" className="block text-sm font-medium text-text-primary mb-2">
                            Role
                        </label>
                        <select
                            id="edit-role"
                            value={editFormData.role || 'staff'}
                            onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as StaffRole })}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface"
                        >
                            <option value="staff">Staff</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div>
                        <span className="block text-sm font-medium text-text-primary mb-3">
                            Permissions
                        </span>
                        <div className="space-y-3 bg-canvas p-4 rounded-lg">
                            {[
                                { key: 'canManageProducts', label: 'Manage Products' },
                                { key: 'canManageOrders', label: 'Manage Orders' },
                                { key: 'canManageStaff', label: 'Manage Staff' },
                                { key: 'canViewAnalytics', label: 'View Analytics' },
                                { key: 'canManageSettings', label: 'Manage Settings' }
                            ].map(({ key, label }) => (
                                <label key={key} className="flex items-center cursor-pointer hover:bg-surface p-2 rounded transition-colors">
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
                                        className="rounded border-border text-accent focus:ring-accent"
                                    />
                                    <span className="ml-3 text-sm text-text-primary font-medium">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowEditModal(false)}
                            className="px-6 py-3 border border-border hover:bg-canvas text-text-primary rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="px-6 py-3 bg-accent hover:bg-accent-dark text-surface rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                            {isUpdating ? 'Updating...' : 'Update Staff'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};