import React from 'react';
import { useForm } from 'react-hook-form';
import { StaffMember } from '../../services/staffService';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface StaffFormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface StaffFormProps {
  staff?: StaffMember;
  onSubmit: (data: StaffFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const StaffForm: React.FC<StaffFormProps> = ({
  staff,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<StaffFormData>({
    defaultValues: staff ? {
      name: staff.name,
      email: staff.email,
      password: '', // Don't pre-fill password for editing
      role: staff.role
    } : {
      name: '',
      email: '',
      password: '',
      role: 'STAFF'
    }
  });

  const handleFormSubmit = (data: StaffFormData) => {
    onSubmit(data);
  };

  const roles = ['ADMIN', 'STAFF', 'VISITOR'];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Full Name"
            placeholder="Enter full name"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
        </div>

        <div>
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            error={errors.email?.message}
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label={staff ? "New Password (leave blank to keep current)" : "Password"}
            type="password"
            placeholder={staff ? "Enter new password" : "Enter password"}
            error={errors.password?.message}
            {...register('password', { 
              required: !staff ? 'Password is required' : false,
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Role
          </label>
          <select
            {...register('role', { required: 'Role is required' })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.role.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {staff ? 'Update Staff Member' : 'Create Staff Member'}
        </Button>
      </div>
    </form>
  );
};
