import config from '../config/appConfig';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const { campground } = config;

export const mockApi = {
  getReservations: async () => {
    await delay(300);
    return campground.exampleReservations;
  },

  searchReservations: async (searchTerm) => {
    await delay(300);
    return campground.exampleReservations.filter(res => 
      res.id.toString() === searchTerm ||  // Check for exact reservation number match
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.email.toLowerCase() === searchTerm.toLowerCase() ||
      res.phone === searchTerm
    );
  },

  getAdditionalServices: async () => {
    await delay(300);
    return campground.additionalServices;
  },

  getSiteTypes: async () => {
    await delay(300);
    return campground.siteTypes;
  },

  getPricing: async () => {
    await delay(300);
    return campground.pricing;
  },

  getRules: async () => {
    await delay(300);
    return campground.rules;
  },

  getAvailableSites: async (startDate, endDate) => {
    await delay(300);
    
    // Generate mock data for the date range
    const availableSites = {};
    const currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);
  
    while (currentDate <= endDateObj) {
      const dateString = currentDate.toISOString().split('T')[0];
      
      // Randomly decide if powered sites are available (80% chance of availability)
      const hasPoweredAvailability = Math.random() < 0.8;
      
      availableSites[dateString] = {
        powered: hasPoweredAvailability ? Math.floor(Math.random() * 5) + 1 : 0, // 0 to 5 available powered sites
        unpowered: Math.floor(Math.random() * 10) + 5 // 5 to 14 available unpowered sites
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    console.log("Mock Available Sites:", availableSites);
    return availableSites;
  },

  makeReservation: async (reservationData) => {
    await delay(500);
    console.log('Reservation made:', reservationData);
    return { success: true, reservationId: Math.floor(Math.random() * 1000000) };
  },

  updateReservation: async (reservationId, updatedData) => {
    await delay(500);
    console.log('Reservation updated:', { id: reservationId, ...updatedData });
    return { success: true };
  },

  cancelReservation: async (reservationId) => {
    await delay(500);
    console.log('Reservation cancelled:', reservationId);
    return { success: true };
  },

  createPaymentIntent: async (amount, currency) => {
    await delay(300);
    try {
      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.createPaymentIntent}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, currency }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },
};