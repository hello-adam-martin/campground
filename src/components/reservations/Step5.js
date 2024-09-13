import React, { useEffect } from 'react';
import ExtrasSelector from '../ExtrasSelector';

const Step5 = ({ selectedExtras, setSelectedExtras, availableExtras }) => {
  useEffect(() => {
    console.log('Available Extras in Step5:', availableExtras);
  }, [availableExtras]);

  return (
    <div>
      <h3 className="text-lg lg:text-xl font-semibold mb-4">Step 5: Additional Services</h3>
      {availableExtras && availableExtras.length > 0 ? (
        <ExtrasSelector
          selectedExtras={selectedExtras}
          onExtrasChange={setSelectedExtras}
          availableExtras={availableExtras}
        />
      ) : (
        <p>No additional services available.</p>
      )}
    </div>
  );
};

export default Step5;