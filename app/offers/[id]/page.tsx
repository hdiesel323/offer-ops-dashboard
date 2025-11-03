'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { fetchOffer, type Offer } from '@/lib/supabase'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { ProgressSpinner } from 'primereact/progressspinner'

export default function OfferDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [offer, setOffer] = useState<Offer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadOffer(params.id as string)
    }
  }, [params.id])

  async function loadOffer(offerId: string) {
    try {
      const data = await fetchOffer(offerId)
      setOffer(data)
    } catch (error) {
      console.error('Error loading offer:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex justify-center items-center h-96">
          <ProgressSpinner />
        </div>
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Card>
          <div className="text-center py-10">
            <i className="pi pi-exclamation-triangle text-4xl text-gray-400 mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">Offer Not Found</h2>
            <p className="text-gray-600 mb-4">The offer you&apos;re looking for doesn&apos;t exist.</p>
            <Button label="Back to Offers" onClick={() => router.push('/offers')} />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{offer.campaign_name}</h1>
          <p className="text-gray-600">{offer.offer_id}</p>
        </div>
        <div className="flex gap-2">
          <Button
            label="Back"
            icon="pi pi-arrow-left"
            outlined
            onClick={() => router.push('/offers')}
          />
        </div>
      </div>

      <div className="grid gap-6">
        <Card title="Basic Information">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Vertical</label>
              <div className="mt-1">
                <Tag value={offer.vertical} severity="info" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Status</label>
              <div className="mt-1">
                <Tag
                  value={offer.status}
                  severity={offer.status === 'Active' ? 'success' : 'warning'}
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Offer Type</label>
              <div className="mt-1 font-medium">{offer.offer_type}</div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Direction</label>
              <div className="mt-1 font-medium">{offer.direction}</div>
            </div>
          </div>
        </Card>

        {offer.buyer && (
          <Card title="Buyer Information">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Buyer ID</label>
                <div className="mt-1 font-medium">{offer.buyer.buyer_id}</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Buyer Name</label>
                <div className="mt-1 font-medium">{offer.buyer.buyer_name}</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Company</label>
                <div className="mt-1 font-medium">{offer.buyer.company_name || 'N/A'}</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <div className="mt-1 font-medium">
                  <Tag value={offer.buyer.status} severity={offer.buyer.status === 'Active' ? 'success' : 'warning'} />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <div className="mt-1">{offer.buyer.email || 'N/A'}</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Payment Terms</label>
                <div className="mt-1 font-medium">{offer.buyer.payment_terms || 'N/A'}</div>
              </div>
            </div>
          </Card>
        )}

        <Card title="Pricing">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Publisher Payout</label>
              <div className="mt-1 text-lg font-semibold text-green-600">
                {offer.publisher_payout_min && offer.publisher_payout_max
                  ? `$${offer.publisher_payout_min} - $${offer.publisher_payout_max}`
                  : offer.publisher_payout_min
                  ? `$${offer.publisher_payout_min}`
                  : 'N/A'}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Advertiser Price</label>
              <div className="mt-1 text-lg font-semibold text-blue-600">
                {offer.advertiser_price_min && offer.advertiser_price_max
                  ? `$${offer.advertiser_price_min} - $${offer.advertiser_price_max}`
                  : offer.advertiser_price_min
                  ? `$${offer.advertiser_price_min}`
                  : 'N/A'}
              </div>
            </div>
          </div>
        </Card>

        {(offer.age_range || offer.hours_of_operation || offer.states_allowed) && (
          <Card title="Targeting & Compliance">
            {offer.age_range && (
              <div className="mb-4">
                <label className="text-sm text-gray-600">Age Range</label>
                <div className="mt-1 font-medium">{offer.age_range}</div>
              </div>
            )}
            {offer.hours_of_operation && (
              <div className="mb-4">
                <label className="text-sm text-gray-600">Hours of Operation</label>
                <div className="mt-1 font-medium">{offer.hours_of_operation}</div>
              </div>
            )}
            {offer.states_allowed && Array.isArray(offer.states_allowed) && (
              <div>
                <label className="text-sm text-gray-600">States Allowed</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {offer.states_allowed.map((state) => (
                    <Tag key={state} value={state} />
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {offer.notes && (
          <Card title="Notes">
            <div className="whitespace-pre-wrap">{offer.notes}</div>
          </Card>
        )}
      </div>
    </div>
  )
}
