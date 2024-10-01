import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Minus } from 'lucide-react';

const ExtrasSelector = ({ selectedExtras, onExtrasChange, availableExtras = [] }) => {
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
          <div className="flex items-center justify-end">
            {selectedExtras[service.id] ? (
              <>
                {service.allow_multiple && (
                  <div className="flex items-center">
                    <Button
                      type="button"
                      onClick={() => handleServiceQuantityChange(service, -1)}
                      className="px-3 py-2"
                    >
                      <Minus size={16} />
                    </Button>
                    <Input
                      type="number"
                      value={selectedExtras[service.id].quantity}
                      onChange={(e) => handleServiceQuantityChange(service, parseInt(e.target.value) - selectedExtras[service.id].quantity)}
                      className="mx-2 w-16 text-center"
                      readOnly
                    />
                    <Button
                      type="button"
                      onClick={() => handleServiceQuantityChange(service, 1)}
                      className="px-3 py-2"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                )}
                <Button
                  type="button"
                  onClick={() => handleServiceToggle(service)} // Remove item
                  className="ml-2 text-xs sm:text-sm"
                  variant="outline"
                >
                  Remove
                </Button>
              </>
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
        </div>
      ))}
    </div>
  );
};

export default ExtrasSelector;