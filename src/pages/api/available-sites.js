// pages/api/available-sites.js
import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { startDate, endDate, siteType } = req.query
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*, site_types!inner(*)')
        .eq('site_types.id', siteType)
        .not('id', 'in', supabase
          .from('reservations')
          .select('site_id')
          .gte('start_date', startDate)
          .lte('end_date', endDate)
        )

      if (error) throw error
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch available sites' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}