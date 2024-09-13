import React from 'react';

const Step3 = ({ formData, handleInputChange, siteTypes }) => {
  const selectedSiteType = siteTypes.find(type => type.id === formData.siteType);
  const availableSites = selectedSiteType?.sites || [];

  return (
    <>
      <h3 className="text-lg lg:text-xl font-semibold mb-4">Step 3: Select Site</h3>
      <div className="space-y-4">
        {availableSites.length > 0 ? (
          <div>
            <label htmlFor="siteNumber" className="block text-sm font-medium text-gray-700 mb-1">Available Sites</label>
            <select
              id="siteNumber"
              name="siteNumber"
              value={formData.siteNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            >
              <option value="">Select an available site</option>
              {availableSites.map(site => (
                <option key={site.id} value={site.number}>{site.number}</option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-red-500">No sites available for the selected type. Please go back and choose a different site type.</p>
        )}
      </div>
    </>
  );
};

export default Step3;