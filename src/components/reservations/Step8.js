// src/components/reservations/Step8.js
import React from 'react';
import { Button } from '../ui/button';
import { MapPin, Info } from 'lucide-react';

const Step8 = ({ formData, siteTypes, rules, onReturnToKiosk }) => {
  return (
    <>
      <h3 className="text-lg lg:text-xl font-semibold mb-4">Reservation Confirmed!</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-lg flex items-center mb-2">
            <MapPin className="mr-2 h-5 w-5 text-blue-600" />
            Your Campsite Information
          </h4>
          <div className="bg-blue-50 p-4 rounded-md">
            <p><strong>Site Number:</strong> {formData.siteNumber}</p>
            <p><strong>Site Type:</strong> {siteTypes.find(type => type.id === formData.siteType)?.name}</p>
            <p><strong>Check-in Date:</strong> {formData.startDate?.toLocaleDateString()}</p>
            <p><strong>Check-out Date:</strong> {new Date(formData.startDate?.getTime() + formData.nights * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            <p><strong>Number of Nights:</strong> {formData.nights}</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-lg flex items-center mb-2">
            <Info className="mr-2 h-5 w-5 text-blue-600" />
            Campground Rules
          </h4>
          <ul className="list-disc pl-5 space-y-2">
            {rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-gray-600">
          For more information or assistance, please visit the campground office.
        </p>
        <Button 
          onClick={onReturnToKiosk}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Return to Kiosk
        </Button>
      </div>
    </>
  );
};

export default Step8;