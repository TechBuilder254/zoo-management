import React, { useState, useEffect } from 'react';
import { Calendar, Download, CheckCircle, XCircle } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { Booking } from '../types';
import { Card } from '../components/common/Card';
import { Loader } from '../components/common/Loader';
import { Button } from '../components/common/Button';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

export const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getUserBookings();
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
      console.error('Bookings error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading your bookings..." />;
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
        <Card padding="lg" className="text-center max-w-md">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Bookings Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't made any bookings yet. Book your zoo visit today!
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/booking'} fullWidth>
            Book Now
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Bookings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            View and manage your zoo visit bookings
          </p>
        </div>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking._id} padding="lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-primary-light dark:bg-gray-700 rounded-lg">
                      <Calendar size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatDate(booking.visitDate)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Booking Ref: {booking.bookingReference}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Tickets</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {booking.tickets.adult.quantity +
                          booking.tickets.child.quantity +
                          booking.tickets.senior.quantity}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                      <p className="text-lg font-semibold text-primary">
                        {formatCurrency(booking.totalAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {booking.status === 'upcoming' && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center">
                        <CheckCircle size={16} className="mr-1" />
                        Confirmed
                      </span>
                    )}
                    {booking.status === 'cancelled' && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full flex items-center">
                        <XCircle size={16} className="mr-1" />
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

                {booking.qrCode && (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
                      <QRCodeSVG value={booking.bookingReference} size={120} />
                    </div>
                    <Button variant="outline" size="sm">
                      <Download size={16} className="mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};




