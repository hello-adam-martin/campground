import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Map } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isMainPage = location.pathname === '/';
  const isSiteAvailabilityPage = location.pathname === '/site-availability';

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hurunui Hotel Campsite</h1>
        <div className="flex space-x-4">
          <Button 
            onClick={() => navigate('/site-availability')} 
            variant="secondary"
            className={`bg-white text-blue-600 hover:bg-blue-100 ${isSiteAvailabilityPage ? 'hidden' : ''}`}
          >
            <Map size={20} className="mr-2" />
            Site Availability
          </Button>
          {!isMainPage && (
            <Button 
              onClick={() => navigate('/')} 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-blue-100"
            >
              Main Menu
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;