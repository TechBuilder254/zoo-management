import React, { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { format } from 'date-fns';
import { Sidebar } from '../../components/admin/Sidebar';
import { bookingService } from '../../services/bookingService';
import { Booking } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

export const BookingManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getAll();
        setBookings(data);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="lg:ml-56 p-6">
          <p className="text-gray-600 dark:text-gray-400">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="lg:ml-56">
        <div className="p-3 lg:p-6">
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

          {/* Bookings Table */}
          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Visit Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tickets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        No bookings found
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900 dark:text-white">
                          {booking.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {booking.user?.name || 'Guest'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {booking.user?.email || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                          {format(new Date(booking.visitDate), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                          {booking.quantity || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {formatCurrency(booking.totalPrice || booking.totalAmount || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                          <Button variant="ghost" size="sm">
                            <Download size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
