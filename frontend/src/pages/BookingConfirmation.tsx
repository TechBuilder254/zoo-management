import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { Receipt } from '../components/booking/Receipt';
import { Booking } from '../types';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export const BookingConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [booking, setBooking] = useState<Booking | null>(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) {
        navigate('/booking');
        return;
      }

      try {
        const bookingData = await bookingService.getById(id);
        setBooking(prev => ({ ...prev, ...bookingData } as any) || bookingData);
      } catch (error) {
        console.error('Failed to fetch booking:', error);
        // Do not redirect; keep showing the booking from navigation state if available
      } finally {
        setLoading(false);
      }
    };

    // If we already have booking from state, try to refresh but don't block UI
    if (location.state?.booking) {
      fetchBooking();
    } else {
      setLoading(true);
      fetchBooking();
    }
  }, [id, navigate]);

  const handleDownload = async () => {
    if (!booking) return;

    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;

    const primary = '#10B981';
    const dark = '#1F2937';
    const gray = '#6B7280';
    const lightGray = '#E5E7EB';

    // Header
    doc.setFillColor(primary);
    doc.rect(0, 0, pageWidth, 80, 'F');
    doc.setTextColor('#ffffff');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('WILDLIFE ZOO', margin, 50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('E-TICKET', pageWidth - margin - 70, 50);

    const bookingRef = booking.bookingReference || (booking as any).booking_reference || booking.id || 'N/A';

    // Outer card
    const cardY = 100;
    const cardH = pageHeight - cardY - margin;
    doc.setFillColor('#ffffff');
    doc.setDrawColor(lightGray);
    doc.roundedRect(margin - 4, cardY - 4, pageWidth - margin * 2 + 8, cardH, 10, 10, 'S');

    let y = cardY + 10;

    // Booking reference + QR
    doc.setTextColor(dark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Booking Reference', margin, y + 10);
    doc.setFontSize(13);
    doc.setTextColor(primary);
    doc.text(bookingRef, margin, y + 28);

    // (QR moved to bottom area)

    // Visit details
    y += 70;
    doc.setTextColor(dark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Visit Details', margin, y);

    y += 20;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(gray);
    doc.text('Visit Date', margin, y);
    doc.setTextColor(dark);
    const visitDate = new Date(booking.visit_date || (booking as any).visitDate || '').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(visitDate || '—', margin + 120, y);

    y += 18;
    doc.setTextColor(gray);
    doc.text('Customer', margin, y);
    doc.setTextColor(dark);
    doc.text(booking.users?.name || (booking as any).user?.name || 'Guest', margin + 120, y);

    y += 18;
    doc.setTextColor(gray);
    doc.text('Email', margin, y);
    doc.setTextColor(dark);
    doc.text(booking.users?.email || (booking as any).user?.email || 'N/A', margin + 120, y);

    // Divider
    y += 22;
    doc.setDrawColor(lightGray);
    doc.line(margin, y, pageWidth - margin, y);

    // Ticket breakdown
    y += 26;
    doc.setTextColor(dark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Ticket Breakdown', margin, y);

    y += 16;
    const row = (label: string, qty: number, price: number) => {
      if (!qty) return;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(dark);
      doc.text(`${label} × ${qty}`, margin, y);
      const amount = `KSh ${(qty * price).toLocaleString()}`;
      doc.text(amount, pageWidth - margin, y, { align: 'right' });
      y += 18;
    };

    const tickets = (booking as any).tickets;
    if (tickets) {
      row('Adult', tickets.adult.quantity, tickets.adult.price);
      row('Child', tickets.child.quantity, tickets.child.price);
      row('Senior', tickets.senior.quantity, tickets.senior.price);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.text(`${booking.ticket_type || (booking as any).ticketType} × ${(booking as any).quantity || 0}`, margin, y);
      y += 18;
    }

    // Total
    const totalAmount = (booking as any).total_price || (booking as any).totalPrice || (booking as any).totalAmount || 0;
    y += 6;
    doc.setDrawColor(lightGray);
    doc.line(margin, y, pageWidth - margin, y);
    y += 24;
    doc.setFont('helvetica', 'bold');
    doc.text('Total', margin, y);
    doc.setTextColor(primary);
    doc.text(`KSh ${Number(totalAmount).toLocaleString()}`, pageWidth - margin, y, { align: 'right' });

    // Payment
    y += 28;
    doc.setTextColor(dark);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(gray);
    y += 18;
    doc.text(`Payment ID: ${(booking as any).payment_id || 'N/A'}`, margin, y);
    y += 18;
    doc.text(`Status: ${(booking as any).payment_status || 'COMPLETED'}`, margin, y);

    // Bottom QR code - centered in the empty area
    try {
      const qrDataURL = await QRCode.toDataURL(bookingRef, { width: 160, margin: 1 });
      const qrSize = 140;
      const qrY = Math.max(y + 30, pageHeight - qrSize - 90);
      const qrX = (pageWidth - qrSize) / 2;
      doc.addImage(qrDataURL, 'PNG', qrX, qrY, qrSize, qrSize);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(gray);
      doc.setFontSize(10);
      doc.text('Scan at Entrance', pageWidth / 2, qrY + qrSize + 16, { align: 'center' });
    } catch {}

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(gray);
    doc.text('Thank you for choosing Wildlife Zoo!', margin, pageHeight - 20);

    // Open preview and save
    const blobUrl = doc.output('bloburl');
    window.open(blobUrl, '_blank');
    doc.save(`e-ticket-${bookingRef}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Booking Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The booking you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/booking')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Book New Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Receipt
          booking={booking}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
};
