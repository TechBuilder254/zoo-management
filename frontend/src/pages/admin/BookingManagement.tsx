import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, Trash2, User, Calendar, CreditCard, CheckCircle, XCircle, Mail, Ticket } from 'lucide-react';
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
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const BookingManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getAll({ page: 1, limit: 500 });
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
    ((booking.user?.name || booking.users?.name || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
    ((booking.user?.email || booking.users?.email || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
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

  const handleConfirmBooking = async (booking: Booking) => {
    if (booking.status === 'CONFIRMED') {
      toast('Already confirmed');
      return;
    }
    try {
      const updated = await bookingService.update(booking.id, { status: 'CONFIRMED', payment_status: 'COMPLETED' } as any);
      setBookings(prev => prev.map(b => (b.id === booking.id ? updated : b)));
      toast.success('Booking confirmed');
    } catch (error) {
      console.error('Failed to confirm booking:', error);
      toast.error('Failed to confirm booking');
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!selectedBooking) return;

    const canDelete = (currentUser?.role === 'ADMIN' || currentUser?.role === 'admin') || selectedBooking.user_id === currentUser?.id;
    if (!canDelete) {
      toast.error('You do not have permission to delete this booking');
      return;
    }

    if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      try {
        await toast.promise(
          bookingService.delete(bookingId),
          {
            loading: 'Deleting booking…',
            success: 'Booking deleted successfully',
            error: 'Failed to delete booking',
          }
        );
        setBookings(prev => prev.filter(b => b.id !== bookingId));
        handleCloseModal();
      } catch (error) {
        console.error('Failed to delete booking:', error);
      }
    }
  };

  // Direct delete from table actions (without opening modal)
  const handleDeleteBookingDirect = async (booking: Booking) => {
    const canDelete = (currentUser?.role === 'ADMIN' || currentUser?.role === 'admin') || booking.user_id === currentUser?.id;
    if (!canDelete) {
      toast.error('You do not have permission to delete this booking');
      return;
    }
    if (!window.confirm('Delete this booking permanently? This cannot be undone.')) return;
    try {
      await toast.promise(
        bookingService.delete(booking.id),
        {
          loading: 'Deleting booking…',
          success: 'Booking deleted',
          error: 'Failed to delete booking',
        }
      );
      setBookings(prev => prev.filter(b => b.id !== booking.id));
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  const handleCancelBooking = async (booking: Booking) => {
    try {
      const updated = await bookingService.update(booking.id, { status: 'CANCELLED' } as any);
      setBookings(prev => prev.map(b => (b.id === booking.id ? updated : b)));
      toast.success('Booking cancelled');
      handleCloseModal();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const handleDownload = (booking: Booking) => {
    navigate(`/booking-confirmation/new`, { state: { booking } as any });
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
               {formatCurrency(bookings.reduce((sum, b) => sum + (b.total_price || b.totalPrice || b.totalAmount || 0), 0))}
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
                   <th className="w-12 text-left py-3 px-4 font-medium text-gray-900 dark:text-white">#</th>
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
                   filteredBookings.map((booking, index) => (
                     <tr key={booking.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                       <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                       <td className="py-4 px-4">
                         <div className="font-mono text-sm text-gray-900 dark:text-white">
                           {booking.id.substring(0, 8)}...
                         </div>
                       </td>
                       <td className="py-4 px-4">
                         <div>
                           <p className="font-medium text-gray-900 dark:text-white">
                             {booking.user?.name || booking.users?.name || 'Guest'}
                           </p>
                           <p className="text-sm text-gray-500 dark:text-gray-400">
                             {booking.user?.email || booking.users?.email || 'N/A'}
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
                           {formatCurrency(booking.total_price || booking.totalPrice || booking.totalAmount || 0)}
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
                             onClick={() => handleConfirmBooking(booking)}
                             title="Confirm booking"
                           >
                             <CheckCircle size={16} />
                           </Button>
                           <Button
                             variant="outline"
                             size="sm"
                             className="p-2"
                             onClick={() => handleDownload(booking)}
                           >
                             <Download size={16} />
                           </Button>
                           <Button
                             variant="outline"
                             size="sm"
                             className="p-2 text-red-600 hover:text-red-700"
                             title="Delete booking"
                             onClick={() => handleDeleteBookingDirect(booking)}
                           >
                             <Trash2 size={16} />
                           </Button>
                         </div>
                       </td>
                     </tr>
                   ))
                 ) : (
                   <tr>
                     <td colSpan={8} className="py-8 text-center text-gray-500 dark:text-gray-400">
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
                         {booking.user?.name || booking.users?.name || 'Guest'}
                       </h3>
                       <p className="text-sm text-gray-600 dark:text-gray-400">
                         {booking.user?.email || booking.users?.email || 'N/A'}
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
                       <span>{formatCurrency(booking.total_price || booking.totalPrice || booking.totalAmount || 0)}</span>
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
             <div className="space-y-5">
               {/* Header summary */}
               <div className="flex items-start justify-between">
                 <div>
                   <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Booking</p>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                     #{selectedBooking.id.substring(0, 8)}
                   </h3>
                 </div>
                 <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedBooking.status)}`}>
                   {selectedBooking.status}
                 </span>
               </div>

               {/* Customer */}
               <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
                 <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Customer</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                   <div className="flex items-center text-gray-700 dark:text-gray-300">
                     <User size={16} className="mr-2 text-gray-400" />
                     <span>{selectedBooking.user?.name || selectedBooking.users?.name || 'Guest'}</span>
                   </div>
                   <div className="flex items-center text-gray-700 dark:text-gray-300">
                     <Mail size={16} className="mr-2 text-gray-400" />
                     <span>{selectedBooking.user?.email || selectedBooking.users?.email || 'N/A'}</span>
                   </div>
                 </div>
               </div>

               {/* Visit details */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                   <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Visit Date</p>
                   <div className="flex items-center text-gray-900 dark:text-white">
                     <Calendar size={16} className="mr-2 text-gray-400" />
                     {format(new Date(selectedBooking.visit_date || selectedBooking.visitDate || ''), 'MMM dd, yyyy')}
                   </div>
                 </div>
                 <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                   <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Tickets</p>
                   <div className="flex items-center text-gray-900 dark:text-white">
                     <Ticket size={16} className="mr-2 text-gray-400" />
                     {selectedBooking.quantity || 0}
                   </div>
                 </div>
               </div>

               {/* Amount */}
               <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                 <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Total Amount</p>
                 <div className="flex items-center text-gray-900 dark:text-white text-xl font-bold">
                   <CreditCard size={18} className="mr-2 text-gray-400" />
                   {formatCurrency(selectedBooking.total_price || selectedBooking.totalPrice || selectedBooking.totalAmount || 0)}
                 </div>
               </div>

               {/* Actions */}
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                 <div className="flex flex-wrap gap-2">
                   {(['PENDING'] as const).includes((selectedBooking.status || '').toUpperCase() as any) && (
                     <Button
                       variant="outline"
                       onClick={() => handleConfirmBooking(selectedBooking)}
                       className="flex items-center space-x-2"
                     >
                       <CheckCircle size={16} />
                       <span>Confirm</span>
                     </Button>
                   )}
                   {(['PENDING'] as const).includes((selectedBooking.status || '').toUpperCase() as any) && (
                     <Button
                       variant="outline"
                       onClick={() => handleCancelBooking(selectedBooking)}
                       className="flex items-center space-x-2"
                     >
                       <XCircle size={16} />
                       <span>Cancel</span>
                     </Button>
                   )}
                   {(currentUser?.role === 'ADMIN' || currentUser?.role === 'admin' || selectedBooking.user_id === currentUser?.id) && (
                     <Button
                       variant="outline"
                       onClick={() => handleDeleteBooking(selectedBooking.id)}
                       className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                     >
                       <Trash2 size={16} />
                       <span>Delete</span>
                     </Button>
                   )}
                 </div>
                 <div className="flex gap-2 sm:ml-auto">
                   <Button variant="outline" onClick={() => handleDownload(selectedBooking)}>Download</Button>
                   <Button variant="outline" onClick={handleCloseModal}>Close</Button>
                 </div>
               </div>
             </div>
           )}
         </Modal>
       </AdminLayout>
  );
};
