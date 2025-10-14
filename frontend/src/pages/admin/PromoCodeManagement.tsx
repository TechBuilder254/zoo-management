import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Copy, Check } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Sidebar } from '../../components/admin/Sidebar';
import { promoService, PromoCode } from '../../services/promoService';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

export const PromoCodeManagement: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPromo, setSelectedPromo] = useState<PromoCode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Fetch promo codes
  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const data = await promoService.getAll();
        setPromoCodes(data);
      } catch (error) {
        console.error('Failed to fetch promo codes:', error);
        toast.error('Failed to load promo codes');
      } finally {
        setLoading(false);
      }
    };

    fetchPromoCodes();
  }, []);

  const handleCreatePromo = () => {
    setSelectedPromo(null);
    setModalType('create');
    setIsModalOpen(true);
  };

  const handleEditPromo = (promo: PromoCode) => {
    setSelectedPromo(promo);
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleViewPromo = (promo: PromoCode) => {
    setSelectedPromo(promo);
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleDeletePromo = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this promo code?')) {
      try {
        await promoService.delete(id);
        toast.success('Promo code deleted successfully');
        const updatedPromos = await promoService.getAll();
        setPromoCodes(updatedPromos);
      } catch (error) {
        console.error('Failed to delete promo code:', error);
        toast.error('Failed to delete promo code');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPromo(null);
    setIsSubmitting(false);
  };

  const handleSubmitPromo = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (modalType === 'create') {
        await promoService.create(data);
        toast.success('Promo code created successfully');
      } else if (modalType === 'edit' && selectedPromo) {
        await promoService.update(selectedPromo.id, data);
        toast.success('Promo code updated successfully');
      }
      
      const updatedPromos = await promoService.getAll();
      setPromoCodes(updatedPromos);
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save promo code:', error);
      toast.error('Failed to save promo code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success('Promo code copied to clipboard!');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy promo code');
    }
  };

  const getStatusColor = (promo: PromoCode) => {
    const now = new Date();
    const isActive = promo.isActive ?? promo.is_active ?? true;
    const validFrom = promo.validFrom || promo.valid_from;
    const validUntil = promo.validUntil || promo.valid_until;
    const maxUses = promo.maxUses ?? promo.max_uses;
    const usedCount = promo.usedCount ?? promo.used_count ?? 0;
    
    if (!isActive) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    if (validFrom && now < new Date(validFrom)) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (validUntil && now > new Date(validUntil)) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    if (maxUses && usedCount >= maxUses) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  };

  const getStatusText = (promo: PromoCode) => {
    const now = new Date();
    const isActive = promo.isActive ?? promo.is_active ?? true;
    const validFrom = promo.validFrom || promo.valid_from;
    const validUntil = promo.validUntil || promo.valid_until;
    const maxUses = promo.maxUses ?? promo.max_uses;
    const usedCount = promo.usedCount ?? promo.used_count ?? 0;
    
    if (!isActive) return 'Inactive';
    if (validFrom && now < new Date(validFrom)) return 'Scheduled';
    if (validUntil && now > new Date(validUntil)) return 'Expired';
    if (maxUses && usedCount >= maxUses) return 'Max Uses Reached';
    return 'Active';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="lg:ml-56 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading promo codes...</p>
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
                Promo Code Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create and manage discount promo codes
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreatePromo}
            >
              <Plus size={16} className="mr-2" />
              Create Promo Code
            </Button>
          </div>

          {/* Promo Codes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promoCodes.map((promo) => (
              <Card key={promo.id} padding="lg" className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-light dark:bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">
                        {promo.code.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {promo.code}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {promo.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(promo.code)}
                    >
                      {copiedCode === promo.code ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPromo(promo)}
                    >
                      <Edit size={16} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Discount:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {(promo.discountType || promo.discount_type) === 'PERCENTAGE' 
                        ? `${promo.discountValue || promo.discount_value || 0}%`
                        : formatCurrency(promo.discountValue || promo.discount_value)
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Usage:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {promo.usedCount || promo.used_count || 0} / {promo.maxUses || promo.max_uses || '∞'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Valid Until:</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      {new Date(promo.validUntil || promo.valid_until || new Date()).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(promo)}`}>
                      {getStatusText(promo)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPromo(promo)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeletePromo(promo.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {promoCodes.length === 0 && (
            <Card padding="lg" className="text-center">
              <Plus size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Promo Codes
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first promo code to start offering discounts.
              </p>
              <Button variant="primary" onClick={handleCreatePromo}>
                <Plus size={16} className="mr-2" />
                Create Promo Code
              </Button>
            </Card>
          )}

          {/* Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={
              modalType === 'create' ? 'Create Promo Code' :
              modalType === 'edit' ? 'Edit Promo Code' :
              'Promo Code Details'
            }
            size={modalType === 'view' ? 'md' : 'lg'}
          >
            {modalType === 'view' && selectedPromo ? (
              <PromoCodeView promo={selectedPromo} />
            ) : (
              <PromoCodeForm
                promo={selectedPromo}
                onSubmit={handleSubmitPromo}
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

// Promo Code Form Component
interface PromoCodeFormProps {
  promo?: PromoCode | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const PromoCodeForm: React.FC<PromoCodeFormProps> = ({
  promo,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    code: promo?.code || '',
    description: promo?.description || '',
    discountType: promo?.discountType || promo?.discount_type || 'PERCENTAGE',
    discountValue: promo?.discountValue || promo?.discount_value || 0,
    maxUses: promo?.maxUses || promo?.max_uses || '',
    validFrom: (promo?.validFrom || promo?.valid_from) ? new Date(promo.validFrom || promo.valid_from || new Date()).toISOString().split('T')[0] : '',
    validUntil: (promo?.validUntil || promo?.valid_until) ? new Date(promo.validUntil || promo.valid_until || new Date()).toISOString().split('T')[0] : '',
    isActive: promo?.isActive ?? promo?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.discountValue || !formData.validFrom || !formData.validUntil) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.discountValue <= 0) {
      toast.error('Discount value must be greater than 0');
      return;
    }

    if (formData.discountType === 'PERCENTAGE' && formData.discountValue > 100) {
      toast.error('Percentage discount cannot exceed 100%');
      return;
    }

    const submitData = {
      ...formData,
      maxUses: formData.maxUses ? Number(formData.maxUses) : null
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Promo Code *"
            placeholder="e.g., WILDLIFE10"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          />
        </div>

        <div>
          <Input
            label="Description"
            placeholder="e.g., 10% off for wildlife lovers"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Discount Type *
          </label>
          <select
            value={formData.discountType}
            onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'PERCENTAGE' | 'FIXED_AMOUNT' })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED_AMOUNT">Fixed Amount (KSh)</option>
          </select>
        </div>

        <div>
          <Input
            label={`Discount Value ${formData.discountType === 'PERCENTAGE' ? '(%)' : '(KSh)'} *`}
            type="number"
            placeholder={formData.discountType === 'PERCENTAGE' ? '10' : '100'}
            value={formData.discountValue}
            onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
            min="0"
            max={formData.discountType === 'PERCENTAGE' ? '100' : undefined}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input
            label="Max Uses"
            type="number"
            placeholder="Leave empty for unlimited"
            value={formData.maxUses}
            onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
            min="1"
          />
        </div>

        <div>
          <Input
            label="Valid From *"
            type="date"
            value={formData.validFrom}
            onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
          />
        </div>

        <div>
          <Input
            label="Valid Until *"
            type="date"
            value={formData.validUntil}
            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Active
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {promo ? 'Update Promo Code' : 'Create Promo Code'}
        </Button>
      </div>
    </form>
  );
};

// Promo Code View Component
interface PromoCodeViewProps {
  promo: PromoCode;
}

const PromoCodeView: React.FC<PromoCodeViewProps> = ({ promo }) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {promo.code}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {promo.description || 'No description'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">Discount</h4>
          <p className="text-gray-600 dark:text-gray-400">
            {(promo.discountType || promo.discount_type) === 'PERCENTAGE' 
              ? `${promo.discountValue || promo.discount_value || 0}%`
              : formatCurrency(promo.discountValue || promo.discount_value)
            }
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">Usage</h4>
          <p className="text-gray-600 dark:text-gray-400">
            {promo.usedCount || promo.used_count || 0} / {promo.maxUses || promo.max_uses || '∞'}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">Valid From</h4>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date(promo.validFrom || promo.valid_from || new Date()).toLocaleDateString()}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">Valid Until</h4>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date(promo.validUntil || promo.valid_until || new Date()).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button variant="outline" onClick={() => window.close()}>
          Close
        </Button>
      </div>
    </div>
  );
};
