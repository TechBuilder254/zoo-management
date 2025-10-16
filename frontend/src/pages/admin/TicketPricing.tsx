import React, { useState, useEffect } from 'react';
import { Plus, Edit, Save, DollarSign, Trash2 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ticketService, TicketPrice } from '../../services/ticketService';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

export const TicketPricing: React.FC = () => {
  const [ticketPrices, setTicketPrices] = useState<TicketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPrice, setEditingPrice] = useState<TicketPrice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [deletingPrice, setDeletingPrice] = useState<TicketPrice | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch ticket prices
  useEffect(() => {
    const fetchTicketPrices = async () => {
      try {
        const data = await ticketService.getAll();
        setTicketPrices(data);
      } catch (error) {
        console.error('Failed to fetch ticket prices:', error);
        toast.error('Failed to load ticket prices');
      } finally {
        setLoading(false);
      }
    };

    fetchTicketPrices();
  }, []);

  const handleEditPrice = (price: TicketPrice) => {
    setEditingPrice(price);
    setIsCreatingNew(false);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingPrice(null);
    setIsCreatingNew(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPrice(null);
    setIsCreatingNew(false);
    setIsSubmitting(false);
  };

  const handleDeletePrice = (price: TicketPrice) => {
    setDeletingPrice(price);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPrice) return;
    
    setIsSubmitting(true);
    try {
      await ticketService.delete(deletingPrice.id);
      toast.success('Ticket price deleted successfully');
      
      // Refresh prices
      const updatedPrices = await ticketService.getAll();
      setTicketPrices(updatedPrices);
      setShowDeleteModal(false);
      setDeletingPrice(null);
    } catch (error) {
      console.error('Failed to delete ticket price:', error);
      toast.error('Failed to delete ticket price');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingPrice(null);
  };

  const handleSubmitPrice = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingPrice) {
        await ticketService.update(editingPrice.ticket_type, data);
        toast.success('Ticket price updated successfully');
      } else {
        await ticketService.create(data);
        toast.success('Ticket price created successfully');
      }
      
      // Refresh prices
      const updatedPrices = await ticketService.getAll();
      setTicketPrices(updatedPrices);
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save ticket price:', error);
      toast.error('Failed to save ticket price');
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultPrices = [
    { ticket_type: 'adult', price: 1500, description: 'Ages 13-64' },
    { ticket_type: 'child', price: 750, description: 'Ages 3-12' },
    { ticket_type: 'senior', price: 1000, description: 'Ages 65+' }
  ];

  const initializeDefaultPrices = async () => {
    setIsSubmitting(true);
    try {
      for (const price of defaultPrices) {
        await ticketService.create(price);
      }
      toast.success('Default ticket prices initialized');
      const updatedPrices = await ticketService.getAll();
      setTicketPrices(updatedPrices);
    } catch (error) {
      console.error('Failed to initialize prices:', error);
      toast.error('Failed to initialize default prices');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading ticket prices...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Ticket Pricing
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage ticket prices for different visitor types
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
              {ticketPrices.length === 0 && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={initializeDefaultPrices}
                  isLoading={isSubmitting}
                >
                  <Plus size={16} className="mr-2" />
                  Initialize Default Prices
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddNew}
                disabled={isSubmitting}
              >
                <Plus size={16} className="mr-2" />
                Add New Pricing
              </Button>
            </div>
          </div>

          {/* Ticket Prices */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {ticketPrices.map((price) => (
              <Card key={price.id} padding="lg" className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-light dark:bg-primary/20 rounded-full flex items-center justify-center">
                      <DollarSign size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                        {price.ticket_type}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {price.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPrice(price)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePrice(price)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatCurrency(price.price)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Kenyan Shillings
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    price.is_active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {price.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {ticketPrices.length === 0 && (
            <Card padding="lg" className="text-center">
              <DollarSign size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Ticket Prices Set
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Initialize default ticket prices to get started.
              </p>
              <Button
                variant="primary"
                onClick={initializeDefaultPrices}
                isLoading={isSubmitting}
              >
                <Plus size={16} className="mr-2" />
                Initialize Default Prices
              </Button>
            </Card>
          )}

          {/* Edit/Create Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={isCreatingNew ? 'Add New Ticket Price' : `Edit ${editingPrice?.ticket_type} Price`}
            size="md"
          >
            <TicketPriceForm
              price={editingPrice}
              isCreatingNew={isCreatingNew}
              onSubmit={handleSubmitPrice}
              onCancel={handleCloseModal}
              isLoading={isSubmitting}
            />
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={showDeleteModal}
            onClose={handleCancelDelete}
            title="Delete Ticket Price"
            size="sm"
          >
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Delete Ticket Price
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete the <strong>{deletingPrice?.ticket_type}</strong> ticket price? 
                  This action cannot be undone.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancelDelete}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  variant="primary" 
                  onClick={handleConfirmDelete}
                  isLoading={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Permanently
                </Button>
              </div>
            </div>
          </Modal>
      </AdminLayout>
    );
};

// Ticket Price Form Component
interface TicketPriceFormProps {
  price?: TicketPrice | null;
  isCreatingNew?: boolean;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const TicketPriceForm: React.FC<TicketPriceFormProps> = ({
  price,
  isCreatingNew = false,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    ticket_type: price?.ticket_type || '',
    price: price?.price || '',
    description: price?.description || ''
  });

  // Update form data when price changes
  useEffect(() => {
    if (price) {
      setFormData({
        ticket_type: price.ticket_type || '',
        price: price.price || '',
        description: price.description || ''
      });
    } else {
      setFormData({
        ticket_type: '',
        price: '',
        description: ''
      });
    }
  }, [price]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingNew && !formData.ticket_type.trim()) {
      toast.error('Ticket type is required');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isCreatingNew && (
        <div>
          <Input
            label="Ticket Type"
            placeholder="e.g., adult, child, senior, student"
            value={formData.ticket_type}
            onChange={(e) => setFormData({ ...formData, ticket_type: e.target.value })}
            required
          />
        </div>
      )}

      <div>
        <Input
          label="Price (KSh)"
          type="number"
          placeholder="Enter price in Kenyan Shillings"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          min="0"
          step="50"
          required
        />
      </div>

      <div>
        <Input
          label="Description"
          placeholder="e.g., Ages 13-64, Student discount, etc."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          <Save size={16} className="mr-2" />
          {isCreatingNew ? 'Create Price' : 'Save Price'}
        </Button>
      </div>
    </form>
  );
};
