import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, UserCheck } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Sidebar } from '../../components/admin/Sidebar';
import { StaffForm } from '../../components/admin/StaffForm';
import { staffService, StaffMember } from '../../services/staffService';
import toast from 'react-hot-toast';

export const StaffManagement: React.FC = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'add' | 'edit'>('view');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch staff members from API
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await staffService.getAll();
        setStaffMembers(data);
      } catch (error) {
        console.error('Failed to fetch staff:', error);
        toast.error('Failed to fetch staff members');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleDeleteStaff = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await staffService.delete(id);
        setStaffMembers(staffMembers.filter(staff => staff.id !== id));
        toast.success('Staff member deleted successfully');
      } catch (error) {
        console.error('Failed to delete staff:', error);
        toast.error('Failed to delete staff member');
      }
    }
  };

  const handleViewStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleEditStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStaff(null);
    setIsSubmitting(false);
  };

  const handleStaffSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (modalType === 'add') {
        await staffService.create(data);
        toast.success('Staff member created successfully');
        // Refresh staff list
        const updatedStaff = await staffService.getAll();
        setStaffMembers(updatedStaff);
      } else if (modalType === 'edit' && selectedStaff) {
        await staffService.update(selectedStaff.id, data);
        toast.success('Staff member updated successfully');
        // Refresh staff list
        const updatedStaff = await staffService.getAll();
        setStaffMembers(updatedStaff);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save staff member:', error);
      toast.error('Failed to save staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = ['All', 'ADMIN', 'STAFF', 'VISITOR'];

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === '' || selectedRole === 'All' || staff.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'STAFF':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'VISITOR':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="lg:ml-56 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading staff members...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="lg:ml-56">
        <div className="p-3 lg:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Staff Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage zoo staff members and their roles
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="mt-3 sm:mt-0"
              onClick={handleAddStaff}
            >
              <Plus size={16} className="mr-2" />
              Add Staff Member
            </Button>
          </div>

          {/* Filters */}
          <Card padding="lg" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Staff
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedRole('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </Card>

          {/* Staff Table */}
          <Card padding="lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Staff Member</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Joined</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((staff) => (
                      <tr key={staff.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary-light dark:bg-primary/20 flex items-center justify-center">
                              <UserCheck size={20} className="text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {staff.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                ID: {staff.id.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-900 dark:text-white">{staff.email}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(staff.role)}`}>
                            {staff.role}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-900 dark:text-white">
                            {new Date(staff.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="p-2"
                              onClick={() => handleViewStaff(staff)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="p-2"
                              onClick={() => handleEditStaff(staff)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteStaff(staff.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                        {searchTerm || selectedRole !== '' ? 'No staff members found matching your criteria.' : 'No staff members found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={
              modalType === 'view' ? 'Staff Member Details' :
              modalType === 'edit' ? 'Edit Staff Member' :
              'Add New Staff Member'
            }
            size={modalType === 'view' ? 'md' : 'lg'}
          >
            {modalType === 'view' && selectedStaff ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedStaff.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {selectedStaff.email}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Role</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedStaff.role)}`}>
                      {selectedStaff.role}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Joined</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(selectedStaff.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Last Updated</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(selectedStaff.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <Button variant="outline" onClick={handleCloseModal}>
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <StaffForm
                staff={selectedStaff || undefined}
                onSubmit={handleStaffSubmit}
                onCancel={handleCloseModal}
                isLoading={isSubmitting}
              />
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};