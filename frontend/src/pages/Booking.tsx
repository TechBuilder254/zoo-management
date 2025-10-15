import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Users, TrendingDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBooking } from '../hooks/useBooking';
import { bookingService } from '../services/bookingService';
import { promoService } from '../services/promoService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { DatePicker } from '../components/booking/DatePicker';
import { TicketSelector } from '../components/booking/TicketSelector';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

export const Booking: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { visitDate, tickets, setVisitDate, updateTickets, getTotalAmount, getTotalTickets } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoData, setPromoData] = useState<any>(null);

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
  
  // Calculate group discount (10% for 5+ tickets, 15% for 10+ tickets)
  const groupDiscountPercentage = totalTickets >= 10 ? 15 : totalTickets >= 5 ? 10 : 0;
  const groupDiscount = groupDiscountPercentage > 0 ? (totalAmount * groupDiscountPercentage) / 100 : 0;
  
  // Calculate final amount
  const subtotal = totalAmount - groupDiscount;
  const promoDiscount = promoApplied && promoData ? promoData.discountAmount : 0;
  const finalAmount = subtotal - promoDiscount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }

    setIsApplyingPromo(true);
    try {
      const response = await promoService.validate(promoCode.toUpperCase(), subtotal);
      
      if (response.valid) {
        setPromoData(response);
        setPromoApplied(true);
        toast.success(`Promo code applied! ${response.promoCode?.discountType === 'PERCENTAGE' ? `${response.promoCode.discountValue}%` : formatCurrency(response.promoCode?.discountValue || 0)} discount`);
      } else {
        toast.error('Invalid or expired promo code');
      }
    } catch (error: any) {
      console.error('Promo validation error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to validate promo code';
      toast.error(errorMessage);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setPromoData(null);
    toast.success('Promo code removed');
  };

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
        visit_date: visitDate.toISOString(),
        visitDate: visitDate.toISOString(),
        ticket_type: 'mixed',
        quantity: totalTickets,
        tickets,
        promoCode: promoApplied ? promoData?.promoCode?.id : undefined,
        discountAmount: promoApplied ? promoData?.discountAmount : 0,
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

                {/* Promo Code Section */}
                <div className="pt-4 border-t dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Tag size={16} className="inline mr-1" />
                    Promo Code
                  </label>
                  {!promoApplied ? (
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        disabled={isApplyingPromo}
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyPromo}
                        isLoading={isApplyingPromo}
                        disabled={!promoCode.trim()}
                      >
                        Apply
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center text-green-700 dark:text-green-400">
                        <Tag size={16} className="mr-2" />
                        <span className="font-semibold">{promoCode}</span>
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Try: WILDLIFE10, FAMILY15, SUMMER20
                  </p>
                </div>

                {/* Group Discount Indicator */}
                {groupDiscountPercentage > 0 && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Users size={18} className="text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-blue-900 dark:text-blue-300 text-sm">
                          Group Discount Applied!
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                          {groupDiscountPercentage}% off for {totalTickets}+ tickets
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Calculation Summary */}
                <div className="pt-4 border-t-2 border-gray-300 dark:border-gray-600 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                      Subtotal ({totalTickets} tickets)
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {formatCurrency(totalAmount)}
                    </p>
                  </div>

                  {groupDiscount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-green-600 dark:text-green-400 flex items-center">
                        <TrendingDown size={14} className="mr-1" />
                        Group Discount ({groupDiscountPercentage}%)
                      </p>
                      <p className="text-green-600 dark:text-green-400">
                        -{formatCurrency(groupDiscount)}
                      </p>
                    </div>
                  )}

                  {promoDiscount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-green-600 dark:text-green-400 flex items-center">
                        <Tag size={14} className="mr-1" />
                        Promo Discount ({promoData?.promoCode?.discountType === 'PERCENTAGE' ? `${promoData.promoCode.discountValue}%` : formatCurrency(promoData?.promoCode?.discountValue || 0)})
                      </p>
                      <p className="text-green-600 dark:text-green-400">
                        -{formatCurrency(promoDiscount)}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t dark:border-gray-700">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      Total Amount
                    </p>
                    <div className="text-right">
                      {(groupDiscount > 0 || promoDiscount > 0) && (
                        <p className="text-sm text-gray-500 line-through">
                      {formatCurrency(totalAmount)}
                    </p>
                      )}
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(finalAmount)}
                      </p>
                      {(groupDiscount + promoDiscount) > 0 && (
                        <p className="text-xs text-green-600">
                          You save {formatCurrency(groupDiscount + promoDiscount)}!
                        </p>
                      )}
                    </div>
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






