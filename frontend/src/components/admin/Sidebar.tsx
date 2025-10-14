import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PawPrint, Ticket, MessageSquare, BarChart3, Settings, LogOut, Users, Heart, Calendar, DollarSign, X, Tag } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
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
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        w-56 h-screen bg-gray-900 text-white flex flex-col fixed left-0 top-0 z-50
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-3 border-b border-gray-800 flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🦁</span>
            <div>
              <h2 className="text-base font-bold">Wildlife Zoo</h2>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-1 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`
                flex items-center space-x-2 px-2 py-1.5 rounded-lg transition-colors text-xs
                ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-1 border-t border-gray-800 flex-shrink-0">
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-2 py-1.5 rounded-lg w-full text-gray-300 hover:bg-red-600 hover:text-white transition-colors text-xs"
          >
            <LogOut size={16} />
            <span className="truncate">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

