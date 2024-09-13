import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Minus } from 'lucide-react';
import ReservationCalendar from '../ReservationCalendar';

const Step2 = ({ formData, availableSites, handleDateSelect, handleNightsChange }) => {
  const incrementNights = () => {
    if (formData.nights < formData.maxNights) {
      handleNightsChange(formData.nights + 1);
    }
  };

  const decrementNights = () => {
    if (formData.nights > 1) {
      handleNightsChange(formData.nights - 1);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg lg:text-xl font-semibold mb-4">Step 2: Select Your Arrival Date and Duration</h3>
      <ReservationCalendar 
        availableSites={availableSites}
        onDateSelect={handleDateSelect}
        selectedDate={formData.startDate}
        siteType={formData.siteType}
      />
      {formData.startDate && (
        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="nights" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Nights
            </label>
            <div className="flex items-center">
              <Button 
                type="button" 
                onClick={decrementNights} 
                disabled={formData.nights <= 1}
                className="px-3 py-2"
              >
                <Minus size={16} />
              </Button>
              <Input
                type="number"
                id="nights"
                name="nights"
                value={formData.nights}
                onChange={(e) => handleNightsChange(parseInt(e.target.value) || 1)}
                min="1"
                max={formData.maxNights}
                className="mx-2 w-20 text-center"
                readOnly
              />
              <Button 
                type="button" 
                onClick={incrementNights} 
                disabled={formData.nights >= formData.maxNights}
                className="px-3 py-2"
              >
                <Plus size={16} />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-1">Maximum stay: {formData.maxNights} nights</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-md">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Check-in:</p>
                <p className="text-sm">{formData.startDate.toLocaleDateString()}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Check-out:</p>
                <p className="text-sm">{new Date(formData.startDate.getTime() + formData.nights * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Total nights:</p>
                <p className="text-sm">{formData.nights}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2;