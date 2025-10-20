import React, { useState, useEffect } from 'react';
import { Plus, Search, Pill, Trash2 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { HealthRecordForm } from '../../components/admin/HealthRecordForm';
import { healthService, HealthRecord } from '../../services/healthService';
import { Modal } from '../../components/common/Modal';
import toast from 'react-hot-toast';


export const AnimalHealth: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [medicalRecords, setMedicalRecords] = useState<HealthRecord[]>([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const records = await healthService.getAll();
      setMedicalRecords(records);
    } catch (error) {
      console.error('Failed to fetch health data:', error);
      toast.error('Failed to load health data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = () => {
    setSelectedRecord(null);
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleViewRecord = (record: HealthRecord) => {
    setSelectedRecord(record);
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleDeleteRecord = (id: string) => {
    setConfirmDeleteId(id);
  };

  const performDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await toast.promise(
        healthService.delete(confirmDeleteId),
        {
          loading: 'Deleting record…',
          success: 'Health record deleted',
          error: 'Failed to delete record',
        }
      );
      setMedicalRecords(prev => prev.filter(r => r.id !== confirmDeleteId));
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setIsSubmitting(false);
  };

  const handleRecordSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (modalType === 'add') {
        await healthService.create(data);
        toast.success('Health record created successfully');
      } else if (modalType === 'edit' && selectedRecord) {
        await healthService.update(selectedRecord.id, data);
        toast.success('Health record updated successfully');
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save health record:', error);
      toast.error('Failed to save health record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Vaccination':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Checkup':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Treatment':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Emergency':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Surgery':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const shortId = (id?: string) => (id ? id.slice(0, 4) : 'N/A');

  return (
    <AdminLayout>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Animal Health & Veterinary
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage medical records and health monitoring.
              </p>
            </div>
            <Button onClick={handleAddRecord} className="flex items-center">
              <Plus size={20} className="mr-2" /> Add Medical Record
            </Button>
          </div>

          {/* Search */}
          <Card padding="lg" className="mb-6 lg:mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search animals, records, or veterinarians..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          {/* Records */}
          <Card padding="none">
            <div className="overflow-x-hidden">
              <table className="min-w-full table-fixed">
                <colgroup>
                  <col className="w-4/12" />
                  <col className="w-3/12" />
                  <col className="w-2/12" />
                  <col className="w-2/12" />
                  <col className="w-1/12" />
                </colgroup>
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Animal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date & Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Veterinarian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        Loading medical records...
                      </td>
                    </tr>
                  ) : medicalRecords.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No medical records found
                      </td>
                    </tr>
                  ) : (
                    medicalRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4 cursor-pointer" onClick={() => handleViewRecord(record)}>
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={record.animal?.image_url || '/placeholder-animal.jpg'}
                                alt={record.animal?.name || 'Unknown Animal'}
                              />
                            </div>
                            <div className="ml-4 min-w-0">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {record.animal?.name || 'Unknown Animal'}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {record.animal?.species || 'Unknown Species'} • ID: {shortId(record.animal?.id)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {new Date(record.created_at).toLocaleDateString()}
                          </div>
                          <span className={`inline-flex px-2 py-1 mt-1 text-xs font-semibold rounded-full ${getTypeColor(record.type)}`}>
                            {record.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {record.veterinarian}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          <div className="truncate" title={record.description}>{record.description}</div>
                          {record.medications && record.medications.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {record.medications.map((med, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                  <Pill size={12} className="mr-1" />
                                  {med}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-1 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteRecord(record.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Delete confirmation modal */}
          <Modal
            isOpen={!!confirmDeleteId}
            onClose={() => setConfirmDeleteId(null)}
            title="Delete Health Record"
            size="sm"
          >
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to permanently delete this health record? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
                <Button variant="primary" onClick={performDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </Button>
              </div>
            </div>
          </Modal>

          {/* Health Record Modal */}
          {isModalOpen && (
            <HealthRecordForm
              record={selectedRecord}
              onSubmit={handleRecordSubmit}
              onCancel={handleCloseModal}
              isLoading={isSubmitting}
            />
          )}
        </AdminLayout>
  );
};
