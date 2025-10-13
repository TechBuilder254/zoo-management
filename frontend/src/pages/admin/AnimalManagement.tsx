import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Sidebar } from '../../components/admin/Sidebar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const AnimalManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with real API call
  const animals = [
    {
      id: '1',
      name: 'Leo',
      species: 'Panthera leo',
      type: 'Mammal',
      age: 5,
      status: 'Healthy',
      image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=100&h=100&fit=crop',
    },
    {
      id: '2',
      name: 'Dumbo',
      species: 'Loxodonta africana',
      type: 'Mammal',
      age: 12,
      status: 'Healthy',
      image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=100&h=100&fit=crop',
    },
    {
      id: '3',
      name: 'Gerald',
      species: 'Giraffa camelopardalis',
      type: 'Mammal',
      age: 8,
      status: 'Healthy',
      image: 'https://images.unsplash.com/photo-1534567110243-a640b778fc7a?w=100&h=100&fit=crop',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Animal Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage all animals in the zoo
              </p>
            </div>
            <Button variant="primary" size="lg">
              <Plus size={20} className="mr-2" />
              Add New Animal
            </Button>
          </div>

          {/* Search and Filters */}
          <Card padding="lg" className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search animals by name or species..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={18} />}
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option value="">All Types</option>
                <option value="mammal">Mammal</option>
                <option value="bird">Bird</option>
                <option value="reptile">Reptile</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option value="">All Status</option>
                <option value="healthy">Healthy</option>
                <option value="sick">Sick</option>
                <option value="recovering">Recovering</option>
              </select>
            </div>
          </Card>

          {/* Animals Table */}
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Animal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Species
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {animals.map((animal) => (
                    <tr key={animal.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={animal.image}
                            alt={animal.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span className="ml-3 font-medium text-gray-900 dark:text-white">
                            {animal.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400 italic">
                        {animal.species}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {animal.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {animal.age} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {animal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

