import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Calendar, 
  CheckCircle, 
  Settings, 
  ShoppingCart,
  CreditCard, 
  LogOut,
  Phone,
  Mail,
  Smartphone
} from 'lucide-react';

const CampgroundKiosk = () => {
  const navigate = useNavigate();

  const kioskOptions = [
    { 
      id: 1, 
      label: 'Make Reservation', 
      description: 'I do not already have a reservation and need to make one now.',
      path: '/make-reservation',
      icon: Calendar
    },
    { 
      id: 2, 
      label: 'Check In', 
      description: 'I already have a reservation and just need to let you know I have arrived.',
      path: '/check-in',
      icon: CheckCircle
    },
    { 
      id: 3, 
      label: 'Manage Reservation', 
      description: 'I already have a reservation and need to make a change.',
      path: '/manage-reservation',
      icon: Settings
    },
    { 
      id: 4, 
      label: 'Purchase Extras', 
      description: 'I want to purchase additional items or services for my stay.',
      path: '/purchase-extras',
      icon: ShoppingCart
    },
    { 
      id: 5, 
      label: 'Pay For Past Stay', 
      description: 'I was unable to make a reservation and need to pay for a previous night\'s stay.',
      path: '/pay-for-stay',
      icon: CreditCard
    },
    { 
      id: 6, 
      label: 'Check Out', 
      description: 'I have completed my stay and am now leaving.',
      path: '/check-out',
      icon: LogOut
    },
  ];

  const handleOptionSelect = (path) => {
    navigate(path);
  };

  // Get the current URL of the site
  const currentUrl = window.location.origin;

  return (
    <div className="container mx-auto mt-10 px-4 pb-10">
      <Card className="w-full max-w-7xl mx-auto">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row">
            {/* Main options on the left */}
            <div className="lg:w-2/3 lg:pr-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kioskOptions.map((option) => (
                  <Button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.path)}
                    className="h-auto p-4 flex flex-col items-center text-center bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <option.icon size={36} className="mb-2" />
                    <span className="text-xl font-bold mb-1">{option.label}</span>
                    <span className="text-xs text-gray-600">{option.description}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* QR code and contact info on the right */}
            <div className="lg:w-1/3 mt-8 lg:mt-0 lg:pl-6 lg:border-l border-gray-200">
              <div className="mb-2">
                <h2 className="text-xl font-semibold text-center mb-4">Use Your Own Device</h2>
                <div className="flex flex-col items-center">
                  <Smartphone size={48} className="text-blue-600 mb-4" />
                  <p className="text-center mb-4">
                    Scan this QR code to access the campground services on your own device:
                  </p>
                  <QRCodeSVG 
                    value={currentUrl}
                    size={160}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                    includeMargin={false}
                    className="mb-4"
                  />
                </div>
              </div>
              
              <div className="mt-2">
                <h2 className="text-xl font-semibold text-center mb-4">Need Assistance?</h2>
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center">
                    <Phone className="text-blue-600 mr-2" size={20} />
                    <span>Call us: (020) 4076-9301</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="text-blue-600 mr-2" size={20} />
                    <span>Email: contact@thehurunuihotel.co.nz</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampgroundKiosk;