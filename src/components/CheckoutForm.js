import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { CreditCard } from 'lucide-react';
import config from '../config/appConfig';
import { mockApi } from '../services/mockApi';

const CheckoutForm = ({ totalAmount, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!stripe || !elements) {
      setErrorMessage('Stripe has not loaded. Please try again later.');
      return;
    }

    setIsProcessing(true);

    try {
      const { clientSecret } = await mockApi.createPaymentIntent(
        Math.round(totalAmount * 100), // amount in cents
        config.stripe.currency
      );

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            // You can add billing details here if needed
          },
        }
      });

      if (result.error) {
        throw new Error(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          onPaymentSuccess(result.paymentIntent);
        } else {
          throw new Error('Payment was not successful. Please try again.');
        }
      }
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred while processing your payment. Please try again.');
      onPaymentError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-md p-3">
        <CardElement options={{
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
        }} />
      </div>
      {errorMessage && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
      >
        <CreditCard className="mr-2" size={20} />
        {isProcessing ? 'Processing...' : `Pay ${config.stripe.currency} $${totalAmount.toFixed(2)}`}
      </Button>
    </form>
  );
};

export default CheckoutForm;