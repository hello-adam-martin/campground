import React, { useEffect } from 'react';
import { Button } from './ui/button';
import { Plus, Minus } from 'lucide-react';

const ExtrasSelector = ({ selectedExtras, onExtrasChange, availableExtras = [] }) => {
  useEffect(() => {
    console.log('Available Extras in ExtrasSelector:', availableExtras);
  }, [availableExtras]);

  const handleServiceToggle = (service) => {
    onExtrasChange(prevExtras => {
      const updatedExtras = { ...prevExtras };
      if (updatedExtras[service.id]) {
        delete updatedExtras[service.id];
      } else {
        updatedExtras[service.id] = { ...service, quantity: 1 };
      }
      return updatedExtras;
    });
  };

  const handleServiceQuantityChange = (service, change) => {
    onExtrasChange(prevExtras => {
      const updatedExtras = { ...prevExtras };
      if (updatedExtras[service.id]) {
        const newQuantity = Math.max(0, updatedExtras[service.id].quantity + change);
        if (newQuantity === 0) {
          delete updatedExtras[service.id];
        } else {
          updatedExtras[service.id] = { ...updatedExtras[service.id], quantity: newQuantity };
        }
      } else if (change > 0) {
        updatedExtras[service.id] = { ...service, quantity: 1 };
      }
      return updatedExtras;
    });
  };

  if (!availableExtras || availableExtras.length === 0) {
    return <p>No additional services available.</p>;
  }

  return (
    <div className="space-y-4">
      {availableExtras.map((service) => (
        <div key={service.id} className="flex justify-between items-center">
          <span className="text-sm sm:text-base">{service.name} - ${service.price.toFixed(2)}</span>
          {selectedExtras[service.id] ? (
            <div className="flex items-center space-x-2">
              {service.allowMultiple && (
                <Button
                  type="button"
                  onClick={() => handleServiceQuantityChange(service, -1)}
                  variant="outline"
                  className="p-1"
                >
                  <Minus size={16} />
                </Button>
              )}
              <span className="w-8 text-center">
                {selectedExtras[service.id].quantity}
              </span>
              {service.allowMultiple && (
                <Button
                  type="button"
                  onClick={() => handleServiceQuantityChange(service, 1)}
                  variant="outline"
                  className="p-1"
                >
                  <Plus size={16} />
                </Button>
              )}
            </div>
          ) : (
            <Button
              type="button"
              onClick={() => handleServiceToggle(service)}
              variant="outline"
              className="text-xs sm:text-sm"
            >
              Add
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExtrasSelector;