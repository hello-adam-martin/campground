// pages/api/site-types.js
import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('site_types')
        .select('*')
      
      if (error) throw error
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch site types' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}