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
import Step6 from './reservations/Step6';
import Step7 from './reservations/Step7';
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

        console.log('Fetched site types:', fetchedSiteTypes);
        console.log('Fetched additional services:', fetchedAdditionalServices);

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
          const thirtyDaysLater = addDays(today, 30);
          const sites = await getAvailableSites(
            format(today, 'yyyy-MM-dd'),
            format(thirtyDaysLater, 'yyyy-MM-dd'),
            formData.siteType
          );
          console.log('Fetched available sites:', sites);
          setAvailableSites(sites);
        } catch (error) {
          console.error("Error fetching available sites:", error);
          setAvailableSites([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAvailableSites();
    }
  }, [formData.siteType]);

  const calculateTotalPrice = useCallback(() => {
    if (!formData.startDate || !formData.nights || !formData.siteType) return 0;

    const selectedSiteType = siteTypes.find(type => type.id === formData.siteType);
    if (!selectedSiteType) return 0;

    const basePrice = selectedSiteType.base_price * formData.nights;
    
    const extraAdults = Math.max(0, formData.adultCount - selectedSiteType.base_guests);
    const extraGuestPrice = extraAdults * selectedSiteType.extra_guest_price * formData.nights;
    
    const extrasPrice = Object.values(selectedExtras).reduce((total, item) => 
      total + (item.price * item.quantity), 0);

    return basePrice + extraGuestPrice + extrasPrice;
  }, [formData.startDate, formData.nights, formData.siteType, formData.adultCount, selectedExtras, siteTypes]);

  useEffect(() => {
    const total = calculateTotalPrice();
    setTotalPrice(total);
  }, [calculateTotalPrice]);

  const handleSiteTypeSelect = (typeId) => {
    console.log('Selected site type:', typeId);
    setField('siteType', typeId);
  };

  const handleDateSelect = (start, end) => {
    setField('startDate', start);
    setField('endDate', end);
  };

  const handleNightsChange = (nights) => {
    console.log('Changed nights:', nights);
    setField('nights', Math.max(1, nights));
  };

  const handleGuestCountChange = (e) => {
    const { name, value } = e.target;
    console.log('Changed guest count:', name, value);
    setField(name, Math.max(0, parseInt(value) || 0));
  };

  const handleNext = () => {
    if (step === 1 && !formData.siteType) {
      alert("Please select a site type.");
      return;
    }
    if (step === 2 && (!formData.startDate || formData.nights < 1)) {
      alert("Please select an arrival date and specify the number of nights.");
      return;
    }
    console.log('Moving to next step:', step + 1);
    setStep(step + 1);
  };

  const handlePrevious = () => {
    console.log('Moving to previous step:', step - 1);
    setStep(step - 1);
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const reservationData = {
        siteId: formData.siteNumber || null,
        siteType: formData.siteType,
        startDate: format(formData.startDate, 'yyyy-MM-dd'),
        endDate: format(addDays(formData.startDate, formData.nights - 1), 'yyyy-MM-dd'),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        adultCount: formData.adultCount,
        childCount: formData.childCount,
        totalPrice,
        extras: Object.values(selectedExtras)
      };
      console.log('Creating reservation with data:', reservationData);
      const result = await createReservation(reservationData);
      if (result.success) {
        console.log('Reservation created successfully');
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
    console.error('Payment failed:', errorMessage);
    alert(`Payment failed: ${errorMessage}. Please try again or contact support.`);
  };

  const renderStepContent = () => {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    console.log('Rendering step:', step);
    console.log('Current form data:', formData);
    console.log('Available sites:', availableSites);

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
      case 6:
        return (
          <Step6
            formData={formData}
            selectedExtras={selectedExtras}
            totalPrice={totalPrice}
            siteTypes={siteTypes}
          />
        );
      case 7:
        return (
          <Step7
            totalPrice={totalPrice}
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
          "Review reservation",
          "Make payment",
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
      {step !== 8 && (
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
      {step < 7 && (
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