// src/components/reservations/Step6.js
import React from 'react';

const Step6 = ({ formData, selectedExtras, totalPrice, siteTypes }) => {
  return (
    <>
      <h3 className="text-lg lg:text-xl font-semibold mb-4">Step 6: Review and Confirm</h3>
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-md">
          <h4 className="font-semibold mb-2">Reservation Details:</h4>
          <p>Check-in Date: {formData.startDate?.toLocaleDateString()}</p>
          <p>Number of Nights: {formData.nights}</p>
          <p>Check-out Date: {new Date(formData.startDate?.getTime() + formData.nights * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
          <p>Site Type: {siteTypes.find(type => type.id === formData.siteType)?.name}</p>
          {formData.siteNumber && <p>Site Number: {formData.siteNumber}</p>}
          <p>Guests: {formData.adultCount} Adults, {formData.childCount} Children</p>
          <p>Name: {formData.firstName} {formData.lastName}</p>
          <p>Email: {formData.email}</p>
          <p>Phone: {formData.phoneNumber}</p>
          {Object.values(selectedExtras).length > 0 && (
            <>
              <h5 className="font-semibold mt-2">Additional Services:</h5>
              <ul className="list-disc pl-5">
                {Object.values(selectedExtras).map(service => (
                  <li key={service.id}>
                    {service.name} (x{service.quantity}) - ${(service.price * service.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="font-bold mt-2">Total Price: ${totalPrice.toFixed(2)}</p>
        </div>
        <p className="text-sm text-gray-600">
          Please review your reservation details above. If everything is correct, click "Proceed to Payment" to complete your booking.
        </p>
      </div>
    </>
  );
};

export default Step6;