import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AdminLayout } from '../../components/admin/AdminLayout';

export const DebugPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
        
        <div className="space-y-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
            <p><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'No user'}</p>
          </div>

          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">User Role Check</h2>
            <p><strong>User Role:</strong> {user?.role || 'No role'}</p>
            <p><strong>Is Admin:</strong> {user?.role === 'ADMIN' || user?.role === 'admin' ? 'Yes' : 'No'}</p>
            <p><strong>Role Check Details:</strong></p>
            <ul className="ml-4">
              <li>user?.role === 'ADMIN': {user?.role === 'ADMIN' ? 'Yes' : 'No'}</li>
              <li>user?.role === 'admin': {user?.role === 'admin' ? 'Yes' : 'No'}</li>
              <li>user?.role value: "{user?.role}"</li>
            </ul>
          </div>

          <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Environment Check</h2>
            <p><strong>Current URL:</strong> {window.location.href}</p>
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            <p><strong>Supabase URL:</strong> {process.env.REACT_APP_SUPABASE_URL || 'Using fallback'}</p>
          </div>

          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Page Status</h2>
            <p><strong>Page Loaded:</strong> Yes</p>
            <p><strong>Component Rendered:</strong> Yes</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

