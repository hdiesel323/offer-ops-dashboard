'use client'

import { useEffect, useState } from 'react'
import { fetchBuyers, type Buyer } from '@/lib/supabase'
import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'

export default function BuyersPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBuyers()
  }, [])

  async function loadBuyers() {
    try {
      const data = await fetchBuyers()
      setBuyers(data)
    } catch (error) {
      console.error('Error loading buyers:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusBodyTemplate = (rowData: Buyer) => {
    return (
      <Tag
        value={rowData.status}
        severity={rowData.status === 'Active' ? 'success' : 'warning'}
      />
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Buyers</h1>
        <p className="text-gray-600">Manage your buyer relationships</p>
      </div>

      <Card>
        <DataTable
          value={buyers}
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage="No buyers found."
          stripedRows
        >
          <Column field="buyer_id" header="Buyer ID" sortable />
          <Column field="buyer_name" header="Name" sortable />
          <Column field="company_name" header="Company" sortable />
          <Column field="email" header="Email" sortable />
          <Column
            field="status"
            header="Status"
            body={statusBodyTemplate}
            sortable
          />
          <Column field="payment_terms" header="Payment Terms" sortable />
          <Column field="quality_score" header="Quality Score" sortable />
        </DataTable>
      </Card>
    </div>
  )
}
