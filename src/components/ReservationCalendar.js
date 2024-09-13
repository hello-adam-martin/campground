import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { format, addDays, eachDayOfInterval, isSameDay, isAfter, startOfDay, parseISO } from 'date-fns';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

const ReservationCalendar = ({ availableSites, onDateSelect, selectedDate, siteType }) => {
  const [startDate, setStartDate] = useState(startOfDay(new Date()));

  const days = useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: addDays(startDate, 4) });
  }, [startDate]);

  const handlePrevDays = useCallback(() => setStartDate(prevDate => addDays(prevDate, -5)), []);
  const handleNextDays = useCallback(() => setStartDate(prevDate => addDays(prevDate, 5)), []);

  const maxAvailableNights = useMemo(() => {
    const result = {};
    Object.keys(availableSites).forEach(dateStr => {
      let nights = 0;
      let currentDate = parseISO(dateStr);
      while (availableSites[format(currentDate, 'yyyy-MM-dd')] &&
             availableSites[format(currentDate, 'yyyy-MM-dd')][siteType] > 0) {
        nights++;
        currentDate = addDays(currentDate, 1);
      }
      result[dateStr] = nights;
    });
    return result;
  }, [availableSites, siteType]);

  const handleDateClick = useCallback((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    if (availableSites[dateStr] && availableSites[dateStr][siteType] > 0) {
      onDateSelect(day, maxAvailableNights[dateStr]);
    }
  }, [availableSites, maxAvailableNights, onDateSelect, siteType]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handlePrevDays} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {format(days[0], 'MMM d')} - {format(days[days.length - 1], 'MMM d, yyyy')}
          </h2>
          <Button onClick={handleNextDays} variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isAvailable = availableSites[dateStr] && availableSites[dateStr][siteType] > 0;
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isPast = isAfter(startOfDay(new Date()), day);

            return (
              <div key={day.toISOString()} className="text-center">
                <div className="font-medium">{format(day, 'EEE')}</div>
                <div className="text-sm">{format(day, 'd')}</div>
                <div className="mt-2">
                  <Button 
                    onClick={() => handleDateClick(day)} 
                    variant="outline" 
                    size="sm"
                    className={`w-full h-16 flex flex-col items-center justify-center ${
                      isSelected 
                        ? 'bg-blue-500 text-white' 
                        : isAvailable 
                          ? 'bg-green-100 hover:bg-green-200 text-green-800' 
                          : 'bg-red-100 text-red-800 cursor-not-allowed'
                    } ${isPast ? 'opacity-50' : ''}`}
                    disabled={!isAvailable || isPast}
                  >
                    {isSelected ? (
                      <Check className="w-5 h-5" />
                    ) : isAvailable ? (
                      <>
                        <span className="text-xs">Available</span>
                        <span className="text-xs">Up to {maxAvailableNights[dateStr]} nights</span>
                      </>
                    ) : (
                      <span className="text-xs">Full</span>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationCalendar;