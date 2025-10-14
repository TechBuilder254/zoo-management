import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from '../common/ThemeToggle';
import { Button } from '../common/Button';

export const AdminNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };


  return (
    <>
      <nav className="sticky top-0 z-40 bg-gradient-to-r from-primary to-primary-dark shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/admin/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl">🦁</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">
                  Wildlife Zoo
                </span>
                <span className="text-xs text-primary-light">
                  Admin Panel
                </span>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Right Side Actions - Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              <ThemeToggle />
              
              {/* User Info */}
              <div className="flex items-center space-x-3 pl-4 border-l border-white/20">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-primary-light">Administrator</p>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary font-bold">
                  {user?.firstName?.charAt(0).toUpperCase()}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-white/30 text-white hover:bg-white hover:text-primary"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-900 border-b border-gray-800">
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.firstName?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full border-white/30 text-white hover:bg-white hover:text-primary"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

