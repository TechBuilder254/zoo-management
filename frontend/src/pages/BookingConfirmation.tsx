import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { BookingConfirmation as BookingConfirmationComponent } from '../components/booking/BookingConfirmation';
import { Booking } from '../types';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export const BookingConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) {
        navigate('/booking');
        return;
      }

      try {
        const bookingData = await bookingService.getById(id);
        setBooking(bookingData);
      } catch (error) {
        console.error('Failed to fetch booking:', error);
        toast.error('Failed to load booking details');
        navigate('/booking');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, navigate]);

  const generateQRCodeImage = async (bookingRef: string): Promise<string> => {
    try {
      console.log('Generating QR code for PDF:', bookingRef);
      
      // Create a canvas element for QR code generation
      const canvas = document.createElement('canvas');
      canvas.width = 120;
      canvas.height = 120;
      
      // Generate QR code directly to canvas
      await QRCode.toCanvas(canvas, bookingRef, {
        width: 120,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      
      // Convert canvas to data URL
      const qrDataURL = canvas.toDataURL('image/png');
      console.log('QR Code generated successfully for PDF, length:', qrDataURL.length);
      return qrDataURL;
    } catch (error) {
      console.error('QR Code generation failed:', error);
      
      // Fallback: try the original method
      try {
        const qrDataURL = await QRCode.toDataURL(bookingRef, {
          width: 120,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });
        console.log('QR Code generated with fallback method');
        return qrDataURL;
      } catch (fallbackError) {
        console.error('Fallback QR Code generation also failed:', fallbackError);
        return '';
      }
    }
  };

  const handleDownload = async () => {
    if (!booking) return;
    
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Colors
    const primaryColor = '#10B981'; // Green
    const darkGray = '#374151';
    const lightGray = '#6B7280';
    const bgGray = '#F9FAFB';
    const white = '#FFFFFF';
    
    // Header with logo and title
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Zoo name and logo
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('WILDLIFE ZOO', 20, 25);
    
    // Subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Electronic Ticket Confirmation', 20, 35);
    
    // Date and time
    doc.setTextColor(lightGray);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 80, 35);
    
    // Booking reference section
    doc.setFillColor(bgGray);
    doc.rect(15, 50, pageWidth - 30, 25, 'F');
    
    doc.setTextColor(darkGray);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BOOKING REFERENCE', 20, 65);
    
    doc.setFontSize(18);
    doc.setTextColor(primaryColor);
    doc.text(booking.bookingReference || booking.id || 'N/A', 20, 75);
    
    // Visit details section
    let yPos = 90;
    doc.setTextColor(darkGray);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('VISIT DETAILS', 20, yPos);
    
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightGray);
    doc.text('Visit Date:', 20, yPos);
    doc.setTextColor(darkGray);
    doc.text(new Date(booking.visit_date || booking.visitDate || '').toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }), 60, yPos);
    
    yPos += 8;
    doc.setTextColor(lightGray);
    doc.text('Customer:', 20, yPos);
    doc.setTextColor(darkGray);
    doc.text(booking.user?.name || 'Guest', 60, yPos);
    
    yPos += 8;
    doc.setTextColor(lightGray);
    doc.text('Email:', 20, yPos);
    doc.setTextColor(darkGray);
    doc.text(booking.user?.email || 'N/A', 60, yPos);
    
    // Ticket breakdown section
    yPos += 20;
    doc.setFillColor(bgGray);
    doc.rect(15, yPos - 5, pageWidth - 30, 15, 'F');
    
    doc.setTextColor(darkGray);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TICKET BREAKDOWN', 20, yPos + 5);
    
    yPos += 20;
    
    if (booking.tickets) {
      
      if (booking.tickets.adult.quantity > 0) {
        doc.setTextColor(darkGray);
        doc.setFont('helvetica', 'normal');
        doc.text(`Adult Tickets (13-64 years)`, 20, yPos);
        doc.text(`× ${booking.tickets.adult.quantity}`, pageWidth - 100, yPos);
        doc.text(`KSh ${(booking.tickets.adult.price * booking.tickets.adult.quantity).toLocaleString()}`, pageWidth - 40, yPos);
        yPos += 8;
      }
      
      if (booking.tickets.child.quantity > 0) {
        doc.text(`Child Tickets (3-12 years)`, 20, yPos);
        doc.text(`× ${booking.tickets.child.quantity}`, pageWidth - 100, yPos);
        doc.text(`KSh ${(booking.tickets.child.price * booking.tickets.child.quantity).toLocaleString()}`, pageWidth - 40, yPos);
        yPos += 8;
      }
      
      if (booking.tickets.senior.quantity > 0) {
        doc.text(`Senior Tickets (65+ years)`, 20, yPos);
        doc.text(`× ${booking.tickets.senior.quantity}`, pageWidth - 100, yPos);
        doc.text(`KSh ${(booking.tickets.senior.price * booking.tickets.senior.quantity).toLocaleString()}`, pageWidth - 40, yPos);
        yPos += 8;
      }
    } else {
      doc.setTextColor(darkGray);
      doc.setFont('helvetica', 'normal');
      doc.text(`${booking.ticket_type || booking.ticketType} Tickets`, 20, yPos);
      doc.text(`× ${booking.quantity}`, pageWidth - 100, yPos);
      doc.text(`KSh ${booking.totalPrice?.toLocaleString()}`, pageWidth - 40, yPos);
      yPos += 8;
    }
    
    // Total amount section
    yPos += 10;
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(1);
    doc.line(20, yPos, pageWidth - 20, yPos);
    
    yPos += 10;
    doc.setTextColor(darkGray);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL AMOUNT', 20, yPos);
    doc.setTextColor(primaryColor);
    doc.setFontSize(16);
    doc.text(`KSh ${(booking.totalPrice || booking.totalAmount || 0).toLocaleString()}`, pageWidth - 60, yPos);
    
    // QR Code section
    yPos += 30;
    
    // Generate and add real QR code image
    const qrCodeData = await generateQRCodeImage(booking.bookingReference || booking.id || '');
    console.log('QR Code Data:', qrCodeData ? 'Generated successfully' : 'Failed to generate');
    
    // Position QR code in center-right area for better visibility
    const qrX = pageWidth - 100; // More centered position
    const qrY = yPos;
    const qrSize = 80;
    
    // Create QR code container with border
    doc.setFillColor(white);
    doc.roundedRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 8, 8, 'F');
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(2);
    doc.roundedRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 8, 8, 'S');
    
    // Always show a square placeholder first to prove redesign is working
    doc.setFillColor('#E5E7EB'); // Light gray background
    doc.rect(qrX, qrY, qrSize, qrSize, 'F');
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(2);
    doc.rect(qrX, qrY, qrSize, qrSize, 'S');
    
    // Add text in the square
    doc.setTextColor(primaryColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('QR CODE', qrX + (qrSize/2), qrY + 25, { align: 'center' });
    doc.text('PLACEHOLDER', qrX + (qrSize/2), qrY + 40, { align: 'center' });
    doc.text('SQUARE', qrX + (qrSize/2), qrY + 55, { align: 'center' });
    
    // QR code label below
    doc.setTextColor(darkGray);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('SCAN AT ENTRANCE', qrX + (qrSize/2), qrY + qrSize + 15, { align: 'center' });
    
    // Add booking reference below QR code
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Ref: ${booking.bookingReference || booking.id || 'N/A'}`, qrX + (qrSize/2), qrY + qrSize + 25, { align: 'center' });
    
    // Try to add actual QR code if available
    if (qrCodeData) {
      try {
        console.log('Attempting to add QR code image...');
        // Add QR code with better positioning
        doc.addImage(qrCodeData, 'PNG', qrX + 5, qrY + 5, qrSize - 10, qrSize - 10);
        console.log('QR Code added to PDF successfully at position:', qrX, qrY);
      } catch (error) {
        console.error('Error adding QR code to PDF:', error);
        // Keep the placeholder square
      }
    } else {
      console.log('No QR code data available, showing placeholder');
    }
    
    // Important instructions - positioned below QR code
    yPos += 120; // More space for QR code section
    doc.setFillColor('#FEF3C7');
    doc.roundedRect(15, yPos, pageWidth - 30, 35, 8, 8, 'F');
    doc.setDrawColor('#F59E0B');
    doc.setLineWidth(1);
    doc.roundedRect(15, yPos, pageWidth - 30, 35, 8, 8, 'S');
    
    doc.setTextColor('#92400E');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('IMPORTANT INSTRUCTIONS', 25, yPos + 10);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('• Please bring a valid ID for verification', 25, yPos + 18);
    doc.text('• Show this ticket or booking reference at entrance', 25, yPos + 26);
    doc.text('• Arrive 15 minutes before your scheduled time', 25, yPos + 34);
    
    // Footer
    const footerY = pageHeight - 20;
    doc.setTextColor(lightGray);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for choosing Wildlife Zoo!', pageWidth / 2, footerY, { align: 'center' });
    doc.text('www.wildlifezoo.com | support@wildlifezoo.com', pageWidth / 2, footerY + 8, { align: 'center' });
    
    // Save the PDF
    const fileName = `e-ticket-${booking.bookingReference || booking.id}.pdf`;
    doc.save(fileName);
    
    toast.success('E-ticket PDF downloaded successfully!');
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
        <BookingConfirmationComponent
          booking={booking}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
};
