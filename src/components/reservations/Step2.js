import React, { useState, useEffect } from 'react';
import { AlertTriangle, Loader } from 'lucide-react';
import ReservationCalendar from '../ReservationCalendar';
import { getAvailableSites } from '../../services/api';
import { startOfMonth, differenceInDays } from 'date-fns';

const Step2 = ({ formData, handleDateSelect }) => {
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

  const handleDateRangeSelect = (start, end) => {
    handleDateSelect(start, end);
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
          onDateSelect={handleDateRangeSelect}
          checkInDate={formData.startDate}
          checkOutDate={formData.endDate}
          siteType={formData.siteType}
          onChangeMonth={handleChangeMonth}
          startDate={calendarMonth}
        />
      )}

      {formData.startDate && formData.endDate && (
        <div className="mt-4">
          <p className="text-sm text-gray-700">
            Selected stay: {differenceInDays(formData.endDate, formData.startDate)} nights
          </p>
        </div>
      )}
    </div>
  );
};

export default Step2;