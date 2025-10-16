import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { HealthRecord } from '../../services/healthService';
import { animalService } from '../../services/animalService';
import { Animal } from '../../types/animal';
import toast from 'react-hot-toast';

interface HealthRecordFormData {
  animal_id: string;
  type: string;
  description: string;
  veterinarian: string;
  medications: string;
  next_appointment: string;
  status: string;
}

interface HealthRecordFormProps {
  record?: HealthRecord | null;
  onSubmit: (data: HealthRecordFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const HealthRecordForm: React.FC<HealthRecordFormProps> = ({
  record,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loadingAnimals, setLoadingAnimals] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<HealthRecordFormData>({
    defaultValues: record ? {
      animal_id: record.animal_id,
      type: record.type,
      description: record.description,
      veterinarian: record.veterinarian,
      medications: record.medications.join(', '),
      next_appointment: record.next_appointment ? record.next_appointment.split('T')[0] : '',
      status: record.status
    } : {
      animal_id: '',
      type: 'CHECKUP',
      description: '',
      veterinarian: '',
      medications: '',
      next_appointment: '',
      status: 'SCHEDULED'
    }
  });

  // Fetch animals for dropdown
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        setLoadingAnimals(true);
        const response = await animalService.getAll();
        setAnimals(response.animals || []);
      } catch (error) {
        console.error('Failed to fetch animals:', error);
        toast.error('Failed to load animals');
      } finally {
        setLoadingAnimals(false);
      }
    };

    fetchAnimals();
  }, []);

  const handleFormSubmit = (data: HealthRecordFormData) => {
    // Convert medications string to array
    const medicationsArray = data.medications 
      ? data.medications.split(',').map(med => med.trim()).filter(med => med.length > 0)
      : [];

    onSubmit({
      ...data,
      medications: medicationsArray.join(', ')
    });
  };

  return (
    <Modal isOpen={true} onClose={onCancel} title={record ? 'Edit Health Record' : 'Add Health Record'}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Animal *
          </label>
          {loadingAnimals ? (
            <div className="text-sm text-gray-500">Loading animals...</div>
          ) : (
            <select
              {...register('animal_id', { required: 'Animal is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select an animal</option>
              {animals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name} ({animal.species})
                </option>
              ))}
            </select>
          )}
          {errors.animal_id && (
            <p className="text-red-500 text-sm mt-1">{errors.animal_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type *
          </label>
          <select
            {...register('type', { required: 'Type is required' })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="CHECKUP">Checkup</option>
            <option value="VACCINATION">Vaccination</option>
            <option value="TREATMENT">Treatment</option>
            <option value="EMERGENCY">Emergency</option>
            <option value="SURGERY">Surgery</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>

        <div>
          <Input
            label="Description *"
            placeholder="Enter detailed description of the health record"
            {...register('description', { required: 'Description is required' })}
            error={errors.description?.message}
          />
        </div>

        <div>
          <Input
            label="Veterinarian *"
            placeholder="Enter veterinarian name"
            {...register('veterinarian', { required: 'Veterinarian is required' })}
            error={errors.veterinarian?.message}
          />
        </div>

        <div>
          <Input
            label="Medications"
            placeholder="Enter medications (comma-separated)"
            {...register('medications')}
            error={errors.medications?.message}
          />
        </div>

        <div>
          <Input
            label="Next Appointment"
            type="date"
            {...register('next_appointment')}
            error={errors.next_appointment?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="SCHEDULED">Scheduled</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {record ? 'Update Record' : 'Create Record'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
