import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import * as LucideIcons from 'lucide-react';
import { Plus, Minus } from 'lucide-react';

const Step1 = ({ siteTypes, formData, handleSiteTypeSelect, handleGuestCountChange }) => {

  if (!Array.isArray(siteTypes) || siteTypes.length === 0) {
    return <p>Loading site types... (siteTypes: {JSON.stringify(siteTypes)})</p>;
  }

  const handleIncrement = (field) => {
    handleGuestCountChange({ target: { name: field, value: formData[field] + 1 } });
  };

  const handleDecrement = (field) => {
    handleGuestCountChange({ target: { name: field, value: Math.max(0, formData[field] - 1) } });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg lg:text-xl font-semibold mb-4">Step 1: Choose Site Type</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {siteTypes.map(type => {
          if (!type || typeof type !== 'object') {
            console.log('Invalid site type:', type);
            return null;
          }

          const { id, name, icon, pricing } = type;

          if (!id || !name || !icon || !pricing) {
            console.log('Missing required properties in site type:', type);
            return null;
          }

          const IconComponent = LucideIcons[icon];
          const totalGuests = formData.adultCount + formData.childCount;
          const isDisabled = totalGuests > pricing.maxGuests;

          return (
            <Button
              key={id}
              type="button"
              onClick={() => handleSiteTypeSelect(id)}
              disabled={isDisabled}
              className={`h-auto p-4 flex flex-col items-center justify-center text-lg transition-all duration-200 ease-in-out
                ${formData.siteType === id
                  ? 'bg-blue-600 text-white'
                  : isDisabled
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-100 hover:border-blue-700 hover:text-blue-700'
                }
                transform hover:shadow-lg
              `}
            >
              {IconComponent && <IconComponent size={32} className="mb-2" />}
              <span className="text-xl font-bold mb-2">{name}</span>
              <div className="text-sm">
                <p>${pricing.basePrice}/night (up to {pricing.baseGuests} guests)</p>
                <p>${pricing.extraGuestPrice}/night per additional guest</p>
                <p>Max guests: {pricing.maxGuests}</p>
              </div>
              {isDisabled && (
                <p className="text-red-500 text-xs mt-2">Exceeds maximum guests</p>
              )}
            </Button>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-md">
        <h4 className="text-lg font-semibold mb-4">Number of Guests</h4>
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
                className="mx-2 w-20 text-center"
                readOnly
              />
              <Button type="button" onClick={() => handleIncrement('adultCount')}>
                <Plus size={16} />
              </Button>
            </div>
          </div>
          <div>
            <label htmlFor="childCount" className="block text-sm font-medium text-gray-700 mb-1">Number of Children</label>
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
                className="mx-2 w-20 text-center"
                readOnly
              />
              <Button type="button" onClick={() => handleIncrement('childCount')}>
                <Plus size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;