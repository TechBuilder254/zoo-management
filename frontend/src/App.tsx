import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { BookingProvider } from './context/BookingContext';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/common/Navbar';
import { AdminNavbar } from './components/admin/AdminNavbar';
import { Footer } from './components/common/Footer';
import { Loader } from './components/common/Loader';
import { ScrollToTop } from './components/common/ScrollToTop';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Animals } from './pages/Animals';
import { AnimalDetail } from './pages/AnimalDetail';
import { Booking } from './pages/Booking';
import { BookingConfirmation } from './pages/BookingConfirmation';
import { Events } from './pages/Events';
import { Profile } from './pages/Profile';
import { MyBookings } from './pages/MyBookings';
import { Favorites } from './pages/Favorites';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { TestAPI } from './pages/TestAPI';
import { TestBackend } from './pages/TestBackend';

// Admin pages
import { Dashboard as AdminDashboard } from './pages/admin/Dashboard';
import { AnimalManagement } from './pages/admin/AnimalManagement';
import { BookingManagement } from './pages/admin/BookingManagement';
import { ReviewModeration } from './pages/admin/ReviewModeration';
import { StaffManagement } from './pages/admin/StaffManagement';
import { AnimalHealth } from './pages/admin/AnimalHealth';
import { EventsManagement } from './pages/admin/EventsManagement';
import { FinancialManagement } from './pages/admin/FinancialManagement';
import { TicketPricing } from './pages/admin/TicketPricing';
import { PromoCodeManagement } from './pages/admin/PromoCodeManagement';
import { Settings } from './pages/admin/Settings';

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

// Admin Route Component
interface AdminRouteProps {
  children: React.ReactElement;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  // Check if user is authenticated and has admin role
  const isAdmin = isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'admin');
  
  return isAdmin ? children : <Navigate to="/" replace />;
};

// Layout wrapper that conditionally renders admin or public navbar
const AppLayout: React.FC<{ children: React.ReactNode; isAdminRoute: boolean }> = ({ children, isAdminRoute }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

// App Routes Component
const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AppLayout isAdminRoute={isAdminRoute}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test-api" element={<TestAPI />} />
        <Route path="/test-backend" element={<TestBackend />} />
        <Route path="/animals" element={<Animals />} />
        <Route path="/animals/:id" element={<AnimalDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
          
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
            path="/booking-confirmation/:id"
            element={
              <ProtectedRoute>
                <BookingConfirmation />
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
          
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/animals"
            element={
              <AdminRoute>
                <AnimalManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <BookingManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <AdminRoute>
                <ReviewModeration />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/staff"
            element={
              <AdminRoute>
                <StaffManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/health"
            element={
              <AdminRoute>
                <AnimalHealth />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <AdminRoute>
                <EventsManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/ticket-pricing"
            element={
              <AdminRoute>
                <TicketPricing />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/promo-codes"
            element={
              <AdminRoute>
                <PromoCodeManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <Settings />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/financial"
            element={
              <AdminRoute>
                <FinancialManagement />
              </AdminRoute>
            }
          />
          
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
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






