import React, { useMemo } from 'react';
import { format, addMonths, eachDayOfInterval, isSameDay, isBefore, isWithinInterval, startOfMonth, endOfMonth, getDay } from 'date-fns';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, CornerRightDown, CornerRightUp } from 'lucide-react';

const ReservationCalendar = ({ availableSites, onDateSelect, checkInDate, checkOutDate, siteType, onChangeMonth, startDate }) => {
  const monthStart = startOfMonth(startDate);
  // const monthEnd = endOfMonth(monthStart); // Removed unused variable
  const calendarStart = monthStart;
  const calendarEnd = endOfMonth(monthStart);

  const days = useMemo(() => {
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [calendarStart, calendarEnd]);

  const handlePrevMonth = () => {
    onChangeMonth(addMonths(monthStart, -1));
  };

  const handleNextMonth = () => {
    onChangeMonth(addMonths(monthStart, 1));
  };

  const handleDateClick = (day) => {
    if (!isBefore(day, new Date())) {
      if (!checkInDate || (checkInDate && checkOutDate)) {
        onDateSelect(day, null);
      } else if (isBefore(day, checkInDate)) {
        onDateSelect(day, checkInDate);
      } else if (isSameDay(day, checkInDate)) { // Prevent same date for check-in and check-out
        return; // Do nothing if the same date is selected
      } else {
        onDateSelect(checkInDate, day);
      }
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handlePrevMonth} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {format(monthStart, 'MMMM yyyy')}
          </h2>
          <Button onClick={handleNextMonth} variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-gray-500">
              {day}
            </div>
          ))}
          {Array(getDay(monthStart)).fill(null).map((_, index) => (
            <div key={`empty-start-${index}`} className="text-center opacity-0">
              <div className="text-sm">&nbsp;</div>
              <div className="mt-1">
                <Button variant="outline" size="sm" className="w-full h-16 invisible">
                  &nbsp;
                </Button>
              </div>
            </div>
          ))}
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const availableCount = availableSites[dateStr];
            const isCheckIn = checkInDate && isSameDay(day, checkInDate);
            const isCheckOut = checkOutDate && isSameDay(day, checkOutDate);
            const isInRange = checkInDate && checkOutDate && isWithinInterval(day, { start: checkInDate, end: checkOutDate });
            const isPast = isBefore(day, new Date());

            return (
              <div key={day.toISOString()} className="text-center">
                <div className="text-sm">{format(day, 'd')}</div>
                <div className="mt-1">
                  <Button 
                    onClick={() => handleDateClick(day)} 
                    variant="outline" 
                    size="sm"
                    className={`w-full h-16 flex flex-col items-center justify-center ${
                      isCheckIn || isCheckOut
                        ? 'bg-blue-500 text-white' 
                        : isInRange
                          ? 'bg-blue-100 text-blue-800'
                          : isPast
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : availableCount > 0
                              ? 'bg-green-100 hover:bg-green-200 text-green-800'
                              : 'bg-red-100 text-red-800 cursor-not-allowed'
                    }`}
                    disabled={isPast || availableCount === 0}
                  >
                    {isCheckIn && (
                      <>
                        <CornerRightDown className="h-4 w-4" />
                        <span className="text-xs">Arrive</span>
                      </>
                    )}
                    {isCheckOut && (
                      <>
                        <CornerRightUp className="h-4 w-4" />
                        <span className="text-xs">Leave</span>
                      </>
                    )}
                    {!isCheckIn && !isCheckOut && (
                      <span className="text-xs">
                        {availableCount ?? 'N/A'}
                      </span>
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