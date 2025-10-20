import React from 'react';
import { CheckCircle, Calendar, Users, CreditCard, QrCode } from 'lucide-react';
import { Booking } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { QRCodeSVG } from 'qrcode.react';

interface ReceiptProps {
  booking: Booking;
  onDownload?: () => void;
}

export const Receipt: React.FC<ReceiptProps> = ({ booking, onDownload }) => {
  const totalTickets = booking.tickets
    ? booking.tickets.adult.quantity + booking.tickets.child.quantity + booking.tickets.senior.quantity
    : booking.quantity || 0;

  const totalAmount = booking.total_price || booking.totalPrice || booking.totalAmount || 0;
  const bookingRef = booking.bookingReference || booking.booking_reference || booking.id || 'N/A';
  const visitDate = booking.visit_date || booking.visitDate || '';
  const buyerName = booking.users?.name || booking.user?.name || 'Guest';
  const buyerEmail = booking.users?.email || booking.user?.email || 'N/A';
  const paymentId = booking.payment_id || 'N/A';
  const paymentStatus = booking.payment_status || 'COMPLETED';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Your zoo visit has been successfully booked
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Receipt */}
        <div className="lg:col-span-2">
          <Card padding="lg">
            <div className="border-b dark:border-gray-700 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Booking Receipt
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Reference: <span className="font-mono font-semibold text-primary">{bookingRef}</span>
              </p>
            </div>

            {/* Booking Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <Calendar className="text-gray-400" size={20} />
                  <span className="text-gray-700 dark:text-gray-300">Visit Date</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(visitDate)}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <Users className="text-gray-400" size={20} />
                  <span className="text-gray-700 dark:text-gray-300">Total Tickets</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {totalTickets}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <CreditCard className="text-gray-400" size={20} />
                  <span className="text-gray-700 dark:text-gray-300">Payment Status</span>
                </div>
                <span className="font-semibold text-green-600">
                  {paymentStatus}
                </span>
              </div>
            </div>

            {/* Ticket Breakdown */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ticket Breakdown
              </h3>
              <div className="space-y-2">
                {booking.tickets ? (
                  <>
                    {booking.tickets.adult.quantity > 0 && (
                      <div className="flex items-center justify-between py-2 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">
                          Adult Tickets (Ages 13-64) × {booking.tickets.adult.quantity}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(booking.tickets.adult.price * booking.tickets.adult.quantity)}
                        </span>
                      </div>
                    )}
                    {booking.tickets.child.quantity > 0 && (
                      <div className="flex items-center justify-between py-2 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">
                          Child Tickets (Ages 3-12) × {booking.tickets.child.quantity}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(booking.tickets.child.price * booking.tickets.child.quantity)}
                        </span>
                      </div>
                    )}
                    {booking.tickets.senior.quantity > 0 && (
                      <div className="flex items-center justify-between py-2 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">
                          Senior Tickets (Ages 65+) × {booking.tickets.senior.quantity}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(booking.tickets.senior.price * booking.tickets.senior.quantity)}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-between py-2 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">
                      {booking.ticket_type || booking.ticketType} Tickets × {booking.quantity}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between py-4 mt-4 border-t-2 border-gray-300 dark:border-gray-600">
                <span className="text-xl font-bold text-gray-900 dark:text-white">Total Amount</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Customer Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Name:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{buyerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment ID:</span>
                  <span className="font-mono text-sm text-gray-900 dark:text-white">{paymentId}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* QR Code & Actions */}
        <div className="space-y-6">
          {/* QR Code */}
          <Card padding="lg" className="text-center">
            <QrCode size={24} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Entry QR Code
            </h3>
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
              <QRCodeSVG value={bookingRef} size={200} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Show this QR code at the entrance
            </p>
          </Card>

          {/* Actions */}
          <Card padding="lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Actions
            </h3>
            <div className="space-y-3">
              {onDownload && (
                <Button variant="primary" fullWidth onClick={onDownload}>
                  Download E-Ticket
                </Button>
              )}
              <Button variant="outline" fullWidth onClick={() => window.print()}>
                Print Receipt
              </Button>
              <Button variant="outline" fullWidth onClick={() => window.location.href = '/my-bookings'}>
                View All Bookings
              </Button>
            </div>
          </Card>

          {/* Important Notice */}
          <Card padding="lg" className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
              Important Notice
            </h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
              <li>• Bring a valid ID for verification</li>
              <li>• Show this QR code at entrance</li>
              <li>• Arrive 15 minutes before your time</li>
              <li>• Confirmation email sent to {buyerEmail}</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
