import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Settings, Edit, X, AlertTriangle, ArrowLeft, Lock, Loader, Search, Info } from 'lucide-react';
import CommonLayout from './CommonLayout';
import useForm from '../hooks/useForm';
import { useCampgroundContext } from '../context/CampgroundContext';
import { mockApi } from '../services/mockApi';

const ManageReservation = () => {
  const navigate = useNavigate();
  const { rules } = useCampgroundContext();
  const [step, setStep] = useState('search');
  const { formData, handleInputChange } = useForm({
    searchTerm: '',
    verificationCode: '',
  });
  const [matchingReservations, setMatchingReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDates, setEditedDates] = useState({ 
    startDate: new Date(), 
    endDate: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000) 
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableSites, setAvailableSites] = useState({});

  useEffect(() => {
    const fetchAvailableSites = async () => {
      const today = new Date();
      const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      const sites = await mockApi.getAvailableSites(today, thirtyDaysLater);
      setAvailableSites(sites);
    };
    fetchAvailableSites();
  }, []);

  const handleReservationLookup = async (e) => {
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
          setStep('view');
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
    const startDate = new Date(reservation.checkInDate);
    const endDate = new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000); // Assuming a 4-night stay as default
    setEditedDates({ startDate, endDate });
    setStep('verify');
  };

  const handleVerify = () => {
    if (formData.verificationCode.trim() !== '') {
      setIsVerified(true);
      setStep('view');
    } else {
      alert('Please enter a valid verification code.');
    }
  };

  const handleModify = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    setSelectedReservation(prev => ({
      ...prev,
      checkInDate: editedDates.startDate.toISOString().split('T')[0],
      checkOutDate: editedDates.endDate.toISOString().split('T')[0]
    }));
    setIsEditing(false);
    alert('Reservation updated successfully!');
  };

  const handleCancel = () => {
    setStep('confirm-cancel');
  };

  const confirmCancel = () => {
    console.log('Cancelling reservation:', selectedReservation.id);
    alert('Reservation cancelled successfully!');
    navigate('/');
  };

  const renderSearchStep = () => (
    <form onSubmit={handleReservationLookup} className="space-y-4">
      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
        <div className="flex">
          <div className="py-1">
            <Info className="h-6 w-6 text-blue-500 mr-2" />
          </div>
          <div>
            <p className="font-bold">Verification Process</p>
            <p className="text-sm">
              If you provide your reservation number, you can proceed directly to manage your reservation. 
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

  const renderViewStep = () => (
    <div className="space-y-4">
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Reservation Details:</h3>
        <p><strong>Code:</strong> {selectedReservation.id}</p>
        <p><strong>Name:</strong> {selectedReservation.name}</p>
        <p><strong>Email:</strong> {selectedReservation.email}</p>
        <p><strong>Phone:</strong> {selectedReservation.phone}</p>
        <p><strong>Site:</strong> {selectedReservation.siteNumber}</p>
        <p><strong>Check-in:</strong> {selectedReservation.checkInDate}</p>
        <p><strong>Check-out:</strong> {editedDates.endDate ? editedDates.endDate.toISOString().split('T')[0] : 'Not set'}</p>
      </div>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
            <DatePicker
              selected={editedDates.startDate}
              onChange={(date) => setEditedDates(prev => ({ ...prev, startDate: date }))}
              selectsStart
              startDate={editedDates.startDate}
              endDate={editedDates.endDate}
              minDate={new Date()}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
            <DatePicker
              selected={editedDates.endDate}
              onChange={(date) => setEditedDates(prev => ({ ...prev, endDate: date }))}
              selectsEnd
              startDate={editedDates.startDate}
              endDate={editedDates.endDate}
              minDate={editedDates.startDate}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <Button onClick={handleSaveChanges} className="w-full bg-green-600 hover:bg-green-700 text-white">
            Save Changes
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Button onClick={handleModify} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Edit className="mr-2 h-4 w-4" /> Modify Reservation
          </Button>
          <Button onClick={handleCancel} variant="destructive" className="w-full bg-red-600 hover:bg-red-700 text-white">
            <X className="mr-2 h-4 w-4" /> Cancel Reservation
          </Button>
        </div>
      )}
    </div>
  );

  const renderConfirmCancelStep = () => (
    <div className="space-y-4">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
        <div className="flex">
          <div className="py-1">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mr-4" />
          </div>
          <div>
            <p className="font-bold">Cancel Reservation</p>
            <p className="text-sm">Are you sure you want to cancel your reservation? This action cannot be undone.</p>
          </div>
        </div>
      </div>
      <p><strong>Cancellation Policy:</strong></p>
      <ul className="list-disc pl-5 space-y-1">
        {rules.map((rule, index) => (
          <li key={index}>{rule}</li>
        ))}
      </ul>
      <Button onClick={confirmCancel} className="w-full bg-red-600 hover:bg-red-700 text-white">
        Confirm Cancellation
      </Button>
      <Button onClick={() => setStep('view')} variant="outline" className="w-full">
        Go Back
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
      case 'view':
        return isVerified ? renderViewStep() : renderVerifyStep();
      case 'confirm-cancel':
        return renderConfirmCancelStep();
      default:
        return null;
    }
  };

  const renderSidebar = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Manage Reservation</h3>
      <ul className="space-y-2">
        <li className={`flex items-center space-x-2 ${step === 'search' || step === 'select' ? 'text-blue-600 font-semibold' : ''}`}>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${step === 'search' || step === 'select' ? 'border-blue-600' : 'border-gray-300'}`}>
            1
          </div>
          <span>Find your reservation</span>
        </li>
        <li className={`flex items-center space-x-2 ${step === 'verify' ? 'text-blue-600 font-semibold' : ''}`}>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${step === 'verify' ? 'border-blue-600' : 'border-gray-300'}`}>
            2
          </div>
          <span>Verify your identity</span>
        </li>
        <li className={`flex items-center space-x-2 ${step === 'view' ? 'text-blue-600 font-semibold' : ''}`}>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${step === 'view' ? 'border-blue-600' : 'border-gray-300'}`}>
            3
          </div>
          <span>View or modify details</span>
        </li>
        <li className={`flex items-center space-x-2 ${step === 'confirm-cancel' ? 'text-blue-600 font-semibold' : ''}`}>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${step === 'confirm-cancel' ? 'border-blue-600' : 'border-gray-300'}`}>
            4
          </div>
          <span>Confirm changes or cancellation</span>
        </li>
      </ul>
      {selectedReservation && isVerified && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold mb-2">Current Reservation:</h4>
          <p><strong>Guest:</strong> {selectedReservation.name}</p>
          <p><strong>Site:</strong> {selectedReservation.siteNumber}</p>
          <p><strong>Check-in:</strong> {selectedReservation.checkInDate}</p>
          <p><strong>Check-out:</strong> {editedDates.endDate ? editedDates.endDate.toISOString().split('T')[0] : 'Not set'}</p>
        </div>
      )}
    </div>
  );
  
  return (
    <CommonLayout 
      title="Manage My Reservation"
      icon={Settings}
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
  
  export default ManageReservation;