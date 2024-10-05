import React, { useEffect, useState } from 'react';
import { getAvailableSitesByTypeAndDate } from '../../services/api'; // Import the new function

const Step3 = ({ formData, handleInputChange, siteTypes }) => {
  const [availableSites, setAvailableSites] = useState([]);

  useEffect(() => {
    const fetchAvailableSites = async () => {
      if (formData.siteType && formData.startDate && formData.endDate) {
        try {
          const sites = await getAvailableSitesByTypeAndDate(formData.startDate, formData.endDate, formData.siteType);
          setAvailableSites(sites);
        } catch (error) {
          console.error('Error fetching available sites:', error);
        }
      }
    };

    fetchAvailableSites();
  }, [formData.siteType, formData.startDate, formData.endDate]);

  return (
    <>
      <h3 className="text-lg lg:text-xl font-semibold mb-4">Step 3: Select Site</h3>
      <div className="space-y-4">
        {availableSites.length > 0 ? (
          <div>
            <label htmlFor="siteId" className="block text-sm font-medium text-gray-700 mb-1">Available Sites</label>
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
                <option key={site.id} value={site.id}>{site.number}</option> // Use 'site.id' as the value and 'site.number' as the label
              ))}
            </select>
          </div>
        ) : (
          <p className="text-red-500">No sites available for the selected type and dates. Please go back and choose a different site type or dates.</p>
        )}
      </div>
    </>
  );
};

export default Step3;