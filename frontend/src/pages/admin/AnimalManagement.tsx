import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, PawPrint, Grid, List } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Sidebar } from '../../components/admin/Sidebar';
import { AnimalForm } from '../../components/admin/AnimalForm';
import { animalService } from '../../services/animalService';
import { Animal } from '../../types';
import toast from 'react-hot-toast';

type ViewMode = 'grid' | 'list';

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
  const [viewMode, setViewMode] = useState<ViewMode>('list'); // Default to list view
  
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
              
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-800 text-primary shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="List view"
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-800 text-primary shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Grid view"
                >
                  <Grid size={18} />
                </button>
              </div>
            </div>
          </Card>

          {/* Animals Display */}
          {viewMode === 'list' ? (
            // List View
            <div className="space-y-3">
              {filteredAnimals.map((animal) => (
                <Card key={animal.id} padding="none" hover className="overflow-hidden">
                  <div className="flex items-center p-3 gap-3">
                    {/* Image */}
                    <img
                      src={animal.image_url || animal.imageUrl || `https://images.unsplash.com/photo-${getRandomAnimalImage(animal.category)}?w=64&h=64&fit=crop&crop=center`}
                      alt={animal.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
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
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                            {animal.species}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 ml-2 flex-shrink-0">
                          {animal.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-600 dark:text-gray-400">
                        <span><strong>Type:</strong> {animal.category}</span>
                        <span><strong>Age:</strong> {animal.age || 'N/A'} {animal.age ? 'years' : ''}</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewAnimal(animal)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditAnimal(animal)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleDelete(animal.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            // Grid View
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredAnimals.map((animal) => (
                <Card key={animal.id} padding="none" hover className="transition-all duration-200">
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <img
                          src={animal.image_url || animal.imageUrl || `https://images.unsplash.com/photo-${getRandomAnimalImage(animal.category)}?w=48&h=48&fit=crop&crop=center`}
                          alt={animal.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                          onError={(e) => {
                            e.currentTarget.src = `https://images.unsplash.com/photo-${getRandomAnimalImage(animal.category)}?w=48&h=48&fit=crop&crop=center`;
                          }}
                        />
                        <div>
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">
                            {animal.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                            {animal.species}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 flex-shrink-0">
                        {animal.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Type:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{animal.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Age:</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {animal.age || 'N/A'} {animal.age ? 'years' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-1 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewAnimal(animal)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAnimal(animal)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleDelete(animal.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {filteredAnimals.length === 0 && (
            <Card padding="lg" className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                <PawPrint size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No animals found</h3>
                <p className="text-sm">Try adjusting your search criteria or add a new animal.</p>
              </div>
            </Card>
          )}

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
                    className="w-16 h-16 rounded-lg object-cover"
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

