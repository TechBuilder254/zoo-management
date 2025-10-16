import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, AlertTriangle, FileText, Pill, Stethoscope, Edit, Trash2 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { HealthRecordForm } from '../../components/admin/HealthRecordForm';
import { healthService, HealthRecord, HealthStats } from '../../services/healthService';
import toast from 'react-hot-toast';


export const AnimalHealth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'records' | 'appointments' | 'alerts'>('records');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [healthStats, setHealthStats] = useState<HealthStats | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<HealthRecord[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<HealthRecord[]>([]);
  const [healthAlerts, setHealthAlerts] = useState<HealthRecord[]>([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stats, records, appointments, alerts] = await Promise.all([
        healthService.getStats(),
        healthService.getAll(),
        healthService.getUpcomingAppointments(),
        healthService.getHealthAlerts()
      ]);
      
      setHealthStats(stats);
      setMedicalRecords(records);
      setUpcomingAppointments(appointments);
      setHealthAlerts(alerts);
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

  const handleEditRecord = (record: HealthRecord) => {
    setSelectedRecord(record);
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleViewRecord = (record: HealthRecord) => {
    setSelectedRecord(record);
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this health record?')) {
      try {
        await healthService.delete(id);
        toast.success('Health record deleted successfully');
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Failed to delete health record:', error);
        toast.error('Failed to delete health record');
      }
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
      
      fetchData(); // Refresh data
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };


  return (
    <AdminLayout>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Animal Health & Veterinary
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage medical records, appointments, and health monitoring.
              </p>
            </div>
            <Button onClick={handleAddRecord} className="flex items-center">
              <Plus size={20} className="mr-2" /> Add Medical Record
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <Card padding="lg" className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-3">
                <FileText className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {loading ? '...' : healthStats?.totalRecords || 0}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Total Records</p>
            </Card>
            
            <Card padding="lg" className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-3">
                <Calendar className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {loading ? '...' : healthStats?.upcomingAppointments || 0}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Upcoming Appointments</p>
            </Card>
            
            <Card padding="lg" className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg mx-auto mb-3">
                <AlertTriangle className="text-yellow-600 dark:text-yellow-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {loading ? '...' : healthStats?.healthAlerts || 0}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Health Alerts</p>
            </Card>
            
            <Card padding="lg" className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-3">
                <Stethoscope className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {loading ? '...' : healthStats?.activeTreatments || 0}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Active Treatments</p>
            </Card>
          </div>

          {/* Tabs */}
          <div className="mb-6 lg:mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex flex-wrap space-x-4 lg:space-x-8">
                {[
                  { id: 'records', label: 'Medical Records', icon: FileText },
                  { id: 'appointments', label: 'Appointments', icon: Calendar },
                  { id: 'alerts', label: 'Health Alerts', icon: AlertTriangle }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
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

          {/* Content based on active tab */}
          {activeTab === 'records' && (
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
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
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Loading medical records...
                        </td>
                      </tr>
                    ) : medicalRecords.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          No medical records found
                        </td>
                      </tr>
                    ) : (
                      medicalRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={record.animal.image_url || '/placeholder-animal.jpg'}
                                  alt={record.animal.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {record.animal.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {record.animal.species} • ID: {record.animal.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {new Date(record.created_at).toLocaleDateString()}
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(record.type)}`}>
                              {record.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {record.veterinarian}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs">
                            <div className="truncate">{record.description}</div>
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                                {record.status}
                              </span>
                              <div className="flex space-x-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewRecord(record)}
                                  className="p-1"
                                >
                                  <Edit size={14} />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditRecord(record)}
                                  className="p-1"
                                >
                                  <Edit size={14} />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteRecord(record.id)}
                                  className="p-1 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === 'appointments' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {loading ? (
                <div className="col-span-full text-center text-gray-500 py-8">
                  Loading appointments...
                </div>
              ) : upcomingAppointments.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-8">
                  No upcoming appointments found
                </div>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id} padding="lg" className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      <img
                        className="h-12 w-12 rounded-full object-cover mr-4"
                        src={appointment.animal.image_url || '/placeholder-animal.jpg'}
                        alt={appointment.animal.name}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {appointment.animal.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {appointment.animal.species} • ID: {appointment.animal.id}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Date:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {appointment.next_appointment ? new Date(appointment.next_appointment).toLocaleDateString() : 'Not scheduled'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(appointment.type)}`}>
                          {appointment.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Veterinarian:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {appointment.veterinarian}
                        </span>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {appointment.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-gray-500 py-8">
                  Loading health alerts...
                </div>
              ) : healthAlerts.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No health alerts found
                </div>
              ) : (
                healthAlerts.map((alert) => (
                  <Card key={alert.id} padding="lg" className="border-l-4 border-l-yellow-400">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <img
                          className="h-12 w-12 rounded-full object-cover mr-4"
                          src={alert.animal.image_url || '/placeholder-animal.jpg'}
                          alt={alert.animal.name}
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {alert.animal.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {alert.animal.species} • ID: {alert.animal.id}
                          </p>
                          <p className="text-sm text-gray-900 dark:text-white mt-1">
                            {alert.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          Type: {alert.type}
                        </p>
                        {alert.next_appointment && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Next: {new Date(alert.next_appointment).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

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
