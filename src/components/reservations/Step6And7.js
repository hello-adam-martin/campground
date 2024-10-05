import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../CheckoutForm';
import config from '../../config/appConfig';
import { Card, CardContent } from '../ui/card'; // Import Card components
import { format, differenceInDays } from 'date-fns';

const stripePromise = loadStripe(config.stripe.publishableKey);

const Step6And7 = ({ formData, selectedExtras, totalPrice, siteTypes, onPaymentSuccess, onPaymentError }) => {
  // Calculate the total price of additional services
  const extrasTotal = Object.values(selectedExtras).reduce((total, service) => 
    total + (service.price * service.quantity), 0);

  // Calculate the reservation price based on total price and extras total
  const reservationPrice = totalPrice - extrasTotal;

  return (
    <>
      <h3 className="text-lg lg:text-xl font-semibold mb-4">Step 6: Review, Confirm, and Payment</h3>
      <div className="space-y-6">
        {/* Reservation Details Card */}
        <Card className="bg-blue-50 shadow-md rounded-md">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><strong>Check-in Date:</strong> {format(formData.startDate, 'MMM d, yyyy')}</p>
                <p><strong>Check-out Date:</strong> {format(formData.endDate, 'MMM d, yyyy')}</p>
                <p><strong>Number of Nights:</strong> {differenceInDays(formData.endDate, formData.startDate)}</p>
                <p><strong>Site Type:</strong> {siteTypes.find(type => type.id === formData.siteType)?.name}</p>
                {formData.siteNumber && <p><strong>Site Number:</strong> {formData.siteNumber}</p>}
              </div>
              <div className="space-y-2">
                <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phoneNumber}</p>
                <p><strong>Guests:</strong> {formData.adultCount} Adults, {formData.childCount} Children</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Services Card */}
        {Object.values(selectedExtras).length > 0 || reservationPrice > 0 ? (
          <Card className="bg-white shadow-md rounded-md">
            <CardContent className="p-6">
              <ul className="list-disc pl-5">
                {reservationPrice > 0 && (
                  <li className="flex justify-between">
                    <span>Reservation Price ({formData.nights} nights)</span>
                    <span>${reservationPrice.toFixed(2)}</span>
                  </li>
                )}
                {reservationPrice > 0 && <div className="border-t border-gray-300 my-2" />} {/* Separator line */}
                {Object.values(selectedExtras).map(service => (
                  <li key={service.id} className="flex justify-between">
                    <span>{service.name} (x{service.quantity})</span>
                    <span>${(service.price * service.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between mt-4 border-t border-gray-300 my-2">
                <span>Subtotal for Additional Services:</span>
                <span>${extrasTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold mt-2">
                <span>Total Price:</span>
                <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Payment Section Card */}
        <Card className="bg-white shadow-md rounded-md">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4">Payment Information</h4>
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                totalAmount={totalPrice} // Use the original totalPrice prop for payment
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
              />
            </Elements>
          </CardContent>
        </Card>

        <p className="text-sm text-gray-600">
          Please review your reservation details above. If everything is correct, click "Proceed to Payment" to complete your booking.
        </p>
      </div>
    </>
  );
};

export default Step6And7;