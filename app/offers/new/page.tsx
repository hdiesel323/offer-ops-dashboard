'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createOffer, fetchBuyers, type Buyer } from '@/lib/supabase'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { InputTextarea } from 'primereact/inputtextarea'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { MultiSelect } from 'primereact/multiselect'

const VERTICALS = [
  'ACA',
  'Final Expense',
  'Medicare',
  'SSDI',
  'U65',
  'Auto Insurance',
  'Mortgage',
  'Legal',
  'Debt Settlement',
  'Life Insurance',
  'Home Services'
]

const STATUSES = ['Active', 'Testing', 'Paused', 'Archived']
const OFFER_TYPES = ['CPA', 'CPL', 'Transfer', 'Inbound', 'Form Fill']
const DIRECTIONS = ['Buying', 'Selling']

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

export default function NewOfferPage() {
  const router = useRouter()
  const toast = useRef<Toast>(null)
  const [loading, setLoading] = useState(false)
  const [buyers, setBuyers] = useState<Buyer[]>([])

  const [formData, setFormData] = useState<{
    offer_id: string
    campaign_name: string
    vertical: string
    status: string
    offer_type: string
    direction: string
    buyer_id: string | null
    publisher_payout_min: number | null
    publisher_payout_max: number | null
    advertiser_price_min: number | null
    advertiser_price_max: number | null
    states_allowed: string[]
    age_range: string
    hours_of_operation: string
    compliance_requirements: string
    payment_terms: string
    notes: string
  }>({
    offer_id: '',
    campaign_name: '',
    vertical: '',
    status: 'Testing',
    offer_type: 'CPA',
    direction: 'Selling',
    buyer_id: null,
    publisher_payout_min: null,
    publisher_payout_max: null,
    advertiser_price_min: null,
    advertiser_price_max: null,
    states_allowed: [],
    age_range: '',
    hours_of_operation: '',
    compliance_requirements: '',
    payment_terms: '',
    notes: ''
  })

  // Auto-generate Offer ID and Campaign Name when key fields change
  useEffect(() => {
    if (formData.vertical && formData.buyer_id && formData.offer_type) {
      const buyer = buyers.find(b => b.id === formData.buyer_id)
      if (buyer) {
        // Generate Offer ID: VERTICAL-SEQUENCE 
        // e.g., ACA-001 (buyer name hidden for security)
        const verticalCode = formData.vertical.toUpperCase().replace(/\s+/g, '').substring(0, 6)
        const timestamp = Date.now().toString().slice(-3)
        const offerId = `${verticalCode}-${timestamp}`
        
        // Generate Campaign Name: Vertical Type
        // e.g., "ACA CPA" (buyer name hidden for security)
        const campaignName = `${formData.vertical} ${formData.offer_type}`
        
        setFormData(prev => ({
          ...prev,
          offer_id: offerId,
          campaign_name: campaignName
        }))
      }
    }
  }, [formData.vertical, formData.buyer_id, formData.offer_type, buyers])

  useEffect(() => {
    loadBuyers()
  }, [])

  async function loadBuyers() {
    try {
      const data = await fetchBuyers()
      setBuyers(data)
    } catch (error) {
      console.error('Error loading buyers:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.offer_id || !formData.campaign_name || !formData.vertical) {
      toast.current?.show({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields',
        life: 3000
      })
      return
    }

    setLoading(true)
    
    try {
      await createOffer({
        ...formData,
        states_allowed: formData.states_allowed.length > 0 ? formData.states_allowed : null
      })
      
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Offer created successfully',
        life: 3000
      })
      
      setTimeout(() => {
        router.push('/offers')
      }, 1500)
      
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to create offer',
        life: 5000
      })
    } finally {
      setLoading(false)
    }
  }

  const buyerOptions = buyers.map(b => ({
    label: b.buyer_name,
    value: b.id
  }))

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Toast ref={toast} />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create New Offer</h1>
        <p className="text-gray-600">Fill in the details to create a new offer</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Offer ID <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">(auto-generated)</span>
                  </label>
                  <InputText
                    value={formData.offer_id}
                    onChange={(e) => setFormData({...formData, offer_id: e.target.value})}
                    placeholder="Select vertical, buyer, and type to auto-generate"
                    className="w-full bg-gray-50"
                    required
                    disabled={!formData.vertical || !formData.buyer_id || !formData.offer_type}
                  />
                  <small className="text-xs text-gray-500">
                    Format: VERTICAL-BUYER-### (e.g., ACA-JESSE-001)
                  </small>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Campaign Name <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">(auto-generated)</span>
                  </label>
                  <InputText
                    value={formData.campaign_name}
                    onChange={(e) => setFormData({...formData, campaign_name: e.target.value})}
                    placeholder="Auto-generated from vertical, type, and buyer"
                    className="w-full bg-gray-50"
                    required
                  />
                  <small className="text-xs text-gray-500">
                    Format: Vertical Type - Buyer (e.g., ACA CPA - Jesse)
                  </small>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Vertical <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    value={formData.vertical}
                    options={VERTICALS}
                    onChange={(e) => setFormData({...formData, vertical: e.value})}
                    placeholder="Select Vertical"
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Dropdown
                    value={formData.status}
                    options={STATUSES}
                    onChange={(e) => setFormData({...formData, status: e.value})}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Offer Type</label>
                  <Dropdown
                    value={formData.offer_type}
                    options={OFFER_TYPES}
                    onChange={(e) => setFormData({...formData, offer_type: e.value})}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Direction</label>
                  <Dropdown
                    value={formData.direction}
                    options={DIRECTIONS}
                    onChange={(e) => setFormData({...formData, direction: e.value})}
                    className="w-full"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Buyer</label>
                  <Dropdown
                    value={formData.buyer_id}
                    options={buyerOptions}
                    onChange={(e) => setFormData({...formData, buyer_id: e.value})}
                    placeholder="Select Buyer"
                    className="w-full"
                    showClear
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4">Pricing</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Publisher Payout Min ($)</label>
                  <InputNumber
                    value={formData.publisher_payout_min}
                    onValueChange={(e) => setFormData({...formData, publisher_payout_min: e.value ?? null})}
                    mode="currency"
                    currency="USD"
                    locale="en-US"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Publisher Payout Max ($)</label>
                  <InputNumber
                    value={formData.publisher_payout_max}
                    onValueChange={(e) => setFormData({...formData, publisher_payout_max: e.value ?? null})}
                    mode="currency"
                    currency="USD"
                    locale="en-US"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Advertiser Price Min ($)</label>
                  <InputNumber
                    value={formData.advertiser_price_min}
                    onValueChange={(e) => setFormData({...formData, advertiser_price_min: e.value ?? null})}
                    mode="currency"
                    currency="USD"
                    locale="en-US"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Advertiser Price Max ($)</label>
                  <InputNumber
                    value={formData.advertiser_price_max}
                    onValueChange={(e) => setFormData({...formData, advertiser_price_max: e.value ?? null})}
                    mode="currency"
                    currency="USD"
                    locale="en-US"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Targeting */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4">Targeting & Compliance</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">States Allowed</label>
                  <MultiSelect
                    value={formData.states_allowed}
                    options={US_STATES}
                    onChange={(e) => setFormData({...formData, states_allowed: e.value})}
                    placeholder="Select States"
                    className="w-full"
                    display="chip"
                    filter
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Age Range</label>
                    <InputText
                      value={formData.age_range}
                      onChange={(e) => setFormData({...formData, age_range: e.target.value})}
                      placeholder="e.g., 18-65"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Hours of Operation</label>
                    <InputText
                      value={formData.hours_of_operation}
                      onChange={(e) => setFormData({...formData, hours_of_operation: e.target.value})}
                      placeholder="e.g., 9 AM - 6 PM EST"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Compliance Requirements</label>
                  <InputTextarea
                    value={formData.compliance_requirements}
                    onChange={(e) => setFormData({...formData, compliance_requirements: e.target.value})}
                    rows={3}
                    className="w-full"
                    placeholder="List any compliance requirements..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Payment Terms</label>
                  <InputText
                    value={formData.payment_terms}
                    onChange={(e) => setFormData({...formData, payment_terms: e.target.value})}
                    placeholder="e.g., Net 7, Net 30"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <InputTextarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={4}
                className="w-full"
                placeholder="Any additional notes or details..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                label="Cancel"
                severity="secondary"
                outlined
                onClick={() => router.push('/offers')}
                type="button"
              />
              <Button
                label="Create Offer"
                icon="pi pi-check"
                loading={loading}
                type="submit"
              />
            </div>
          </div>
        </Card>
      </form>
    </div>
  )
}
