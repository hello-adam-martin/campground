import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ShoppingCart, Check } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CommonLayout from './CommonLayout';
import CheckoutForm from './CheckoutForm';
import ExtrasSelector from './ExtrasSelector';
import { useCampgroundContext } from '../context/CampgroundContext';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PurchaseExtras = () => {
  const { additionalServices } = useCampgroundContext();
  const [step, setStep] = useState('selection');
  const [selectedExtras, setSelectedExtras] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const total = Object.values(selectedExtras).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(total);
  }, [selectedExtras]);

  useEffect(() => {
    console.log('Additional Services:', additionalServices);
  }, [additionalServices]);

  const handleExtrasChange = (updatedExtras) => {
    setSelectedExtras(updatedExtras);
  };

  const handlePurchase = () => {
    setStep('payment');
  };

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment succeeded:', paymentIntent);
    alert('Purchase completed successfully! Please collect your items at the campground office.');
    setSelectedExtras({});
    setTotalPrice(0);
    setStep('selection');
  };

  const handlePaymentError = (errorMessage) => {
    console.error('Payment failed:', errorMessage);
    alert(`Payment failed: ${errorMessage}. Please try again or contact support.`);
  };

  const renderSelectionStep = () => (
    <div className="space-y-4">
      <ExtrasSelector
        selectedExtras={selectedExtras}
        onExtrasChange={handleExtrasChange}
        availableExtras={additionalServices}
      />
      {Object.values(selectedExtras).length > 0 && (
        <Button onClick={handlePurchase} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Proceed to Payment
        </Button>
      )}
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-4">
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Your Order:</h3>
        {Object.values(selectedExtras).map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <span>{item.name} x {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="mt-4 font-bold">
          Total: ${totalPrice.toFixed(2)}
        </div>
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
      case 'selection':
        return renderSelectionStep();
      case 'payment':
        return renderPaymentStep();
      default:
        return null;
    }
  };

  const renderSidebar = () => {
    const steps = [
      { key: 'selection', label: 'Select additional services' },
      { key: 'payment', label: 'Complete payment' }
    ];
  
    const getStepIndex = (currentStep) => steps.findIndex(s => s.key === currentStep);
    const currentStepIndex = getStepIndex(step);
  
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Purchase Process</h3>
        <ul className="space-y-2">
          {steps.map((s, index) => (
            <li key={s.key} 
                className={`flex items-center space-x-2 ${step === s.key ? 'text-blue-600 font-semibold' : ''}`}>
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
        {Object.values(selectedExtras).length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold mb-2">Your Cart:</h4>
            {Object.values(selectedExtras).map((item) => (
              <p key={item.id}>{item.name} x {item.quantity}</p>
            ))}
            <p className="font-bold mt-2">Total: ${totalPrice.toFixed(2)}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <CommonLayout 
      title="Purchase Extras"
      icon={ShoppingCart}
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

export default PurchaseExtras;