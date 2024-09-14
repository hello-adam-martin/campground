// src/config/appConfig.js

const config = {
  stripe: {
    publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key',
    currency: 'NZD',
  },
  api: {
    baseUrl: process.env.NODE_ENV === 'production' ? '' : process.env.REACT_APP_API_URL || 'http://localhost:3003',
    endpoints: {
      createPaymentIntent: '/api/create-payment-intent',
      getAvailableSites: '/api/available-sites',
    }
  },
  campground: {
    
    siteTypes: [
      {
        id: 'powered',
        name: 'Powered Site',
        icon: 'Zap',
        requiresSiteSelection: true,
        limitedAvailability: true,
        sites: [
          { id: 'P1', number: 'A1' },
          { id: 'P2', number: 'A2' },
          { id: 'P3', number: 'B1' },
          { id: 'P4', number: 'B2' },
          { id: 'P5', number: 'C1' },
          { id: 'P6', number: 'C2' },
          { id: 'P7', number: 'D1' },
          { id: 'P8', number: 'D2' },
          { id: 'P9', number: 'E1' },
          { id: 'P10', number: 'E2' },
        ],
        pricing: {
          basePrice: 20,
          extraGuestPrice: 5,
          baseGuests: 2
        }
      },
      {
        id: 'unpowered',
        name: 'Unpowered Site',
        icon: 'Tent',
        requiresSiteSelection: false,
        limitedAvailability: false,
        totalSites: 20,
        pricing: {
          basePrice: 10,
          extraGuestPrice: 5,
          baseGuests: 2
        }
      },
      // You can easily add more site types here
      /*{
        id: 'cabin',
        name: 'Cabin',
        icon: 'Home',
        requiresSiteSelection: true,
        limitedAvailability: true,
        sites: [
          { id: 'C1', number: 'Cabin 1' },
          { id: 'C2', number: 'Cabin 2' },
          { id: 'C3', number: 'Cabin 3' },
        ],
        pricing: {
          basePrice: 50,
          extraGuestPrice: 10,
          baseGuests: 4
        }
      }*/
    ],
    additionalServices: [
      { id: 1, name: 'Dump Station', price: 5.00, allowMultiple: true },
      { id: 4, name: 'Rubbish Bag and Disposal', price: 10.00, allowMultiple: true },
    ],
    rules: [
      "Check-out time is 11 AM.",
      "Quiet hours are from 10 PM to 9 AM.",
      "Keep your campsite clean and free of litter.",
      "No Fires. BBQ use is allowed.",
      "Pets must be leashed at all times.",
      "Please pick up after your pets.",
      "All rubbish must be taken with you. Or purchase a rubbish bag from us.",
    ],
    exampleReservations: [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', siteNumber: 'A1', checkInDate: '2024-09-10' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '098-765-4321', siteNumber: 'B2', checkInDate: '2024-09-10' },
      { id: 3, name: 'Bob Smith', email: 'bob@example.com', phone: '111-222-3333', siteNumber: 'C3', checkInDate: '2024-09-11' },
    ],
  },

};

export default config;