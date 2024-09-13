import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CheckCircle, Search, Info, MapPin, AlertTriangle, Lock, Loader, Check } from 'lucide-react';
import CommonLayout from './CommonLayout';
import useForm from '../hooks/useForm';
import { useCampgroundContext } from '../context/CampgroundContext';
import { mockApi } from '../services/mockApi';

const CheckIn = () => {
  const navigate = useNavigate();
  const { rules } = useCampgroundContext();
  const [step, setStep] = useState('search');
  const { formData, handleInputChange } = useForm({
    searchTerm: '',
    verificationCode: '',
  });
  const [matchingReservations, setMatchingReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(false);
    
    try {
      const matches = await mockApi.searchReservations(formData.searchTerm);
      setMatchingReservations(matches);

      if (matches.length === 1) {
        const reservationId = String(matches[0].id).trim();
        const searchTerm = formData.searchTerm.trim();
        
        if (reservationId === searchTerm) {
          setSelectedReservation(matches[0]);
          setIsVerified(true);
          setStep('confirm');
        } else {
          setStep('select');
        }
      } else if (matches.length > 1) {
        setStep('select');
      } else {
        setStep('search');
      }
      
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching for reservations:', error);
      setMatchingReservations([]);
      setStep('search');
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReservationSelect = (reservation) => {
    setSelectedReservation(reservation);
    setStep('verify');
  };

  const handleVerify = () => {
    if (formData.verificationCode.trim() !== '') {
      setIsVerified(true);
      setStep('confirm');
    } else {
      alert('Please enter a valid verification code.');
    }
  };

  const handleConfirmCheckIn = () => {
    // Here you would typically send a request to your backend to mark the reservation as checked in
    console.log('Checking in reservation:', selectedReservation);
    setStep('info');
  };

  const renderSearchStep = () => (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
        <div className="flex">
          <div className="py-1">
            <Info className="h-6 w-6 text-blue-500 mr-2" />
          </div>
          <div>
            <p className="font-bold">Verification Process</p>
            <p className="text-sm">
              If you provide your reservation number, you can proceed directly to check-in. 
              Otherwise, for security purposes, you'll be asked to enter a verification code 
              sent to your registered email or phone number.
            </p>
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
          Reservation Number, Last Name, Phone Number, or Email
        </label>
        <Input
          type="text"
          id="searchTerm"
          name="searchTerm"
          value={formData.searchTerm}
          onChange={handleInputChange}
          className="w-full"
          placeholder="Enter your reservation details"
          required
        />
      </div>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        {isLoading ? <Loader className="animate-spin mr-2" /> : <Search className="mr-2 h-4 w-4" />}
        {isLoading ? 'Searching...' : 'Search Reservation'}
      </Button>
      {isLoading ? (
        <div className="mt-4 text-center text-gray-600">
          Searching for reservations...
        </div>
      ) : hasSearched && matchingReservations.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <div className="flex">
            <div className="py-1">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
            </div>
            <div>
              <p className="font-bold">No reservation found</p>
              <p>We couldn't find a reservation matching your search. Please check your details and try again.</p>
              <p className="mt-2">If you need assistance, please contact our support team or visit the campground office.</p>
            </div>
          </div>
        </div>
      )}
    </form>
  );

  const renderSelectStep = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Select Your Reservation</h3>
      {matchingReservations.map(reservation => (
        <Button
          key={reservation.id}
          onClick={() => handleReservationSelect(reservation)}
          className="w-full justify-start text-left bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
        >
          <div>
            <p className="font-semibold">{reservation.name}</p>
            <p className="text-sm">Site: {reservation.siteNumber}, Check-in: {reservation.checkInDate}</p>
          </div>
        </Button>
      ))}
      <Button 
        onClick={() => {
          setStep('search');
          setHasSearched(false);
        }} 
        variant="outline" 
        className="w-full mt-4"
      >
        Back to Search
      </Button>
    </div>
  );

  const renderVerifyStep = () => (
    <div className="space-y-4">
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
        <div className="flex">
          <div className="py-1">
            <Lock className="mr-2 h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="font-bold">Verify Your Identity</p>
            <p className="text-sm">To protect your reservation, please enter the verification code sent to your email or phone.</p>
          </div>
        </div>
      </div>
      <Input
        type="text"
        name="verificationCode"
        value={formData.verificationCode}
        onChange={handleInputChange}
        placeholder="Enter verification code"
        className="w-full"
        required
      />
      <Button onClick={handleVerify} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        Verify
      </Button>
    </div>
  );

  const renderConfirmStep = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Confirm Check-In</h3>
      <div className="bg-gray-100 p-4 rounded-md">
        <p><strong>Name:</strong> {selectedReservation.name}</p>
        <p><strong>Site Number:</strong> {selectedReservation.siteNumber}</p>
        <p><strong>Check-in Date:</strong> {selectedReservation.checkInDate}</p>
        <p><strong>Email:</strong> {selectedReservation.email}</p>
        <p><strong>Phone:</strong> {selectedReservation.phone}</p>
      </div>
      <Button 
        onClick={handleConfirmCheckIn}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        <CheckCircle className="mr-2 h-4 w-4" /> Confirm Check-In
      </Button>
      <Button 
        onClick={() => setStep('select')} 
        variant="outline" 
        className="w-full"
      >
        Back to Reservation Selection
      </Button>
    </div>
  );

  const renderInfoStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg flex items-center mb-2">
          <MapPin className="mr-2 h-5 w-5 text-blue-600" />
          Your Campsite Information
        </h3>
        <div className="bg-blue-50 p-4 rounded-md">
          <p><strong>Site Number:</strong> {selectedReservation.siteNumber}</p>
          <p><strong>Location:</strong> [Insert directions or map here]</p>
          <p><strong>Amenities:</strong> [List site-specific amenities]</p>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg flex items-center mb-2">
          <Info className="mr-2 h-5 w-5 text-blue-600" />
          Campground Rules
        </h3>
        <ul className="list-disc pl-5 space-y-2">
          {rules.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-gray-600">
        For more information or assistance, please visit the campground office.
      </p>
      <Button 
        onClick={() => navigate('/')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        Complete Check-In
      </Button>
    </div>
  );

  const renderContent = () => {
    switch (step) {
      case 'search':
        return renderSearchStep();
      case 'select':
        return renderSelectStep();
      case 'verify':
        return renderVerifyStep();
      case 'confirm':
        return isVerified ? renderConfirmStep() : renderVerifyStep();
      case 'info':
        return renderInfoStep();
      default:
        return null;
    }
  };

  const renderSidebar = () => {
    const steps = [
      { key: 'search', label: 'Find your reservation' },
      { key: 'select', label: 'Select your reservation' },
      { key: 'verify', label: 'Verify identity (if needed)' },
      { key: 'confirm', label: 'Confirm check-in' },
      { key: 'info', label: 'Get campsite information' }
    ];
  
    const getStepIndex = (stepKey) => steps.findIndex(s => s.key === stepKey);
    const currentStepIndex = getStepIndex(step);
  
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Check-In Process</h3>
        <ul className="space-y-2">
          {steps.map((s, index) => (
            <li key={s.key} className={`flex items-center space-x-2 ${step === s.key ? 'text-blue-600 font-semibold' : ''}`}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                currentStepIndex > index
                  ? 'bg-blue-100 border-blue-600 text-blue-600' 
                  : step === s.key 
                    ? 'border-blue-600' 
                    : 'border-gray-300'
              }`}>
                {currentStepIndex > index ? (
                  <Check size={16} />
                ) : (
                  index + 1
                )}
              </div>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
        {selectedReservation && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold mb-2">Selected Reservation:</h4>
            <p><strong>Guest:</strong> {selectedReservation.name}</p>
            <p><strong>Site:</strong> {selectedReservation.siteNumber}</p>
            <p><strong>Check-in:</strong> {selectedReservation.checkInDate}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <CommonLayout 
      title={step === 'info' ? 'Welcome to Our Campground!' : 'Check In'}
      icon={CheckCircle}
      width="max-w-7xl"
      sidebar={renderSidebar()}
    >
      <Card>
        <CardContent className="pt-6">
          {renderContent()}
        </CardContent>
      </Card>
    </CommonLayout>
  );
};

export default CheckIn;