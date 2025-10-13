import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { CreditCard, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentMethodId: string) => void;
  onError?: (error: string) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe has not loaded yet');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error('Card element not found');
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        onError?.(error.message || 'Payment failed');
      } else if (paymentMethod) {
        toast.success('Payment method created successfully!');
        onSuccess(paymentMethod.id);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <CreditCard size={24} className="mr-2 text-primary" />
          Payment Details
        </h3>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Lock size={16} className="mr-1" />
          Secure Payment
        </div>
      </div>

      <div className="mb-6 p-4 bg-primary-light dark:bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount:</span>
          <span className="text-2xl font-bold text-primary">{formatCurrency(amount)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Card Information
          </label>
          <div className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <CardElement options={cardElementOptions} />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Your payment information is secure and encrypted
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Test Card Numbers:</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• Success: 4242 4242 4242 4242</li>
            <li>• Declined: 4000 0000 0000 0002</li>
            <li>• Any future expiry date and CVC</li>
          </ul>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isProcessing}
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay ${formatCurrency(amount)}`}
        </Button>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          By completing this purchase, you agree to our Terms of Service and Privacy Policy
        </p>
      </form>
    </Card>
  );
};

