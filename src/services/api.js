// src/services/api.js
import { supabase } from '../lib/supabaseClient'
import { eachDayOfInterval, format, addDays } from 'date-fns';

export const getSiteTypes = async () => {
  const { data, error } = await supabase
    .from('site_types')
    .select('*')
  
  if (error) {
    console.error('Error fetching site types:', error)
    throw error
  }
  
  // Format the data to match the expected structure
  return data.map(site => ({
    ...site,
    pricing: {
      basePrice: site.base_price,
      extraGuestPrice: site.extra_guest_price,
      baseGuests: site.base_guests,
      maxGuests: site.max_guests
    }
  }))
}

export const getAvailableSites = async (startDate, siteType) => {
  console.log('Fetching available sites for:', { startDate, siteType });

  try {
    const endDate = addDays(new Date(startDate), 30);

    // Get the total number of sites for the given site type
    const { data: totalSites, error: totalSitesError } = await supabase
      .from('sites')
      .select('id', { count: 'exact' })
      .eq('site_type_id', siteType);

    if (totalSitesError) throw totalSitesError;

    const totalSiteCount = totalSites.length;

    // Get all reservations for the given site type and date range
    const { data: reservations, error: reservationsError } = await supabase
      .from('reservations')
      .select('id, start_date, end_date, site_id(site_type_id)')
      .eq('site_id.site_type_id', siteType)
      .or(`and(start_date.lte.${format(endDate, 'yyyy-MM-dd')},end_date.gte.${format(startDate, 'yyyy-MM-dd')})`);

    if (reservationsError) throw reservationsError;

    // Calculate availability for each day
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    const availability = {};

    dateRange.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const reservationsOnDate = reservations.filter(res => 
        new Date(res.start_date) <= date && new Date(res.end_date) > date
      );
      availability[dateStr] = totalSiteCount - reservationsOnDate.length;
    });

    console.log('Availability:', availability);
    return availability;
  } catch (error) {
    console.error('Error fetching available sites:', error);
    throw error;
  }
};

export const getAdditionalServices = async () => {
  const { data, error } = await supabase
    .from('additional_services')
    .select('*')
  
  if (error) {
    console.error('Error fetching additional services:', error)
    throw error
  }

  return data
}

export const getRules = async () => {
  const { data, error } = await supabase
    .from('rules')
    .select('*')
  
  if (error) {
    console.error('Error fetching rules:', error)
    throw error
  }

  return data.map(rule => rule.description)
}

export const createReservation = async (reservationData) => {
  console.log('Creating reservation with data:', reservationData);
  try {
    const { data, error } = await supabase
      .from('reservations')
      .insert([
        {
          site_id: reservationData.siteId, // This can be null now
          site_type: reservationData.siteType, // Add this line
          start_date: reservationData.startDate,
          end_date: reservationData.endDate,
          guest_name: `${reservationData.firstName} ${reservationData.lastName}`,
          guest_email: reservationData.email,
          guest_phone: reservationData.phoneNumber,
          adult_count: reservationData.adultCount,
          child_count: reservationData.childCount,
          total_price: reservationData.totalPrice
        }
      ])
      .single();

    if (error) throw error;

    // If there are extras, insert them as well
    if (reservationData.extras && reservationData.extras.length > 0) {
      const { error: extrasError } = await supabase
        .from('reservation_extras')
        .insert(reservationData.extras.map(extra => ({
          reservation_id: data.id,
          extra_id: extra.id,
          quantity: extra.quantity
        })));

      if (extrasError) throw extrasError;
    }

    console.log('Reservation created successfully:', data);
    return { success: true, reservation: data };
  } catch (error) {
    console.error('Error creating reservation:', error.message);
    return { success: false, error: error.message };
  }
}

export const searchReservations = async (searchTerm) => {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .or(`id.eq.${searchTerm},guest_name.ilike.%${searchTerm}%,guest_email.ilike.%${searchTerm}%,guest_phone.ilike.%${searchTerm}%`)

  if (error) {
    console.error('Error searching reservations:', error)
    throw error
  }

  return data
}

export const updateReservation = async (reservationId, updateData) => {
  const { data, error } = await supabase
    .from('reservations')
    .update(updateData)
    .eq('id', reservationId)
    .select()

  if (error) {
    console.error('Error updating reservation:', error)
    throw error
  }

  return data[0]
}

export const cancelReservation = async (reservationId) => {
  const { data, error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', reservationId)

  if (error) {
    console.error('Error cancelling reservation:', error)
    throw error
  }

  return { success: true }
}

export const createPaymentIntent = async (amount, currency) => {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, currency }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to create payment intent')
  }

  return response.json()
}