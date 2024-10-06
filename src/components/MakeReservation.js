import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight, Calendar, Check } from 'lucide-react';
import CommonLayout from './CommonLayout';
import useForm from '../hooks/useForm';
import { useCampgroundContext } from '../context/CampgroundContext';
import Step1 from './reservations/Step1';
import Step2 from './reservations/Step2';
import Step3 from './reservations/Step3';
import Step4 from './reservations/Step4';
import Step5 from './reservations/Step5';
import Step6And7 from './reservations/Step6And7'; // Import the new combined component
import Step8 from './reservations/Step8';
import { getSiteTypes, getAvailableSites, createReservation, getAdditionalServices } from '../services/api';
import { addDays, format, differenceInDays } from 'date-fns';

const MakeReservation = () => {
  const navigate = useNavigate();
  const { siteTypes, rules, additionalServices, updateContext } = useCampgroundContext();
  const [step, setStep] = useState(1);
  const { formData, handleInputChange, setField } = useForm({
    siteType: '',
    startDate: null,
    endDate: null,
    maxNights: 14,
    siteNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    adultCount: 2,
    childCount: 0,
  });
  const [selectedExtras, setSelectedExtras] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [availableSites, setAvailableSites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dataFetchedRef = useRef(false);
  const [nights, setNights] = useState(1); // Added state for nights

  useEffect(() => {
    const fetchData = async () => {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;

      try {
        setIsLoading(true);
        const [fetchedSiteTypes, fetchedAdditionalServices] = await Promise.all([
          getSiteTypes(),
          getAdditionalServices()
        ]);

        updateContext({
          siteTypes: fetchedSiteTypes,
          additionalServices: fetchedAdditionalServices
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [updateContext]);

  useEffect(() => {
    if (formData.siteType) {
      const fetchAvailableSites = async () => {
        setIsLoading(true);
        try {
          const today = new Date();
          const sites = await getAvailableSites(
            format(today, 'yyyy-MM-dd'),
            formData.siteType
          );
          setAvailableSites(sites);
        } catch (error) {
          setAvailableSites([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAvailableSites();
    }
  }, [formData.siteType]);

  const calculateTotalPrice = useCallback(() => {
    const selectedSiteType = siteTypes.find(type => type.id === formData.siteType);
    if (!selectedSiteType) return 0;

    const basePrice = selectedSiteType.base_price * nights; // Use nights state
    const extraAdults = Math.max(0, formData.adultCount - selectedSiteType.base_guests);
    const extraGuestPrice = extraAdults * selectedSiteType.extra_guest_price * nights; // Use nights state
    
    const extrasPrice = Object.values(selectedExtras).reduce((total, item) => 
      total + (item.price * item.quantity), 0);

    return basePrice + extraGuestPrice + extrasPrice;
  }, [formData.siteType, formData.adultCount, selectedExtras, siteTypes, nights]); // Added nights to dependencies

  useEffect(() => {
    const total = calculateTotalPrice();
    setTotalPrice(total);
  }, [calculateTotalPrice]);

  const handleSiteTypeSelect = (typeId) => {
    setField('siteType', typeId);
    calculateTotalPrice(); // Update total price when site type is selected
  };

  const handleDateSelect = (start, end) => {
    setField('startDate', start);
    setField('endDate', end);
    const calculatedNights = end ? differenceInDays(end, start) : 1; // Assume 1 night if end date is not selected
    setNights(Math.max(1, calculatedNights)); // Update nights based on selected dates
    calculateTotalPrice();
  };

  const handleNightsChange = (nights) => {
    setField('nights', Math.max(1, nights));
  };

  const handleGuestCountChange = (e) => {
    const { name, value } = e.target;
    setField(name, Math.max(0, parseInt(value) || 0));
    calculateTotalPrice();
  };

  const handleNext = () => {
    if (step === 1 && !formData.siteType) {
      alert("Please select a site type.");
      return;
    }
    if (step === 2 && (!formData.startDate || !formData.endDate)) {
      alert("Please select dates you wish to stay.");
      return;
    }
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const reservationData = {
        siteId: formData.siteId || null,
        startDate: format(formData.startDate, 'yyyy-MM-dd'),
        endDate: format(formData.endDate, 'yyyy-MM-dd'),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        adultCount: formData.adultCount,
        childCount: formData.childCount,
        totalPrice,
        extras: Object.values(selectedExtras)
      };
      const result = await createReservation(reservationData);
      if (result.success) {
        setStep(8);
      } else {
        throw new Error(result.error || 'Reservation creation failed');
      }
    } catch (error) {
      console.error("Error creating reservation:", error.message);
      alert(`Failed to create reservation: ${error.message}. Please try again or contact support.`);
    }
  };

  const handlePaymentError = (errorMessage) => {
    alert(`Payment failed: ${errorMessage}. Please try again or contact support.`);
  };

  const renderStepContent = () => {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    switch(step) {
      case 1:
        return (
          <Step1 
            siteTypes={siteTypes}
            formData={formData}
            handleSiteTypeSelect={handleSiteTypeSelect}
            handleGuestCountChange={handleGuestCountChange}
          />
        );
      case 2:
        return (
          <Step2 
            formData={formData}
            availableSites={availableSites}
            handleDateSelect={handleDateSelect}
            handleNightsChange={handleNightsChange}
          />
        );
      case 3:
        return (
          <Step3
            formData={formData}
            handleInputChange={handleInputChange}
            siteTypes={siteTypes}
            availableSites={availableSites}
          />
        );
      case 4:
        return (
          <Step4
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 5:
        return (
          <Step5
            selectedExtras={selectedExtras}
            setSelectedExtras={setSelectedExtras}
            availableExtras={additionalServices}
          />
        );
      case 6: // Update this case to render the combined step
        return (
          <Step6And7
            formData={formData}
            selectedExtras={selectedExtras}
            totalPrice={totalPrice}
            siteTypes={siteTypes}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        );
      case 8:
        return (
          <Step8
            formData={formData}
            siteTypes={siteTypes}
            rules={rules}
            onReturnToKiosk={() => navigate('/')}
          />
        );
      default:
        return null;
    }
  };

  const renderSidebar = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Reservation Process</h3>
      <ul className="space-y-2">
        {[
          "Choose site type",
          "Select dates",
          "Select specific site",
          "Enter guest details",
          "Add extras",
          "Review & Payment", // Updated step name to reflect the combined step
          "Confirmation"
        ].map((stepName, index) => (
          <li key={index} className={`flex items-center space-x-2 ${step === index + 1 ? 'text-blue-600 font-semibold' : ''}`}>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              step > index + 1 
                ? 'bg-blue-100 border-blue-600 text-blue-600' 
                : step === index + 1 
                  ? 'border-blue-600' 
                  : 'border-gray-300'
            }`}>
              {step > index + 1 ? (
                <Check size={16} />
              ) : (
                index + 1
              )}
            </div>
            <span>{stepName}</span>
          </li>
        ))}
      </ul>
      {step === 6 ? ( // Show payment instructions when on step 6
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold mb-2">Payment Instructions</h4>
          <p>Please review your reservation details above. If everything is correct, click "Proceed to Payment" to complete your booking.</p>
        </div>
      ) : (
        step !== 8 && ( // Only show reservation summary if not on step 6 or 8
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold mb-2 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Reservation Summary
            </h4>
            <p><strong>Site Type:</strong> {formData.siteType ? siteTypes.find(type => type.id === formData.siteType)?.name : 'Not selected'}</p>
            {formData.startDate && formData.endDate && (
            <>
            <p><strong>Check-in:</strong> {format(formData.startDate, 'MMM d, yyyy')}</p>
            <p><strong>Check-out:</strong> {format(formData.endDate, 'MMM d, yyyy')}</p>
            <p><strong>Nights:</strong> {differenceInDays(formData.endDate, formData.startDate)}</p>
            </>
            )}
            {formData.siteNumber && <p><strong>Site Number:</strong> {formData.siteNumber}</p>}
            <p><strong>Guests:</strong> {formData.adultCount} Adults, {formData.childCount} Children</p>
            {Object.values(selectedExtras).length > 0 && (
              <>
                <p className="font-semibold mt-2">Additional Services:</p>
                <ul className="list-disc pl-5">
                  {Object.values(selectedExtras).map(service => (
                    <li key={service.id}>
                      {service.name} (x{service.quantity})
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p className="font-bold mt-2">Total Price: ${totalPrice.toFixed(2)}</p>
          </div>
        )
      )}
    </div>
  );

  return (
    <CommonLayout 
      title={step === 8 ? 'Reservation Confirmed' : 'Make a Reservation'}
      icon={Calendar}
      width="max-w-7xl"
      sidebar={renderSidebar()}
    >
      {renderStepContent()}
      {step < 6 && ( // Only show the Next button if the step is less than 7
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button 
              onClick={handlePrevious} 
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
          )}
          <Button 
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white ml-auto"
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </CommonLayout>
  );
};

export default MakeReservation;