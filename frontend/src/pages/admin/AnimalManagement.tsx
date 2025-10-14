import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Sidebar } from '../../components/admin/Sidebar';
import { AnimalForm } from '../../components/admin/AnimalForm';
import { animalService } from '../../services/animalService';
import { Animal } from '../../types';
import toast from 'react-hot-toast';

export const AnimalManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'add' | 'edit'>('view');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredAnimals = animals.filter((animal) =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await animalService.getAll();
        setAnimals(response.animals);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch animals:', error);
        toast.error('Failed to load animals');
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="lg:ml-56 p-6">
          <p className="text-gray-600 dark:text-gray-400">Loading animals...</p>
        </div>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this animal?')) {
      try {
        await animalService.delete(id);
        setAnimals(animals.filter(a => a.id !== id));
        toast.success('Animal deleted successfully');
      } catch (error) {
        toast.error('Failed to delete animal');
      }
    }
  };

  const handleViewAnimal = (animal: Animal) => {
    setSelectedAnimal(animal);
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleEditAnimal = (animal: Animal) => {
    setSelectedAnimal(animal);
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleAddAnimal = () => {
    setSelectedAnimal(null);
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAnimal(null);
    setIsSubmitting(false);
  };

  const handleAnimalSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (modalType === 'add') {
        await animalService.create(data, []); // Pass empty array for photos
        toast.success('Animal created successfully');
        // Refresh animals list
        const response = await animalService.getAll();
        setAnimals(response.animals);
      } else if (modalType === 'edit' && selectedAnimal) {
        await animalService.update(selectedAnimal.id, data);
        toast.success('Animal updated successfully');
        // Refresh animals list
        const response = await animalService.getAll();
        setAnimals(response.animals);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save animal:', error);
      toast.error('Failed to save animal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="lg:ml-56">
        <div className="p-3 lg:p-6">
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
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleAddAnimal}
            >
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
                  {filteredAnimals.map((animal) => (
                    <tr key={animal.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={animal.imageUrl || 'https://via.placeholder.com/50'}
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
                        {animal.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {animal.age || 'N/A'} {animal.age ? 'years' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {animal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewAnimal(animal)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditAnimal(animal)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(animal.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={
              modalType === 'view' ? 'Animal Details' :
              modalType === 'edit' ? 'Edit Animal' :
              'Add New Animal'
            }
            size={modalType === 'view' ? 'md' : 'lg'}
          >
            {modalType === 'view' && selectedAnimal ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedAnimal.imageUrl || 'https://via.placeholder.com/100'}
                    alt={selectedAnimal.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedAnimal.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 italic">
                      {selectedAnimal.species}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedAnimal.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Category</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedAnimal.category}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Status</h4>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      {selectedAnimal.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Habitat</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {typeof selectedAnimal.habitat === 'string' ? selectedAnimal.habitat : selectedAnimal.habitat?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Diet</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedAnimal.diet}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Lifespan</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedAnimal.lifespan}
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <Button variant="outline" onClick={handleCloseModal}>
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <AnimalForm
                animal={selectedAnimal || undefined}
                onSubmit={handleAnimalSubmit}
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

