import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBooking } from '../hooks/useBooking';
import { bookingService } from '../services/bookingService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { DatePicker } from '../components/booking/DatePicker';
import { TicketSelector } from '../components/booking/TicketSelector';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

export const Booking: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { visitDate, tickets, setVisitDate, updateTickets, getTotalAmount, getTotalTickets } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
        <Card padding="lg" className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Login Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please login to book tickets for your zoo visit
          </p>
          <Button variant="primary" onClick={() => navigate('/login')} fullWidth>
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  const totalAmount = getTotalAmount();
  const totalTickets = getTotalTickets();

  const handleProceedToPayment = async () => {
    if (!visitDate) {
      toast.error('Please select a visit date');
      return;
    }

    if (totalTickets === 0) {
      toast.error('Please select at least one ticket');
      return;
    }

    setIsProcessing(true);
    try {
      const bookingData = {
        visitDate: visitDate.toISOString(),
        tickets,
      };
      
      const booking = await bookingService.create(bookingData);
      toast.success('Booking created successfully!');
      navigate(`/booking-confirmation/${booking._id}`);
    } catch (error) {
      toast.error('Failed to create booking. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Book Your Visit
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Select your visit date and number of tickets
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Visit Details
              </h2>
              <DatePicker
                selectedDate={visitDate}
                onDateChange={setVisitDate}
                minDate={new Date()}
                label="Select Visit Date"
              />
            </Card>

            <Card padding="lg">
              <TicketSelector
                tickets={tickets}
                onUpdateQuantity={updateTickets}
              />
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card padding="lg" className="sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {visitDate && (
                  <div className="pb-4 border-b dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Visit Date
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {visitDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {tickets.adult.quantity > 0 && (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-900 dark:text-white">Adult</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(tickets.adult.price)} × {tickets.adult.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(tickets.adult.price * tickets.adult.quantity)}
                      </p>
                    </div>
                  )}

                  {tickets.child.quantity > 0 && (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-900 dark:text-white">Child</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(tickets.child.price)} × {tickets.child.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(tickets.child.price * tickets.child.quantity)}
                      </p>
                    </div>
                  )}

                  {tickets.senior.quantity > 0 && (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-900 dark:text-white">Senior</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(tickets.senior.price)} × {tickets.senior.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(tickets.senior.price * tickets.senior.quantity)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t-2 border-gray-300 dark:border-gray-600">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total Tickets
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {totalTickets}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(totalAmount)}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleProceedToPayment}
                disabled={!visitDate || totalTickets === 0 || isProcessing}
                isLoading={isProcessing}
              >
                Proceed to Payment
              </Button>

              <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-4">
                By proceeding, you agree to our terms and conditions
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};




