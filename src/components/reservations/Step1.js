import React from 'react';
import { Button } from '../ui/button';
import * as LucideIcons from 'lucide-react';

const Step1 = ({ siteTypes, formData, handleSiteTypeSelect }) => {
  if (!Array.isArray(siteTypes) || siteTypes.length === 0) {
    return <p>Loading site types...</p>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg lg:text-xl font-semibold mb-4">Step 1: Choose Site Type</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {siteTypes.map(type => {
          if (!type || typeof type !== 'object') {
            return null;
          }

          const { id, name, icon, pricing } = type;

          if (!id || !name || !icon || !pricing) {
            return null;
          }

          const IconComponent = LucideIcons[icon];

          return (
            <Button
              key={id}
              type="button"
              onClick={() => handleSiteTypeSelect(id)}
              className={`h-auto p-4 flex flex-col items-center justify-center text-lg transition-all duration-200 ease-in-out
                ${formData.siteType === id
                  ? 'bg-blue-600 text-white'
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
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default Step1;