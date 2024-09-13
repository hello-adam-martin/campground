import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import Modal from './Modal';
import { Users } from 'lucide-react';
import config from '../config/appConfig';
const { siteTypes } = config.campground;

const SiteAvailability = () => {
  const [selectedSite, setSelectedSite] = useState(null);

  // Mock data for occupied powered sites
  const occupiedPoweredSites = [
    { id: 'P1', number: 'A1', occupants: { count: 2, names: ['John Doe', 'Jane Doe'], checkIn: '2023-09-01', checkOut: '2023-09-05' } },
    { id: 'P3', number: 'B1', occupants: { count: 3, names: ['Alice Smith', 'Bob Smith', 'Charlie Smith'], checkIn: '2023-09-02', checkOut: '2023-09-07' } },
    { id: 'P4', number: 'B2', occupants: { count: 1, names: ['David Johnson'], checkIn: '2023-09-03', checkOut: '2023-09-06' } },
    { id: 'P7', number: 'D1', occupants: { count: 4, names: ['Eve Brown', 'Frank Brown', 'Grace Brown', 'Henry Brown'], checkIn: '2023-09-04', checkOut: '2023-09-08' } },
  ];

  // Mock data for occupied unpowered sites
  const occupiedUnpoweredSites = [
    { id: 'U1', number: 'U1', occupants: { count: 2, names: ['Ian White', 'Julia White'], checkIn: '2023-09-01', checkOut: '2023-09-03' } },
    { id: 'U2', number: 'U2', occupants: { count: 3, names: ['Kevin Black', 'Laura Black', 'Mike Black'], checkIn: '2023-09-02', checkOut: '2023-09-04' } },
    { id: 'U3', number: 'U3', occupants: { count: 1, names: ['Nancy Green'], checkIn: '2023-09-03', checkOut: '2023-09-05' } },
    { id: 'U4', number: 'U4', occupants: { count: 2, names: ['Oscar Blue', 'Patricia Blue'], checkIn: '2023-09-04', checkOut: '2023-09-06' } },
    { id: 'U5', number: 'U5', occupants: { count: 4, names: ['Quinn Red', 'Rachel Red', 'Sam Red', 'Tom Red'], checkIn: '2023-09-05', checkOut: '2023-09-07' } },
  ];

  const poweredSites = siteTypes.find(type => type.id === 'powered').sites;
  const unpoweredSitesCount = siteTypes.find(type => type.id === 'unpowered').totalSites;

  const handleSiteClick = (site) => {
    setSelectedSite(site);
  };

  return (
    <div className="container mx-auto mt-10 px-4 pb-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Site Availability</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Powered Sites</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {poweredSites.map((site) => {
                const occupiedSite = occupiedPoweredSites.find(s => s.id === site.id);
                const isOccupied = !!occupiedSite;
                return (
                  <div 
                    key={site.id} 
                    className={`flex flex-col items-center justify-center p-3 border rounded cursor-pointer hover:bg-gray-100 ${
                      isOccupied ? 'bg-red-100' : 'bg-green-100'
                    }`}
                    onClick={() => isOccupied && handleSiteClick(occupiedSite)}
                  >
                    <span className="font-bold">{site.number}</span>
                    {isOccupied && (
                      <div className="flex items-center mt-1">
                        <Users size={16} className="mr-1" />
                        <span>{occupiedSite.occupants.count}</span>
                      </div>
                    )}
                    <span className={`mt-1 px-2 py-1 rounded text-xs ${isOccupied ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                      {isOccupied ? 'Occupied' : 'Available'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Unpowered Sites</h3>
            <div className="bg-blue-100 p-4 rounded mb-4">
              <p className="text-center">
                <span className="font-bold">{unpoweredSitesCount - occupiedUnpoweredSites.length}</span> out of <span className="font-bold">{unpoweredSitesCount}</span> unpowered sites available
              </p>
            </div>
            <h4 className="text-lg font-semibold mb-2">Occupied Unpowered Sites</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {occupiedUnpoweredSites.map((site) => (
                <div 
                  key={site.id} 
                  className="flex flex-col items-center justify-center p-3 border rounded cursor-pointer hover:bg-gray-100 bg-red-100"
                  onClick={() => handleSiteClick(site)}
                >
                  <span className="font-bold">{site.number}</span>
                  <div className="flex items-center mt-1">
                    <Users size={16} className="mr-1" />
                    <span>{site.occupants.count}</span>
                  </div>
                  <span className="mt-1 px-2 py-1 rounded text-xs bg-red-500 text-white">
                    Occupied
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={!!selectedSite} onClose={() => setSelectedSite(null)}>
        {selectedSite && (
          <div>
            <h4 className="text-lg font-semibold mb-2">Site {selectedSite.number}</h4>
            <p><strong>Number of Occupants:</strong> {selectedSite.occupants.count}</p>
            <p><strong>Occupants:</strong> {selectedSite.occupants.names.join(', ')}</p>
            <p><strong>Check-in:</strong> {selectedSite.occupants.checkIn}</p>
            <p><strong>Check-out:</strong> {selectedSite.occupants.checkOut}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SiteAvailability;