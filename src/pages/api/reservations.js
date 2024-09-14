// pages/api/reservations.js
import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { 
      siteId, startDate, endDate, firstName, lastName, 
      email, phoneNumber, adultCount, childCount, 
      totalPrice, extras 
    } = req.body

    try {
      // Insert the reservation
      const { data: reservation, error: reservationError } = await supabase
        .from('reservations')
        .insert({
          site_id: siteId,
          start_date: startDate,
          end_date: endDate,
          guest_name: `${firstName} ${lastName}`,
          guest_email: email,
          guest_phone: phoneNumber,
          adult_count: adultCount,
          child_count: childCount,
          total_price: totalPrice
        })
        .single()

      if (reservationError) throw reservationError

      // Insert the additional services
      if (extras && extras.length > 0) {
        const reservationServices = extras.map(extra => ({
          reservation_id: reservation.id,
          service_id: extra.id,
          quantity: extra.quantity
        }))

        const { error: servicesError } = await supabase
          .from('reservation_services')
          .insert(reservationServices)

        if (servicesError) throw servicesError
      }

      res.status(201).json({ success: true, reservation })
    } catch (error) {
      res.status(500).json({ error: 'Failed to create reservation' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}