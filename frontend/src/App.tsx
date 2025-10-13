import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { BookingProvider } from './context/BookingContext';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Loader } from './components/common/Loader';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Animals } from './pages/Animals';
import { AnimalDetail } from './pages/AnimalDetail';
import { Booking } from './pages/Booking';
import { Events } from './pages/Events';
import { Profile } from './pages/Profile';
import { MyBookings } from './pages/MyBookings';
import { Favorites } from './pages/Favorites';
import { NotFound } from './pages/NotFound';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/animals" element={<Animals />} />
          <Route path="/animals/:id" element={<AnimalDetail />} />
          <Route path="/events" element={<Events />} />
          
          {/* Protected Routes */}
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <BookingProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </BookingProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;




