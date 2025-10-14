import React, { useState } from 'react';
import { Plus, Search, Calendar, AlertTriangle, FileText, Pill, Stethoscope } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Sidebar } from '../../components/admin/Sidebar';

interface MedicalRecord {
  id: string;
  animalId: string;
  animalName: string;
  animalImage: string;
  date: string;
  type: 'Vaccination' | 'Checkup' | 'Treatment' | 'Emergency' | 'Surgery';
  veterinarian: string;
  description: string;
  medications?: string[];
  nextAppointment?: string;
  status: 'Completed' | 'Scheduled' | 'In Progress' | 'Cancelled';
}

interface HealthAlert {
  id: string;
  animalId: string;
  animalName: string;
  animalImage: string;
  type: 'Medication Due' | 'Checkup Due' | 'Vaccination Due' | 'Health Concern';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: string;
  description: string;
}

export const AnimalHealth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'records' | 'appointments' | 'alerts'>('records');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with real API calls
  const medicalRecords: MedicalRecord[] = [
    {
      id: '1',
      animalId: 'A001',
      animalName: 'Simba (Lion)',
      animalImage: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=100&h=100&fit=crop',
      date: '2024-01-15',
      type: 'Vaccination',
      veterinarian: 'Dr. Sarah Wanjiku',
      description: 'Annual vaccination and health checkup. All vitals normal.',
      medications: ['Rabies Vaccine', 'Multivitamin'],
      nextAppointment: '2024-07-15',
      status: 'Completed'
    },
    {
      id: '2',
      animalId: 'A002',
      animalName: 'Tembo (Elephant)',
      animalImage: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=100&h=100&fit=crop',
      date: '2024-01-18',
      type: 'Treatment',
      veterinarian: 'Dr. Sarah Wanjiku',
      description: 'Treatment for minor foot infection. Antibiotics prescribed.',
      medications: ['Amoxicillin', 'Anti-inflammatory'],
      status: 'In Progress'
    },
    {
      id: '3',
      animalId: 'A003',
      animalName: 'Twiga (Giraffe)',
      animalImage: 'https://images.unsplash.com/photo-1544966503-7cc8bb8c6c8b?w=100&h=100&fit=crop',
      date: '2024-01-20',
      type: 'Checkup',
      veterinarian: 'Dr. Peter Kimani',
      description: 'Routine health checkup. Weight and height measurements taken.',
      status: 'Completed'
    }
  ];

  const upcomingAppointments: MedicalRecord[] = [
    {
      id: '4',
      animalId: 'A004',
      animalName: 'Chui (Leopard)',
      animalImage: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=100&h=100&fit=crop',
      date: '2024-01-25',
      type: 'Checkup',
      veterinarian: 'Dr. Sarah Wanjiku',
      description: 'Scheduled routine health examination',
      status: 'Scheduled'
    },
    {
      id: '5',
      animalId: 'A005',
      animalName: 'Kiboko (Hippo)',
      animalImage: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=100&h=100&fit=crop',
      date: '2024-01-28',
      type: 'Vaccination',
      veterinarian: 'Dr. Peter Kimani',
      description: 'Annual vaccination schedule',
      status: 'Scheduled'
    }
  ];

  const healthAlerts: HealthAlert[] = [
    {
      id: '1',
      animalId: 'A006',
      animalName: 'Nyoka (Snake)',
      animalImage: 'https://images.unsplash.com/photo-1544966503-7cc8bb8b6c8b?w=100&h=100&fit=crop',
      type: 'Medication Due',
      priority: 'High',
      dueDate: '2024-01-23',
      description: 'Anti-parasitic medication due'
    },
    {
      id: '2',
      animalId: 'A007',
      animalName: 'Kifaru (Rhino)',
      animalImage: 'https://images.unsplash.com/photo-1544966503-7cc8bb8b6c8b?w=100&h=100&fit=crop',
      type: 'Checkup Due',
      priority: 'Medium',
      dueDate: '2024-01-30',
      description: 'Quarterly health checkup scheduled'
    },
    {
      id: '3',
      animalId: 'A008',
      animalName: 'Punda Milia (Zebra)',
      animalImage: 'https://images.unsplash.com/photo-1544966503-7cc8bb8b6c8b?w=100&h=100&fit=crop',
      type: 'Health Concern',
      priority: 'Critical',
      dueDate: '2024-01-22',
      description: 'Monitoring unusual behavior - requires immediate attention'
    }
  ];

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="lg:ml-56">
        <div className="p-3 lg:p-6">
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
            <Button onClick={() => {}} className="flex items-center">
              <Plus size={20} className="mr-2" /> Add Medical Record
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <Card padding="lg" className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-3">
                <FileText className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">248</h3>
              <p className="text-gray-600 dark:text-gray-400">Total Records</p>
            </Card>
            
            <Card padding="lg" className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-3">
                <Calendar className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">12</h3>
              <p className="text-gray-600 dark:text-gray-400">Upcoming Appointments</p>
            </Card>
            
            <Card padding="lg" className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg mx-auto mb-3">
                <AlertTriangle className="text-yellow-600 dark:text-yellow-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">3</h3>
              <p className="text-gray-600 dark:text-gray-400">Health Alerts</p>
            </Card>
            
            <Card padding="lg" className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-3">
                <Stethoscope className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">5</h3>
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
                    {medicalRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={record.animalImage}
                                alt={record.animalName}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {record.animalName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {record.animalId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{record.date}</div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(record.type)}`}>
                            {record.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {record.veterinarian}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs">
                          <div className="truncate">{record.description}</div>
                          {record.medications && (
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
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === 'appointments' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} padding="lg" className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <img
                      className="h-12 w-12 rounded-full object-cover mr-4"
                      src={appointment.animalImage}
                      alt={appointment.animalName}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {appointment.animalName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ID: {appointment.animalId}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Date:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {appointment.date}
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
              ))}
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              {healthAlerts.map((alert) => (
                <Card key={alert.id} padding="lg" className="border-l-4 border-l-yellow-400">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded-full object-cover mr-4"
                        src={alert.animalImage}
                        alt={alert.animalName}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {alert.animalName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ID: {alert.animalId}
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white mt-1">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(alert.priority)}`}>
                        {alert.priority}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Due: {alert.dueDate}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
