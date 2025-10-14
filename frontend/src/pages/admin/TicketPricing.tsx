import React, { useState, useEffect } from 'react';
import { Plus, Edit, Save, DollarSign } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Sidebar } from '../../components/admin/Sidebar';
import { ticketService, TicketPrice } from '../../services/ticketService';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

export const TicketPricing: React.FC = () => {
  const [ticketPrices, setTicketPrices] = useState<TicketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPrice, setEditingPrice] = useState<TicketPrice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPrice(null);
    setIsSubmitting(false);
  };

  const handleSubmitPrice = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingPrice) {
        await ticketService.update(editingPrice.ticketType, data);
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
    { ticketType: 'adult', price: 1500, description: 'Ages 13-64' },
    { ticketType: 'child', price: 750, description: 'Ages 3-12' },
    { ticketType: 'senior', price: 1000, description: 'Ages 65+' }
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="lg:ml-56 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading ticket prices...</p>
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
                Ticket Pricing
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage ticket prices for different visitor types
              </p>
            </div>
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
          </div>

          {/* Ticket Prices */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ticketPrices.map((price) => (
              <Card key={price.id} padding="lg" className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-light dark:bg-primary/20 rounded-full flex items-center justify-center">
                      <DollarSign size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                        {price.ticketType}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {price.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPrice(price)}
                  >
                    <Edit size={16} />
                  </Button>
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
                    price.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {price.isActive ? 'Active' : 'Inactive'}
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

          {/* Edit Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={`Edit ${editingPrice?.ticketType} Price`}
            size="md"
          >
            <TicketPriceForm
              price={editingPrice}
              onSubmit={handleSubmitPrice}
              onCancel={handleCloseModal}
              isLoading={isSubmitting}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

// Ticket Price Form Component
interface TicketPriceFormProps {
  price?: TicketPrice | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const TicketPriceForm: React.FC<TicketPriceFormProps> = ({
  price,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    price: price?.price || 0,
    description: price?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Price (KSh)"
          type="number"
          placeholder="Enter price in Kenyan Shillings"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          min="0"
          step="50"
        />
      </div>

      <div>
        <Input
          label="Description"
          placeholder="e.g., Ages 13-64"
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
          Save Price
        </Button>
      </div>
    </form>
  );
};
