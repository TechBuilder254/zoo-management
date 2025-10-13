import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PawPrint, Ticket, MessageSquare, BarChart3, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
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
      path: '/admin/analytics',
      icon: <BarChart3 size={20} />,
      label: 'Analytics',
    },
    {
      path: '/admin/settings',
      icon: <Settings size={20} />,
      label: 'Settings',
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <span className="text-3xl">🦁</span>
          <div>
            <h2 className="text-xl font-bold">Wildlife Zoo</h2>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
              ${
                isActive(item.path)
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }
            `}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

