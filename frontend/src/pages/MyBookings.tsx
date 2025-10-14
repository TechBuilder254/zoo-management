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
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

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
        b.id === selectedBooking.id 
          ? { ...b, status: 'CANCELLED' as const } 
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

  const handleDownloadTicket = async () => {
    console.log('Starting PDF generation with modern design...');
    
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    console.log('PDF created, page size:', pageWidth, 'x', pageHeight);
    
    // Modern color palette
    const primaryColor = '#059669'; // Emerald green
    const darkGray = '#1F2937';
    const lightGray = '#6B7280';
    const bgGray = '#F9FAFB';
    const white = '#FFFFFF';
    
    // Generate QR code
    const qrCodeText = 'ZOO-2025-1234'; // Test booking reference
    console.log('Generating QR code for:', qrCodeText);
    
    let qrCodeDataURL = '';
    try {
      qrCodeDataURL = await QRCode.toDataURL(qrCodeText, {
        width: 120,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      console.log('QR Code generated successfully');
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
    
    // MODERN HEADER DESIGN
    // Header background with gradient effect
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    // Company logo area
    doc.setTextColor(white);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('WILDLIFE ZOO', 20, 25);
    
    // Subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Premium Wildlife Experience', 20, 35);
    
    // E-ticket badge
    doc.setFillColor(white);
    doc.rect(pageWidth - 80, 15, 60, 25, 'F');
    doc.setTextColor(primaryColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('E-TICKET', pageWidth - 50, 30, { align: 'center' });
    
    // Date/time stamp
    doc.setTextColor(white);
    doc.setFontSize(8);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 80, 50);
    
    // BOOKING REFERENCE SECTION
    let yPos = 80;
    doc.setFillColor(bgGray);
    doc.roundedRect(15, yPos, pageWidth - 30, 25, 8, 8, 'F');
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(1);
    doc.roundedRect(15, yPos, pageWidth - 30, 25, 8, 8, 'S');
    
    doc.setTextColor(darkGray);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('BOOKING REFERENCE', 25, yPos + 8);
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text(qrCodeText, 25, yPos + 18);
    
    // TWO-COLUMN LAYOUT: Left side for details, Right side for QR code
    yPos += 40;
    const leftColumnWidth = 110;
    const rightColumnStart = 125;
    
    // LEFT COLUMN - VISIT DETAILS SECTION
    doc.setFillColor(primaryColor);
    doc.rect(20, yPos - 5, leftColumnWidth, 15, 'F');
    doc.setTextColor(white);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('VISIT DETAILS', 25, yPos + 3);
    
    yPos += 20;
    const detailsStartY = yPos;
    
    // Details in clean format
    const details = [
      { label: 'Visit Date', value: 'Tuesday, October 21, 2025' },
      { label: 'Customer', value: 'John Doe' },
      { label: 'Status', value: 'CONFIRMED' }
    ];
    
    details.forEach((detail, index) => {
      doc.setFillColor(bgGray);
      doc.roundedRect(20, yPos + (index * 15), leftColumnWidth, 12, 4, 4, 'F');
      
      doc.setTextColor(lightGray);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`${detail.label}:`, 25, yPos + 9 + (index * 15));
      
      doc.setTextColor(darkGray);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(detail.value, 25, yPos + 9 + (index * 15) + 5, { maxWidth: leftColumnWidth - 15 });
    });
    
    yPos += 60;
    
    // TICKET BREAKDOWN SECTION
    doc.setFillColor(primaryColor);
    doc.rect(20, yPos - 5, leftColumnWidth, 15, 'F');
    doc.setTextColor(white);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TICKET BREAKDOWN', 25, yPos + 3);
    
    yPos += 20;
    
    // Ticket items
    const tickets = [
      { name: 'Adult Tickets', qty: 2, price: 1500, total: 3000 },
      { name: 'Child Tickets', qty: 1, price: 750, total: 750 }
    ];
    
    tickets.forEach((ticket, index) => {
      doc.setTextColor(darkGray);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(ticket.name, 25, yPos + (index * 10));
      doc.text(`× ${ticket.qty}`, 85, yPos + (index * 10));
      doc.setFont('helvetica', 'bold');
      doc.text(`${ticket.total.toLocaleString()}`, 105, yPos + (index * 10));
    });
    
    yPos += 30;
    
    // Total line
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(1);
    doc.line(20, yPos, 20 + leftColumnWidth, yPos);
    
    yPos += 8;
    doc.setTextColor(darkGray);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL', 25, yPos);
    doc.setTextColor(primaryColor);
    doc.setFontSize(12);
    doc.text('KSh 3,250', 105, yPos);
    
    // RIGHT COLUMN - QR CODE SECTION
    const qrSize = 70;
    const qrX = rightColumnStart + 5;
    const qrY = detailsStartY;
    
    // QR code container with modern styling
    doc.setFillColor(white);
    doc.roundedRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 8, 8, 'F');
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(2);
    doc.roundedRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 8, 8, 'S');
    
    if (qrCodeDataURL) {
      try {
        doc.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrSize, qrSize);
        console.log('QR code added to PDF successfully at position:', qrX, qrY);
      } catch (error) {
        console.error('Error adding QR code to PDF:', error);
      }
    }
    
    // QR code label
    doc.setTextColor(darkGray);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('SCAN AT', qrX + (qrSize/2), qrY + qrSize + 8, { align: 'center' });
    doc.text('ENTRANCE', qrX + (qrSize/2), qrY + qrSize + 14, { align: 'center' });
    
    // IMPORTANT INSTRUCTIONS
    yPos += 20;
    doc.setFillColor('#FEF3C7');
    doc.roundedRect(15, yPos, pageWidth - 30, 30, 8, 8, 'F');
    doc.setDrawColor('#F59E0B');
    doc.setLineWidth(1);
    doc.roundedRect(15, yPos, pageWidth - 30, 30, 8, 8, 'S');
    
    doc.setTextColor('#92400E');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('IMPORTANT INSTRUCTIONS', 25, yPos + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('• Please bring a valid ID for verification', 25, yPos + 16);
    doc.text('• Show this ticket or QR code at entrance', 25, yPos + 24);
    
    // MODERN FOOTER
    const footerY = pageHeight - 25;
    doc.setFillColor(primaryColor);
    doc.rect(0, footerY - 5, pageWidth, 30, 'F');
    
    doc.setTextColor(white);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Thank you for choosing Wildlife Zoo!', pageWidth / 2, footerY + 5, { align: 'center' });
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('www.wildlifezoo.com | support@wildlifezoo.com | +254 700 000 000', pageWidth / 2, footerY + 15, { align: 'center' });
    
    // Generate PDF blob and open in new tab
    console.log('Generating PDF blob...');
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    console.log('Opening PDF in new tab...');
    window.open(pdfUrl, '_blank');
    
    // Clean up the URL after a delay
    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 1000);
    
    toast.success('Professional E-ticket PDF opened in new tab!');
  };

  const handleExportToCalendar = (booking: Booking) => {
    const totalTickets = booking.tickets
      ? booking.tickets.adult.quantity + booking.tickets.child.quantity + booking.tickets.senior.quantity
      : booking.quantity || 0;
    
    // Create iCal format
    const visitDate = new Date(booking.visit_date || booking.visitDate || '');
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
DESCRIPTION:Wildlife Zoo Visit\\nTickets: ${totalTickets}\\nAmount: ${formatCurrency(booking.totalPrice || booking.totalAmount || 0)}
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
    const visitDate = new Date(booking.visit_date || booking.visitDate || '');
    const now = new Date();
    const daysDifference = Math.ceil((visitDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return booking.status === 'CONFIRMED' && daysDifference >= 2;
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
                        {formatDate(booking.visit_date || booking.visitDate || '')}
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
                        {booking.tickets 
                          ? booking.tickets.adult.quantity + booking.tickets.child.quantity + booking.tickets.senior.quantity
                          : booking.quantity}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                      <p className="text-lg font-semibold text-primary">
                        {formatCurrency(booking.totalPrice || booking.totalAmount || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {booking.status === 'CONFIRMED' && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center">
                        <CheckCircle size={16} className="mr-1" />
                        Confirmed
                      </span>
                    )}
                    {booking.status === 'CANCELLED' && (
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
                      <QRCodeSVG value={booking.bookingReference || booking.id || 'N/A'} size={120} />
                    </div>
                    <div className="flex flex-col space-y-2 w-full">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleDownloadTicket}
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
                    <span className="font-semibold">Visit Date:</span> {formatDate(selectedBooking.visit_date || selectedBooking.visitDate || '')}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Amount:</span> {formatCurrency(selectedBooking.totalPrice || selectedBooking.totalAmount || 0)}
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





