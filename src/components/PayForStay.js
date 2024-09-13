import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CreditCard } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CommonLayout from './CommonLayout';
import CheckoutForm from './CheckoutForm';
import ExtrasSelector from './ExtrasSelector';
import { useCampgroundContext } from '../context/CampgroundContext';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PayForStay = () => {
  const navigate = useNavigate();
  const { additionalServices, siteTypes } = useCampgroundContext();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    daysStayed: 1,
    startDate: new Date().toISOString().split('T')[0],
    siteType: '',
    guestsOver13: 1,
  });
  const [selectedExtras, setSelectedExtras] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(formData.daysStayed > 0 && formData.guestsOver13 > 0 && formData.siteType !== '');
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExtrasChange = (updatedExtras) => {
    setSelectedExtras(updatedExtras);
  };

  const handleSiteTypeSelect = (typeId) => {
    setFormData(prev => ({ ...prev, siteType: typeId }));
  };

  const calculateTotal = useCallback(() => {
    if (!formData.siteType || !siteTypes) return 0;

    const selectedSiteType = siteTypes.find(type => type.id === formData.siteType);
    if (!selectedSiteType || !selectedSiteType.pricing) return 0;

    const { pricing } = selectedSiteType;
    const basePrice = pricing.basePrice * formData.daysStayed;
    const extraAdults = Math.max(0, formData.guestsOver13 - pricing.baseGuests);
    const extraGuestPrice = extraAdults * pricing.extraGuestPrice * formData.daysStayed;
    const extrasPrice = Object.values(selectedExtras).reduce((total, item) => 
      total + (item.price * item.quantity), 0);

    return basePrice + extraGuestPrice + extrasPrice;
  }, [formData, selectedExtras, siteTypes]);

  useEffect(() => {
    const total = calculateTotal();
    setTotalPrice(total);
  }, [calculateTotal]);

  const handleNextStep = () => {
    setStep(2);
  };

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    alert('Payment processed successfully! Thank you for your stay.');
    navigate('/');
  };

  const handlePaymentError = (errorMessage) => {
    console.error('Payment error:', errorMessage);
    alert(`Payment failed: ${errorMessage}. Please try again or contact support.`);
  };

  const renderStayDetails = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
          Start Date
        </label>
        <Input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="daysStayed" className="block text-sm font-medium text-gray-700 mb-1">
          Number of Days Stayed
        </label>
        <Input
          type="number"
          id="daysStayed"
          name="daysStayed"
          value={formData.daysStayed}
          onChange={handleInputChange}
          min="1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Site Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {siteTypes.map(type => {
            const IconComponent = LucideIcons[type.icon];
            return (
              <Button
                key={type.id}
                type="button"
                onClick={() => handleSiteTypeSelect(type.id)}
                className={`h-auto p-4 flex flex-col items-center justify-center text-lg transition-all duration-200 ease-in-out
                  ${formData.siteType === type.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-100 hover:border-blue-700 hover:text-blue-700'
                  }
                  transform hover:shadow-lg
                `}
              >
                {IconComponent && <IconComponent size={32} className="mb-2" />}
                <span className="text-xl font-bold mb-2">{type.name}</span>
                <div className="text-sm">
                  <p>${type.pricing.basePrice}/night</p>
                  <p>({type.pricing.baseGuests} guests included)</p>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
      <div>
        <label htmlFor="guestsOver13" className="block text-sm font-medium text-gray-700 mb-1">
          Number of Guests (over 13)
        </label>
        <Input
          type="number"
          id="guestsOver13"
          name="guestsOver13"
          value={formData.guestsOver13}
          onChange={handleInputChange}
          min="1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Services
        </label>
        <ExtrasSelector
          selectedExtras={selectedExtras}
          onExtrasChange={handleExtrasChange}
          availableExtras={additionalServices}
        />
      </div>
      <Button 
        onClick={handleNextStep} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        disabled={!isFormValid}
      >
        Proceed to Payment
      </Button>
    </div>
  );

  const renderPayment = () => (
    <div className="space-y-4">
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Stay Summary:</h3>
        <p>Start Date: {formData.startDate}</p>
        <p>Days Stayed: {formData.daysStayed}</p>
        <p>Site Type: {siteTypes.find(site => site.id === formData.siteType)?.name}</p>
        <p>Guests (over 13): {formData.guestsOver13}</p>
        {Object.values(selectedExtras).length > 0 && (
          <div>
            <p className="font-semibold mt-2">Extras:</p>
            <ul className="list-disc pl-5">
              {Object.values(selectedExtras).map(extra => (
                <li key={extra.id}>{extra.name} x{extra.quantity} - ${(extra.price * extra.quantity).toFixed(2)}</li>
              ))}
            </ul>
          </div>
        )}
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
    switch(step) {
      case 1:
        return renderStayDetails();
      case 2:
        return renderPayment();
      default:
        return null;
    }
  };

  const renderSidebar = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Payment Process</h3>
      <ul className="space-y-2">
        <li className={`flex items-center space-x-2 ${step === 1 ? 'text-blue-600 font-semibold' : ''}`}>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${step === 1 ? 'border-blue-600' : 'border-gray-300'}`}>
            1
          </div>
          <span>Enter stay details</span>
        </li>
        <li className={`flex items-center space-x-2 ${step === 2 ? 'text-blue-600 font-semibold' : ''}`}>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${step === 2 ? 'border-blue-600' : 'border-gray-300'}`}>
            2
          </div>
          <span>Review and pay</span>
        </li>
      </ul>
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold mb-2">Stay Summary:</h4>
        <p>Start Date: {formData.startDate}</p>
        <p>Days Stayed: {formData.daysStayed}</p>
        <p>Site Type: {siteTypes.find(site => site.id === formData.siteType)?.name || 'Not selected'}</p>
        <p>Guests (over 13): {formData.guestsOver13}</p>
        {Object.values(selectedExtras).length > 0 && (
          <>
            <p className="font-semibold mt-2">Extras:</p>
            <ul className="list-disc pl-5">
              {Object.values(selectedExtras).map(extra => (
                <li key={extra.id}>{extra.name} x{extra.quantity}</li>
              ))}
            </ul>
          </>
        )}
        <p className="font-bold mt-2">Total: ${totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );

  return (
    <CommonLayout 
      title="Pay for Past Stay"
      icon={CreditCard}
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

export default PayForStay;