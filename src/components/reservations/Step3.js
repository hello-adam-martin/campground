import React, { useEffect, useState } from 'react';
import { getAvailableSitesByTypeAndDate } from '../../services/api'; // Import the new function
import { Card, CardContent } from '../ui/card'; // Assuming you have a Card component
import * as LucideIcons from 'lucide-react'; // Import Lucide icons

const Step3 = ({ formData, handleInputChange, siteTypes }) => {
  const [availableSites, setAvailableSites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState(null); // State to track the selected site
  const [selectedSiteNumber, setSelectedSiteNumber] = useState(''); // State to track the selected site number

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

  const handleSiteSelect = (siteId, siteNumber) => {
    setSelectedSiteId(siteId); // Update the selected site ID
    setSelectedSiteNumber(siteNumber); // Update the selected site number
    handleInputChange({ target: { name: 'siteNumber', value: siteId } });
  };

  return (
    <>
      <h3 className="text-lg lg:text-xl font-semibold mb-4">Step 3: Select From Available Sites</h3>
      <div className="space-y-4">
        {availableSites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSites.map(site => {
              const IconComponent = LucideIcons[site.icon]; // Assuming each site has an icon property

              return (
                <Card 
                  key={site.id} 
                  className={`border-2 rounded-lg shadow-md transition-shadow duration-200 cursor-pointer ${selectedSiteId === site.id ? 'border-green-600 bg-green-50' : 'border-blue-600 hover:shadow-lg'}`} // Added cursor-pointer class
                  onClick={() => handleSiteSelect(site.id, site.number)} // Make the Card clickable
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    {IconComponent && <IconComponent size={32} className="mb-2" />} {/* Render the icon */}
                    <h4 className="text-xl font-bold mb-2">{site.number}</h4> {/* Display site number */}
                    <button
                      className={`w-full rounded-md p-2 transition-colors duration-200 ${selectedSiteId === site.id ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      {selectedSiteId === site.id ? 'Selected' : 'Select Site'} {/* Change button text based on selection */}
                    </button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-red-500">No sites available for the selected type and dates. Please go back and choose a different site type or dates.</p>
        )}
        {selectedSiteId && (
          <p className="text-green-600 mt-4">You have selected site number: {selectedSiteNumber}</p> // Confirmation message
        )}
      </div>
    </>
  );
};

export default Step3;