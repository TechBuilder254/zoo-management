import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, Edit, Trash2, User, Calendar, CreditCard } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { format } from 'date-fns';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { bookingService } from '../../services/bookingService';
import { Booking } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

export const BookingManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getAll();
        setBookings(data.bookings); // Extract bookings array from paginated response
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        toast.error('Failed to load bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'CONFIRMED' || s === 'COMPLETED') return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    if (s === 'PENDING') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    if (s === 'CANCELLED') return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  };

  const filteredBookings = bookings.filter(booking =>
    (booking.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (booking.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modal handlers
  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleEditBooking = () => {
    // TODO: Implement edit booking functionality
    toast('Edit booking functionality coming soon');
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancel(bookingId);
        // Update the booking status in the local state instead of removing it
        setBookings(bookings.map(b => 
          b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
        ));
        toast.success('Booking cancelled successfully');
        handleCloseModal();
      } catch (error) {
        console.error('Failed to cancel booking:', error);
        toast.error('Failed to cancel booking');
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-gray-600 dark:text-gray-400">Loading bookings...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
           {/* Header */}
           <div className="mb-6">
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
               Booking Management
             </h1>
             <p className="text-sm text-gray-600 dark:text-gray-400">
               Manage and track all zoo bookings
             </p>
           </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
            <Card padding="sm">
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Bookings</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{bookings.length}</h3>
            </Card>
            <Card padding="sm" className="border-l-4 border-green-500">
              <p className="text-xs text-gray-600 dark:text-gray-400">Confirmed</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {bookings.filter(b => b.status.toUpperCase() === 'CONFIRMED').length}
              </h3>
            </Card>
            <Card padding="sm" className="border-l-4 border-yellow-500">
              <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {bookings.filter(b => b.status.toUpperCase() === 'PENDING').length}
              </h3>
            </Card>
            <Card padding="sm" className="border-l-4 border-primary">
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Revenue</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(bookings.reduce((sum, b) => sum + (b.totalPrice || b.totalAmount || 0), 0))}
              </h3>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-4 lg:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Bookings List - Desktop Table / Mobile Cards */}
          <Card padding="lg">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Booking ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Visit Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Tickets</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-4 px-4">
                          <div className="font-mono text-sm text-gray-900 dark:text-white">
                            {booking.id.substring(0, 8)}...
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {booking.user?.name || 'Guest'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {booking.user?.email || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {format(new Date(booking.visit_date || booking.visitDate || ''), 'MMM dd, yyyy')}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.quantity || 0}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(booking.totalPrice || booking.totalAmount || 0)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="p-2"
                              onClick={() => handleViewBooking(booking)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="p-2"
                              onClick={() => handleEditBooking()}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="p-2"
                            >
                              <Download size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500 dark:text-gray-400">
                        No bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                    onClick={() => handleViewBooking(booking)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                          {booking.user?.name || 'Guest'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {booking.user?.email || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 font-mono mt-1">
                          ID: {booking.id.substring(0, 8)}...
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar size={14} className="mr-2" />
                        <span>{format(new Date(booking.visit_date || booking.visitDate || ''), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <User size={14} className="mr-2" />
                        <span>{booking.quantity || 0} tickets</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center text-gray-900 dark:text-white font-medium">
                        <CreditCard size={14} className="mr-2" />
                        <span>{formatCurrency(booking.totalPrice || booking.totalAmount || 0)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No bookings found
                </div>
              )}
            </div>
          </Card>

          {/* Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Booking Details"
            size="md"
          >
            {selectedBooking && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Booking #{selectedBooking.id.substring(0, 8)}...
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {selectedBooking.status}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Customer Information</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-gray-900 dark:text-white">
                      <strong>Name:</strong> {selectedBooking.user?.name || 'Guest'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Email:</strong> {selectedBooking.user?.email || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Visit Date</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {format(new Date(selectedBooking.visit_date || selectedBooking.visitDate || ''), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Tickets</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedBooking.quantity || 0}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Total Amount</h4>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(selectedBooking.totalPrice || selectedBooking.totalAmount || 0)}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleCloseModal();
                        handleEditBooking();
                      }}
                      className="flex items-center space-x-2"
                    >
                      <Edit size={16} />
                      <span>Edit Booking</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleCloseModal();
                        handleDeleteBooking(selectedBooking.id);
                      }}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      <span>Cancel Booking</span>
                    </Button>
                  </div>
                  <Button variant="outline" onClick={handleCloseModal}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        </AdminLayout>
  );
};
