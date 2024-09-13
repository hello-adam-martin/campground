import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Calendar } from 'lucide-react';

const DateSelection = ({ startDate, nights, handleStartDateChange, handleNightsChange }) => {
  const endDate = startDate && new Date(startDate.getTime() + nights * 24 * 60 * 60 * 1000);

  return (
    <Card className="w-full mx-auto">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Refine Your Stay</h3>
        <div className="space-y-4">
          <div className="flex flex-row space-x-4">
            <div className="flex-grow">
              <label htmlFor="check-in-date" className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date
              </label>
              <DatePicker
                id="check-in-date"
                selected={startDate}
                onChange={handleStartDateChange}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="w-1/3">
              <label htmlFor="nights" className="block text-sm font-medium text-gray-700 mb-1">
                Nights
              </label>
              <Input
                type="number"
                id="nights"
                value={nights}
                onChange={(e) => handleNightsChange(parseInt(e.target.value) || 1)}
                min="1"
                className="w-full"
              />
            </div>
          </div>
          {startDate && nights > 0 && (
            <div className="bg-gray-100 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Check-in:</p>
                  <p className="text-sm">{startDate.toLocaleDateString()}</p>
                </div>
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Check-out:</p>
                  <p className="text-sm">{endDate.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DateSelection;