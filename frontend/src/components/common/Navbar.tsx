import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Heart, Calendar, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';
import { Container } from './Container';
import { saveScrollPosition } from './ScrollToTop';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/animals', label: 'Animals' },
    { to: '/events', label: 'Events' },
    { to: '/booking', label: 'Book Tickets' },
  ];

  const handleNavClick = () => {
    // Save current scroll position before navigating to a new page
    saveScrollPosition(window.location.pathname + window.location.search);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-gray-900 shadow-md">
      <Container>
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" onClick={handleNavClick} className="flex items-center space-x-2">
            <span className="text-2xl">🦁</span>
            <span className="text-xl font-bold text-primary dark:text-primary-light">
              Wildlife Zoo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={handleNavClick}
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard">
                    <Button variant="ghost" size="sm">
                      <LayoutDashboard size={18} className="mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link to="/favorites">
                  <Button variant="ghost" size="sm">
                    <Heart size={18} />
                  </Button>
                </Link>
                <Link to="/my-bookings">
                  <Button variant="ghost" size="sm">
                    <Calendar size={18} />
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <User size={18} className="mr-2" />
                    {user?.firstName}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t dark:border-gray-800">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  onClick={() => {
                    handleNavClick();
                    setIsMenuOpen(false);
                  }}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="border-t dark:border-gray-800 pt-3 px-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
                  <ThemeToggle />
                </div>
                
                {isAuthenticated ? (
                  <div className="space-y-2">
                    {user?.role === 'admin' && (
                      <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" size="sm" fullWidth>
                          <LayoutDashboard size={18} className="mr-2" />
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" fullWidth>
                        <User size={18} className="mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Link to="/favorites" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" fullWidth>
                        <Heart size={18} className="mr-2" />
                        Favorites
                      </Button>
                    </Link>
                    <Link to="/my-bookings" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" fullWidth>
                        <Calendar size={18} className="mr-2" />
                        My Bookings
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" fullWidth onClick={handleLogout}>
                      <LogOut size={18} className="mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" fullWidth>
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="primary" size="sm" fullWidth>
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
};






