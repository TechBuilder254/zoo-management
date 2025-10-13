import React from 'react';
import { CheckCircle, Download, Calendar, Ticket } from 'lucide-react';
import { Booking } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { QRCodeSVG } from 'qrcode.react';

interface BookingConfirmationProps {
  booking: Booking;
  onDownload?: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onDownload,
}) => {
  const totalTickets =
    booking.tickets.adult.quantity +
    booking.tickets.child.quantity +
    booking.tickets.senior.quantity;

  return (
    <div className="max-w-2xl mx-auto">
      <Card padding="lg">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your tickets have been successfully booked
          </p>
        </div>

        {/* Booking Reference */}
        <div className="bg-primary-light dark:bg-gray-700 rounded-lg p-4 mb-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Booking Reference
          </p>
          <p className="text-2xl font-bold text-primary dark:text-primary-light">
            {booking.bookingReference}
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
              {formatDate(booking.visitDate)}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Ticket className="text-gray-400" size={20} />
              <span className="text-gray-700 dark:text-gray-300">Total Tickets</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalTickets}
            </span>
          </div>

          {/* Ticket Breakdown */}
          {booking.tickets.adult.quantity > 0 && (
            <div className="flex items-center justify-between py-2 pl-12">
              <span className="text-gray-600 dark:text-gray-400">Adult × {booking.tickets.adult.quantity}</span>
              <span className="text-gray-900 dark:text-white">
                {formatCurrency(booking.tickets.adult.price * booking.tickets.adult.quantity)}
              </span>
            </div>
          )}
          {booking.tickets.child.quantity > 0 && (
            <div className="flex items-center justify-between py-2 pl-12">
              <span className="text-gray-600 dark:text-gray-400">Child × {booking.tickets.child.quantity}</span>
              <span className="text-gray-900 dark:text-white">
                {formatCurrency(booking.tickets.child.price * booking.tickets.child.quantity)}
              </span>
            </div>
          )}
          {booking.tickets.senior.quantity > 0 && (
            <div className="flex items-center justify-between py-2 pl-12">
              <span className="text-gray-600 dark:text-gray-400">Senior × {booking.tickets.senior.quantity}</span>
              <span className="text-gray-900 dark:text-white">
                {formatCurrency(booking.tickets.senior.price * booking.tickets.senior.quantity)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between py-3 border-t-2 border-gray-300 dark:border-gray-600">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(booking.totalAmount)}
            </span>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Show this QR code at the entrance
          </p>
          <div className="inline-block bg-white p-4 rounded-lg">
            <QRCodeSVG value={booking.bookingReference} size={200} />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {onDownload && (
            <Button variant="primary" fullWidth onClick={onDownload}>
              <Download size={20} className="mr-2" />
              Download E-Ticket
            </Button>
          )}
          <Button variant="outline" fullWidth onClick={() => window.print()}>
            Print Ticket
          </Button>
        </div>

        {/* Important Notice */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Important:</strong> Please bring a valid ID and show this QR code or booking reference at the entrance.
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </Card>
    </div>
  );
};




