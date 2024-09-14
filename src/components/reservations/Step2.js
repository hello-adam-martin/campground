import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Minus, AlertTriangle, Loader } from 'lucide-react';
import ReservationCalendar from '../ReservationCalendar';
import { getAvailableSites } from '../../services/api';
import { startOfMonth } from 'date-fns';

const Step2 = ({ formData, handleDateSelect, handleNightsChange }) => {
  const [availability, setAvailability] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(startOfMonth(new Date()));

  useEffect(() => {
    const fetchAvailability = async () => {
      if (formData.siteType) {
        setIsLoading(true);
        setError(null);
        try {
          const availabilityData = await getAvailableSites(
            calendarMonth,
            formData.siteType
          );
          setAvailability(prevAvailability => ({...prevAvailability, ...availabilityData}));
        } catch (error) {
          console.error('Error fetching availability:', error);
          setError('Failed to fetch availability. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAvailability();
  }, [formData.siteType, calendarMonth]);

  const handleChangeMonth = (newMonth) => {
    setCalendarMonth(newMonth);
  };

  const incrementNights = () => {
    handleNightsChange(formData.nights + 1);
  };

  const decrementNights = () => {
    handleNightsChange(Math.max(1, formData.nights - 1));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg lg:text-xl font-semibold mb-4">Step 2: Select Dates</h3>
      
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Loader className="animate-spin mr-2" />
          <p>Loading availability...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <ReservationCalendar 
          availableSites={availability}
          onDateSelect={handleDateSelect}
          selectedDate={formData.startDate}
          siteType={formData.siteType}
          onChangeMonth={handleChangeMonth}
          startDate={calendarMonth}
        />
      )}

      {formData.startDate && (
        <div className="mt-4">
          <label htmlFor="nights" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Nights
          </label>
          <div className="flex items-center">
            <Button 
              type="button" 
              onClick={decrementNights}
              className="px-3 py-2"
              disabled={formData.nights <= 1}
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
            />
            <Button 
              type="button" 
              onClick={incrementNights}
              className="px-3 py-2"
              disabled={formData.nights >= formData.maxNights}
            >
              <Plus size={16} />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Maximum stay: {formData.maxNights} nights</p>
        </div>
      )}
    </div>
  );
};

export default Step2;