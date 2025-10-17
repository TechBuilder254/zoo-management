import React, { useState } from 'react';
import { AdminHeader } from './AdminHeader';
import { Sidebar } from './Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <AdminHeader onMenuToggle={handleMenuToggle} />
      
      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileMenuOpen} onMobileClose={handleMobileClose} />
      
      {/* Main Content */}
      <div className="lg:ml-56 pt-16">
        <div className="p-3 lg:p-6 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
};


