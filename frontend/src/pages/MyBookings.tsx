import React, { useState, useEffect } from 'react';
import { Calendar, Download, CheckCircle, XCircle, Trash2, CalendarRange } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { Booking } from '../types';
import { Card } from '../components/common/Card';
import { Loader } from '../components/common/Loader';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

export const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);

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

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    setIsCanceling(true);
    try {
      // In a real app, this would call the API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      setBookings(bookings.map(b => 
        b._id === selectedBooking._id 
          ? { ...b, status: 'cancelled' } 
          : b
      ));
      
      toast.success('Booking cancelled successfully');
      setCancelModalOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      toast.error('Failed to cancel booking');
    } finally {
      setIsCanceling(false);
    }
  };

  const handleDownloadTicket = (booking: Booking) => {
    // Create a simple download for the ticket
    const ticketData = `
Zoo Visit Ticket
================
Booking Reference: ${booking.bookingReference}
Visit Date: ${formatDate(booking.visitDate)}
Total Tickets: ${booking.tickets.adult.quantity + booking.tickets.child.quantity + booking.tickets.senior.quantity}
Total Amount: ${formatCurrency(booking.totalAmount)}
Status: ${booking.status}
    `.trim();

    const blob = new Blob([ticketData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${booking.bookingReference}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Ticket downloaded');
  };

  const handleExportToCalendar = (booking: Booking) => {
    // Create iCal format
    const visitDate = new Date(booking.visitDate);
    const startDate = visitDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(visitDate.getTime() + 4 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wildlife Zoo//Booking//EN
BEGIN:VEVENT
UID:${booking.bookingReference}@wildlifezoo.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:Zoo Visit - ${booking.bookingReference}
DESCRIPTION:Wildlife Zoo Visit\\nTickets: ${booking.tickets.adult.quantity + booking.tickets.child.quantity + booking.tickets.senior.quantity}\\nAmount: ${formatCurrency(booking.totalAmount)}
LOCATION:Wildlife Zoo, Langata Road, Karen, Nairobi
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zoo-visit-${booking.bookingReference}.ics`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Event added to calendar');
  };

  const canCancelBooking = (booking: Booking) => {
    const visitDate = new Date(booking.visitDate);
    const now = new Date();
    const daysDifference = Math.ceil((visitDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return booking.status === 'upcoming' && daysDifference >= 2;
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
                    <div className="flex flex-col space-y-2 w-full">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadTicket(booking)}
                      >
                        <Download size={16} className="mr-2" />
                        Download Ticket
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleExportToCalendar(booking)}
                      >
                        <CalendarRange size={16} className="mr-2" />
                        Add to Calendar
                      </Button>
                      {canCancelBooking(booking) && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setCancelModalOpen(true);
                          }}
                        >
                          <Trash2 size={16} className="mr-2" />
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Cancel Booking Modal */}
        <Modal
          isOpen={cancelModalOpen}
          onClose={() => {
            setCancelModalOpen(false);
            setSelectedBooking(null);
          }}
          title="Cancel Booking"
        >
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                ⚠️ <strong>Cancellation Policy:</strong> Bookings can be cancelled up to 48 hours before the visit date. 
                A full refund will be issued within 5-7 business days.
              </p>
            </div>

            {selectedBooking && (
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  Are you sure you want to cancel this booking?
                </p>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-1">
                  <p className="text-sm">
                    <span className="font-semibold">Booking Reference:</span> {selectedBooking.bookingReference}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Visit Date:</span> {formatDate(selectedBooking.visitDate)}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Amount:</span> {formatCurrency(selectedBooking.totalAmount)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setCancelModalOpen(false);
                  setSelectedBooking(null);
                }}
                disabled={isCanceling}
              >
                Keep Booking
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleCancelBooking}
                isLoading={isCanceling}
                className="bg-red-600 hover:bg-red-700"
              >
                Yes, Cancel Booking
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};




