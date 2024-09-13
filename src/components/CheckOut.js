import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { LogOut, AlertTriangle, Lock, Search, Info, Loader, Check } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CommonLayout from './CommonLayout';
import CheckoutForm from './CheckoutForm';
import ExtrasSelector from './ExtrasSelector';
import useForm from '../hooks/useForm';
import { useCampgroundContext } from '../context/CampgroundContext';
import { mockApi } from '../services/mockApi';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckOut = () => {
  const navigate = useNavigate();
  const { additionalServices } = useCampgroundContext();
  const [step, setStep] = useState('search');
  const { formData, handleInputChange } = useForm({
    searchTerm: '',
    verificationCode: '',
  });
  const [matchingReservations, setMatchingReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
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

  const handleExtrasChange = (updatedExtras) => {
    setSelectedExtras(updatedExtras);
  };

  const calculateTotal = useCallback(() => {
    if (!selectedReservation) return 0;

    const baseCharge = 200; // You might want to calculate this based on the reservation details
    const extrasTotal = Object.values(selectedExtras).reduce((sum, item) => sum + item.price * item.quantity, 0);
    return baseCharge + extrasTotal;
  }, [selectedReservation, selectedExtras]);

  useEffect(() => {
    const total = calculateTotal();
    setTotalPrice(total);
  }, [calculateTotal]);

  const handleConfirmCheckout = () => {
    const total = calculateTotal();
    setTotalPrice(total);
    setStep('payment');
  };

  const handlePaymentSuccess = (paymentIntent) => {
    alert('Checkout successful! Thank you for your stay.');
    navigate('/');
  };

  const handlePaymentError = (errorMessage) => {
    alert(`Payment failed: ${errorMessage}. Please try again or contact support.`);
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
              If you provide your reservation number, you can proceed directly to check-out. 
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
            <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
            <div>
              <p className="font-bold">No reservation found</p>
              <p>We couldn't find a reservation matching your search. Please check your details and try again.</p>
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
            <Lock className="h-6 w-6 text-blue-500 mr-4" />
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
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Reservation Details:</h3>
        <p><strong>Guest:</strong> {selectedReservation.name}</p>
        <p><strong>Site:</strong> {selectedReservation.siteNumber}</p>
        <p><strong>Check-in Date:</strong> {selectedReservation.checkInDate}</p>
        <p><strong>Email:</strong> {selectedReservation.email}</p>
        <p><strong>Phone:</strong> {selectedReservation.phone}</p>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Additional Services:</h3>
        <ExtrasSelector
          selectedExtras={selectedExtras}
          onExtrasChange={handleExtrasChange}
          availableExtras={additionalServices}
        />
      </div>
      <Button onClick={handleConfirmCheckout} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        Confirm and Proceed to Payment
      </Button>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-4">
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Checkout Summary:</h3>
        <p><strong>Guest:</strong> {selectedReservation.name}</p>
        <p><strong>Site:</strong> {selectedReservation.siteNumber}</p>
        <p><strong>Check-in Date:</strong> {selectedReservation.checkInDate}</p>
        <p><strong>Base Charge:</strong> $200.00</p>
        {Object.values(selectedExtras).map(extra => (
          <p key={extra.id}><strong>{extra.name}:</strong> ${(extra.price * extra.quantity).toFixed(2)}</p>
        ))}
        <p className="font-bold mt-2">Total Due: ${totalPrice.toFixed(2)}</p>
      </div>
      <Elements stripe={stripePromise}>
        <CheckoutForm 
          totalAmount={totalPrice}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      </Elements>
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
      case 'payment':
        return renderPaymentStep();
      default:
        return null;
    }
  };

  const renderSidebar = () => {
    const steps = [
      { key: ['search', 'select'], label: 'Find your reservation' },
      { key: 'verify', label: 'Verify identity (if needed)' },
      { key: 'confirm', label: 'Confirm details and add extras' },
      { key: 'payment', label: 'Complete payment' }
    ];
  
    const getStepIndex = (currentStep) => steps.findIndex(s => 
      Array.isArray(s.key) ? s.key.includes(currentStep) : s.key === currentStep
    );
    const currentStepIndex = getStepIndex(step);
  
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Check-Out Process</h3>
        <ul className="space-y-2">
          {steps.map((s, index) => {
            const isCurrentStep = Array.isArray(s.key) ? s.key.includes(step) : s.key === step;
            return (
              <li key={Array.isArray(s.key) ? s.key.join('-') : s.key} 
                  className={`flex items-center space-x-2 ${isCurrentStep ? 'text-blue-600 font-semibold' : ''}`}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  currentStepIndex > index
                    ? 'bg-blue-100 border-blue-600 text-blue-600' 
                    : isCurrentStep 
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
            );
          })}
        </ul>
        {selectedReservation && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold mb-2">Selected Reservation:</h4>
            <p><strong>Guest:</strong> {selectedReservation.name}</p>
            <p><strong>Site:</strong> {selectedReservation.siteNumber}</p>
            <p><strong>Check-in:</strong> {selectedReservation.checkInDate}</p>
            {step === 'payment' && <p className="font-bold mt-2">Total: ${totalPrice.toFixed(2)}</p>}
          </div>
        )}
      </div>
    );
  };

  return (
    <CommonLayout 
      title="Check Out"
      icon={LogOut}
      width="max-w-7xl"
    >
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-2/3 lg:pr-6 lg:border-r border-gray-200">
          <Card>
            <CardContent className="pt-6">
              {renderContent()}
            </CardContent>
          </Card>
        </div>
        <div className="lg:w-1/3 mt-6 lg:mt-0 lg:pl-6">
          {renderSidebar()}
        </div>
      </div>
    </CommonLayout>
  );
};

export default CheckOut;