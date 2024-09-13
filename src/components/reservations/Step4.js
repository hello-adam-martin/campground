import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus, Minus } from 'lucide-react';

const Step4 = ({ formData, handleInputChange, handleGuestCountChange }) => {
  const handleIncrement = (field) => {
    handleGuestCountChange({ target: { name: field, value: formData[field] + 1 } });
  };

  const handleDecrement = (field) => {
    handleGuestCountChange({ target: { name: field, value: formData[field] - 1 } });
  };

  return (
    <>
      <h3 className="text-lg lg:text-xl font-semibold mb-4">Step 4: Guest Information</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <Input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="adultCount" className="block text-sm font-medium text-gray-700 mb-1">Number of Adults</label>
            <div className="flex items-center">
              <Button type="button" onClick={() => handleDecrement('adultCount')} disabled={formData.adultCount <= 1}>
                <Minus size={16} />
              </Button>
              <Input
                type="number"
                id="adultCount"
                name="adultCount"
                value={formData.adultCount}
                onChange={handleGuestCountChange}
                min="1"
                className="mx-2 text-center"
                required
              />
              <Button type="button" onClick={() => handleIncrement('adultCount')}>
                <Plus size={16} />
              </Button>
            </div>
          </div>
          <div>
            <label htmlFor="childCount" className="block text-sm font-medium text-gray-700 mb-1">Number of Children (under 13)</label>
            <div className="flex items-center">
              <Button type="button" onClick={() => handleDecrement('childCount')} disabled={formData.childCount <= 0}>
                <Minus size={16} />
              </Button>
              <Input
                type="number"
                id="childCount"
                name="childCount"
                value={formData.childCount}
                onChange={handleGuestCountChange}
                min="0"
                className="mx-2 text-center"
                required
              />
              <Button type="button" onClick={() => handleIncrement('childCount')}>
                <Plus size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step4;