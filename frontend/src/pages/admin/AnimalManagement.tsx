import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Calendar, User } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AnimalForm } from '../../components/admin/AnimalForm';
import { animalService } from '../../services/animalService';
import { Animal } from '../../types';
import toast from 'react-hot-toast';

// Helper function to get appropriate animal images
const getRandomAnimalImage = (category: string): string => {
  const animalImages: { [key: string]: string } = {
    'mammal': '1578662995465-a23e8b835052', // Lion
    'Mammals': '1578662995465-a23e8b835052',
    'bird': '1559827260-dc66d52bef19', // Eagle
    'Birds': '1559827260-dc66d52bef19',
    'reptile': '1559827260-dc66d52bef19', // Snake
    'Reptiles': '1559827260-dc66d52bef19',
    'fish': '1559827260-dc66d52bef19', // Fish
    'Fish': '1559827260-dc66d52bef19',
    'amphibian': '1559827260-dc66d52bef19', // Frog
    'Amphibians': '1559827260-dc66d52bef19',
    'invertebrate': '1559827260-dc66d52bef19', // Butterfly
    'Invertebrates': '1559827260-dc66d52bef19',
  };
  
  return animalImages[category] || '1559827260-dc66d52bef19'; // Default to eagle
};

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
      <AdminLayout>
        <p className="text-gray-600 dark:text-gray-400">Loading animals...</p>
      </AdminLayout>
    );
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this animal permanently?')) return;
    try {
      await toast.promise(
        animalService.delete(id as any),
        {
          loading: 'Deleting animal…',
          success: 'Animal deleted',
          error: 'Failed to delete animal',
        }
      );
      setAnimals(animals.filter(a => a.id !== id));
    } catch (error) {
      // handled by toast
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
      console.log('Form data received:', data); // Debug log
      
      if (modalType === 'add') {
        // The form data should already match what the service expects
        console.log('Mapped animal data:', data); // Debug log
        
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
      console.error('Error details:', error); // More detailed error logging
      
      // Handle error with proper typing
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to save animal: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Animal Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage all animals in the zoo
              </p>
            </div>
            <Button 
              variant="primary" 
              size="md"
              onClick={handleAddAnimal}
            >
              <Plus size={18} className="mr-2" />
              Add New Animal
            </Button>
          </div>

          {/* Search and Filters */}
          <Card padding="lg" className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center flex-1 space-x-4">
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
              
            </div>
          </Card>

          {/* Animals List - Desktop Table / Mobile Cards */}
          <Card padding="lg">
            {/* Desktop List View */}
            <div className="hidden lg:block space-y-3">
              {filteredAnimals.length > 0 ? (
                filteredAnimals.map((animal) => (
                  <div key={animal.id} className="flex items-center p-3 gap-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    {/* Image */}
                    <img
                      src={animal.image_url || animal.imageUrl || `https://images.unsplash.com/photo-${getRandomAnimalImage(animal.category)}?w=64&h=64&fit=crop&crop=center`}
                      alt={animal.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = `https://images.unsplash.com/photo-${getRandomAnimalImage(animal.category)}?w=80&h=80&fit=crop&crop=center`;
                      }}
                    />
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-base text-gray-900 dark:text-white truncate">
                            {animal.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            {animal.species}
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 ml-2 flex-shrink-0">
                          {animal.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span><strong>Type:</strong> {animal.category}</span>
                        <span><strong>Lifespan:</strong> {animal.lifespan || 'N/A'}</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewAnimal(animal)}
                        className="p-2"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAnimal(animal)}
                        className="p-2"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(animal.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No animals found
                </div>
              )}
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filteredAnimals.length > 0 ? (
                filteredAnimals.map((animal) => (
                  <div 
                    key={animal.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                    onClick={() => handleViewAnimal(animal)}
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={animal.image_url || animal.imageUrl || `https://images.unsplash.com/photo-${getRandomAnimalImage(animal.category)}?w=64&h=64&fit=crop&crop=center`}
                        alt={animal.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = `https://images.unsplash.com/photo-${getRandomAnimalImage(animal.category)}?w=80&h=80&fit=crop&crop=center`;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-base truncate">
                              {animal.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">
                              {animal.species}
                            </p>
                          </div>
                          <span className="px-2 py-1 rounded-full text-xs font-semibold ml-2 flex-shrink-0 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            {animal.status}
                          </span>
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <User size={14} className="mr-1" />
                            <span>{animal.category}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            <span>{animal.lifespan || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No animals found
                </div>
              )}
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
                    src={selectedAnimal.image_url || selectedAnimal.imageUrl || `https://images.unsplash.com/photo-${getRandomAnimalImage(selectedAnimal.category)}?w=100&h=100&fit=crop&crop=center`}
                    alt={selectedAnimal.name}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      e.currentTarget.src = `https://images.unsplash.com/photo-${getRandomAnimalImage(selectedAnimal.category)}?w=100&h=100&fit=crop&crop=center`;
                    }}
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

                <div className="flex justify-between items-center pt-4">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleCloseModal();
                        handleEditAnimal(selectedAnimal);
                      }}
                      className="flex items-center space-x-2"
                    >
                      <Edit size={16} />
                      <span>Edit Animal</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleCloseModal();
                        handleDelete(selectedAnimal.id);
                      }}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      <span>Delete Animal</span>
                    </Button>
                  </div>
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
    </AdminLayout>
  );
};

