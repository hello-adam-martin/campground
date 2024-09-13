// src/components/reservations/Step7.js
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../CheckoutForm';
import config from '../../config/appConfig';

const stripePromise = loadStripe(config.stripe.publishableKey);

const Step7 = ({ totalPrice, onPaymentSuccess, onPaymentError }) => {
  return (
    <>
      <h3 className="text-lg lg:text-xl font-semibold mb-4">Step 7: Payment</h3>
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-md">
          <h4 className="font-semibold mb-2">Reservation Summary:</h4>
          <p>Total Price: ${totalPrice.toFixed(2)}</p>
        </div>
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            totalAmount={totalPrice}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
          />
        </Elements>
      </div>
    </>
  );
};

export default Step7;