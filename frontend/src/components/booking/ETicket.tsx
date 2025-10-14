import React from 'react';
import { Booking } from '../../types';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { QRCodeSVG } from 'qrcode.react';

interface ETicketProps {
  booking: Booking;
}

export const ETicket: React.FC<ETicketProps> = ({ booking }) => {
  const totalTickets = booking.tickets
    ? booking.tickets.adult.quantity + booking.tickets.child.quantity + booking.tickets.senior.quantity
    : booking.quantity || 0;

  return (
    <div className="bg-white p-8 max-w-2xl mx-auto" id="e-ticket">
      {/* Header */}
      <div className="border-b-2 border-primary pb-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-4xl">🦁</span>
              <span className="text-2xl font-bold text-primary">Wildlife Zoo</span>
            </div>
            <p className="text-gray-600">E-Ticket</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Booking Reference</p>
            <p className="text-xl font-bold text-gray-900">{booking.bookingReference}</p>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="flex justify-center mb-6">
        <div className="border-4 border-gray-300 p-4 rounded-lg">
          <QRCodeSVG value={booking.bookingReference || booking.id || 'N/A'} size={180} />
        </div>
      </div>

      {/* Booking Details */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Visit Date</p>
            <p className="font-semibold text-gray-900">{formatDate(booking.visit_date || booking.visitDate || '')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Tickets</p>
            <p className="font-semibold text-gray-900">{totalTickets}</p>
          </div>
        </div>

        {/* Ticket Breakdown */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          {booking.tickets ? (
            <>
              {booking.tickets.adult.quantity > 0 && (
                <div className="flex justify-between">
                  <span>Adult × {booking.tickets.adult.quantity}</span>
                  <span>{formatCurrency(booking.tickets.adult.price * booking.tickets.adult.quantity)}</span>
                </div>
              )}
              {booking.tickets.child.quantity > 0 && (
                <div className="flex justify-between">
                  <span>Child × {booking.tickets.child.quantity}</span>
                  <span>{formatCurrency(booking.tickets.child.price * booking.tickets.child.quantity)}</span>
                </div>
              )}
              {booking.tickets.senior.quantity > 0 && (
                <div className="flex justify-between">
                  <span>Senior × {booking.tickets.senior.quantity}</span>
                  <span>{formatCurrency(booking.tickets.senior.price * booking.tickets.senior.quantity)}</span>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-between">
              <span>{booking.ticketType} × {booking.quantity}</span>
              <span>{formatCurrency(booking.total_price || booking.totalPrice || 0)}</span>
            </div>
          )}
          <div className="border-t-2 border-gray-300 pt-2 mt-2 flex justify-between font-bold text-lg">
            <span>Total Amount</span>
            <span className="text-primary">{formatCurrency(booking.totalPrice || booking.totalAmount || 0)}</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">Important Information:</h4>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Please arrive 15 minutes before your visit time</li>
          <li>Bring a valid ID for verification</li>
          <li>Show this QR code at the entrance</li>
          <li>This ticket is valid only for the date mentioned above</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-600 border-t pt-4">
        <p>Wildlife Zoo | 123 Zoo Street, Wildlife City, WC 12345</p>
        <p>Phone: +1 (555) 123-4567 | Email: info@wildlifezoo.com</p>
      </div>
    </div>
  );
};




