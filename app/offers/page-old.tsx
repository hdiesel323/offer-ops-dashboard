'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchOffers, type Offer } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Filter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [verticalFilter, setVerticalFilter] = useState('all')

  useEffect(() => {
    loadOffers()
  }, [])

  useEffect(() => {
    filterOffers()
  }, [offers, searchQuery, statusFilter, verticalFilter])

  async function loadOffers() {
    try {
      const data = await fetchOffers()
      setOffers(data)
      setFilteredOffers(data)
    } catch (error) {
      console.error('Error loading offers:', error)
    } finally {
      setLoading(false)
    }
  }

  function filterOffers() {
    let filtered = offers

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (offer) =>
          offer.campaign_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.offer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.buyer?.buyer_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((offer) => offer.status === statusFilter)
    }

    // Vertical filter
    if (verticalFilter !== 'all') {
      filtered = filtered.filter((offer) => offer.vertical === verticalFilter)
    }

    setFilteredOffers(filtered)
  }

  const verticals = Array.from(new Set(offers.map((o) => o.vertical))).sort()
  const statuses = Array.from(new Set(offers.map((o) => o.status))).sort()

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading offers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Offers</h1>
          <p className="text-muted-foreground">
            Manage your offer inventory
          </p>
        </div>
        <Link href="/offers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Offer
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search offers..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={verticalFilter} onValueChange={setVerticalFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Vertical" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Verticals</SelectItem>
                {verticals.map((vertical) => (
                  <SelectItem key={vertical} value={vertical}>
                    {vertical}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {filteredOffers.length} Offer{filteredOffers.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer ID</TableHead>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Vertical</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOffers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell className="font-mono text-sm">
                    {offer.offer_id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {offer.campaign_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{offer.vertical}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        offer.status === 'Active' ? 'default' : 'secondary'
                      }
                    >
                      {offer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{offer.buyer?.buyer_name || 'N/A'}</TableCell>
                  <TableCell>
                    {offer.publisher_payout_min && offer.publisher_payout_max
                      ? `$${offer.publisher_payout_min}-$${offer.publisher_payout_max}`
                      : offer.publisher_payout_min
                      ? `$${offer.publisher_payout_min}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Link href={`/offers/${offer.offer_id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOffers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No offers found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
