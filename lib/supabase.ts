import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Debug logging
if (typeof window !== 'undefined') {
  console.log('🔧 Supabase Config:', {
    url: supabaseUrl || 'MISSING',
    keyPrefix: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'MISSING',
    keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0,
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    // Check for common issues
    hasWhitespace: supabaseAnonKey ? /\s/.test(supabaseAnonKey) : false,
    startsWithEyJ: supabaseAnonKey ? supabaseAnonKey.startsWith('eyJ') : false
  })
  
  // Test a simple request to see the actual HTTP response
  console.log('🧪 Testing Supabase connection...')
  fetch(`${supabaseUrl}/rest/v1/offers?select=id&limit=1`, {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  })
    .then(res => {
      console.log('📡 Test response status:', res.status)
      console.log('📡 Test response headers:', Object.fromEntries(res.headers.entries()))
      return res.text()
    })
    .then(text => console.log('📡 Test response body:', text))
    .catch(err => console.error('❌ Test connection failed:', err))
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Offer {
  id: string
  offer_id: string
  campaign_name: string
  vertical: string
  status: string
  offer_type: string
  direction: string
  publisher_payout_min: number | null
  publisher_payout_max: number | null
  advertiser_price_min: number | null
  advertiser_price_max: number | null
  states_allowed: string[] | null
  age_range: string | null
  hours_of_operation: string | null
  compliance_requirements: string | null
  payment_terms: string | null
  notes: string | null
  buyer_id: string | null
  publisher_id: string | null
  created_at: string
  updated_at: string
  buyer?: Buyer
}

export interface Buyer {
  id: string
  buyer_id: string
  buyer_name: string
  company_name: string | null
  email: string | null
  status: string
  payment_terms: string | null
  quality_score: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Publisher {
  id: string
  publisher_id: string
  publisher_name: string
  company_name: string | null
  email: string | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}

// API Functions
export async function fetchOffers() {
  console.log('📡 Fetching offers from Supabase...')
  const { data, error } = await supabase
    .from('offers')
    .select('*, buyer:buyers(*)')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('❌ Supabase Error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    throw error
  }
  
  console.log('✅ Offers fetched:', data?.length || 0)
  return data as Offer[]
}

export async function fetchOffer(offerId: string) {
  const { data, error } = await supabase
    .from('offers')
    .select('*, buyer:buyers(*)')
    .eq('offer_id', offerId)
    .single()
  
  if (error) throw error
  return data as Offer
}

export async function createOffer(offerData: Partial<Offer>) {
  const { data, error } = await supabase
    .from('offers')
    .insert(offerData)
    .select()
    .single()
  
  if (error) throw error
  return data as Offer
}

export async function updateOffer(offerId: string, updates: Partial<Offer>) {
  const { data, error } = await supabase
    .from('offers')
    .update(updates)
    .eq('offer_id', offerId)
    .select()
    .single()
  
  if (error) throw error
  return data as Offer
}

export async function deleteOffer(offerId: string) {
  const { error } = await supabase
    .from('offers')
    .delete()
    .eq('offer_id', offerId)
  
  if (error) throw error
}

export async function fetchBuyers() {
  const { data, error } = await supabase
    .from('buyers')
    .select('*')
    .order('buyer_name')
  
  if (error) throw error
  return data as Buyer[]
}

export async function fetchPublishers() {
  const { data, error } = await supabase
    .from('publishers')
    .select('*')
    .order('publisher_name')
  
  if (error) throw error
  return data as Publisher[]
}

export async function getStats() {
  console.log('📊 Fetching stats from Supabase...')
  const [offers, buyers, publishers] = await Promise.all([
    supabase.from('offers').select('id, status, vertical'),
    supabase.from('buyers').select('id'),
    supabase.from('publishers').select('id')
  ])
  
  if (offers.error) console.error('❌ Offers error:', offers.error)
  if (buyers.error) console.error('❌ Buyers error:', buyers.error)
  if (publishers.error) console.error('❌ Publishers error:', publishers.error)
  
  const stats = {
    totalOffers: offers.data?.length || 0,
    totalBuyers: buyers.data?.length || 0,
    totalPublishers: publishers.data?.length || 0,
    activeOffers: offers.data?.filter(o => o.status === 'Active').length || 0,
    offersByStatus: offers.data?.reduce((acc: any, offer) => {
      acc[offer.status] = (acc[offer.status] || 0) + 1
      return acc
    }, {}),
    offersByVertical: offers.data?.reduce((acc: any, offer) => {
      acc[offer.vertical] = (acc[offer.vertical] || 0) + 1
      return acc
    }, {})
  }
  
  console.log('✅ Stats:', stats)
  return stats
}
