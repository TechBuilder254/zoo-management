import React from 'react';
import { useForm } from 'react-hook-form';
import { User as UserIcon, Mail, Phone, Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { UpdateProfileData } from '../types';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import toast from 'react-hot-toast';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateProfileData>({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      phone: user?.phone,
      newsletterSubscribed: user?.newsletterSubscribed,
    },
  });

  const onSubmit = async (data: UpdateProfileData) => {
    setIsUpdating(true);
    try {
      const updatedUser = await authService.updateProfile(data);
      updateUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <Card padding="lg">
          {/* Profile Header */}
          <div className="flex items-center space-x-4 pb-6 border-b dark:border-gray-700 mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary-light text-primary text-sm font-medium rounded-full">
                {user.role === 'admin' ? 'Administrator' : 'Visitor'}
              </span>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                type="text"
                icon={<UserIcon size={18} />}
                error={errors.firstName?.message}
                {...register('firstName', {
                  required: 'First name is required',
                })}
              />

              <Input
                label="Last Name"
                type="text"
                icon={<UserIcon size={18} />}
                error={errors.lastName?.message}
                {...register('lastName', {
                  required: 'Last name is required',
                })}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              value={user.email}
              disabled
              icon={<Mail size={18} />}
              helperText="Email cannot be changed"
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              icon={<Phone size={18} />}
              error={errors.phone?.message}
              {...register('phone')}
            />

            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Bell className="text-primary" size={20} />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  Newsletter Subscription
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive updates about events and special offers
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('newsletterSubscribed')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light dark:peer-focus:ring-primary rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isUpdating}
                className="flex-1"
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => window.location.reload()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};




