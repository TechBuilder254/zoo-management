import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PawPrint, Ticket, MessageSquare, BarChart3, Settings, LogOut, Users, Heart, Calendar, DollarSign, X, Tag } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const location = useLocation();
  const { logout } = useAuth();



  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
    },
    {
      path: '/admin/animals',
      icon: <PawPrint size={20} />,
      label: 'Animals',
    },
    {
      path: '/admin/bookings',
      icon: <Ticket size={20} />,
      label: 'Bookings',
    },
    {
      path: '/admin/reviews',
      icon: <MessageSquare size={20} />,
      label: 'Reviews',
    },
    {
      path: '/admin/staff',
      icon: <Users size={20} />,
      label: 'Staff Management',
    },
    {
      path: '/admin/health',
      icon: <Heart size={20} />,
      label: 'Animal Health',
    },
    {
      path: '/admin/events',
      icon: <Calendar size={20} />,
      label: 'Events & Programs',
    },
    {
      path: '/admin/ticket-pricing',
      icon: <DollarSign size={20} />,
      label: 'Ticket Pricing',
    },
    {
      path: '/admin/promo-codes',
      icon: <Tag size={20} />,
      label: 'Promo Codes',
    },
    {
      path: '/admin/financial',
      icon: <BarChart3 size={20} />,
      label: 'Financial',
    },
    {
      path: '/admin/settings',
      icon: <Settings size={20} />,
      label: 'Settings',
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay - Only show on mobile when sidebar is open */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden"
          onClick={onMobileClose}
          style={{ backdropFilter: 'blur(2px)' }}
        />
      )}
      
      {/* Desktop Sidebar - Always visible on desktop */}
      <div className="hidden lg:flex lg:w-56 lg:h-screen lg:bg-gray-900 lg:text-white lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:z-30">
        {/* Desktop Logo */}
        <div className="p-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🦁</span>
            <div>
              <h2 className="text-lg font-bold">Wildlife Zoo</h2>
              <p className="text-sm text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm
                ${
                  isActive(item.path)
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Desktop Logout Button */}
        <div className="p-2 border-t border-gray-800 flex-shrink-0">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg w-full text-gray-300 hover:bg-red-600 hover:text-white transition-colors text-sm"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar - Slide in from left on mobile */}
      <div 
        className={`
          lg:hidden fixed top-0 left-0 w-72 h-full bg-gray-900 text-white flex flex-col z-50
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      style={{
          zIndex: 9999,
          transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)'
        }}
      >
        {/* Mobile Header */}
        <div className="p-4 border-b border-gray-800 flex-shrink-0 flex items-center justify-between bg-gray-800">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🦁</span>
            <div>
              <h2 className="text-lg font-bold">Wildlife Zoo</h2>
              <p className="text-sm text-gray-400">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={onMobileClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            type="button"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-base
                ${
                  isActive(item.path)
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <div className="flex-shrink-0">
              {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Logout Button */}
        <div className="p-3 border-t border-gray-800 flex-shrink-0 bg-gray-800">
          <button
            onClick={() => {
              onMobileClose();
              logout();
            }}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-gray-300 hover:bg-red-600 hover:text-white transition-colors text-base font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

