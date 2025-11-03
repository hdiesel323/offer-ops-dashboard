'use client'

import { useEffect, useState } from 'react'
import { fetchOffers, type Offer } from '@/lib/supabase'
import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'

export default function OfferMappingPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')

  useEffect(() => {
    loadOffers()
  }, [])

  async function loadOffers() {
    try {
      const data = await fetchOffers()
      setOffers(data)
    } catch (error) {
      console.error('Error loading offers:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    // Export full mapping for backup
    const mappingData = offers.map(o => ({
      offer_id: o.offer_id,
      campaign_name: o.campaign_name,
      vertical: o.vertical,
      buyer_id: o.buyer?.buyer_id || 'N/A',
      buyer_name: o.buyer?.buyer_name || 'N/A',
      buyer_company: o.buyer?.company_name || 'N/A',
      status: o.status,
      created_at: o.created_at,
      notes: o.notes || ''
    }))
    
    const csv = [
      Object.keys(mappingData[0]).join(','),
      ...mappingData.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `offer-mapping-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const header = (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Offer ID Mapping (Admin Only)</h2>
        <p className="text-sm text-gray-600">Complete mapping of public IDs to internal buyer information</p>
      </div>
      <div className="flex gap-2 items-center">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
          />
        </span>
        <Button
          label="Export Backup"
          icon="pi pi-download"
          onClick={exportCSV}
          severity="success"
        />
      </div>
    </div>
  )

  const buyerBodyTemplate = (rowData: Offer) => {
    return (
      <div>
        <div className="font-semibold">{rowData.buyer?.buyer_name || 'N/A'}</div>
        <div className="text-sm text-gray-600">{rowData.buyer?.buyer_id || ''}</div>
        <div className="text-xs text-gray-500">{rowData.buyer?.company_name || ''}</div>
      </div>
    )
  }

  const statusBodyTemplate = (rowData: Offer) => {
    return (
      <Tag
        value={rowData.status}
        severity={rowData.status === 'Active' ? 'success' : 'warning'}
      />
    )
  }

  const dateBodyTemplate = (rowData: Offer) => {
    return new Date(rowData.created_at).toLocaleDateString()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500">
        <div className="flex items-start">
          <i className="pi pi-lock text-red-500 mr-3 mt-1"></i>
          <div>
            <h3 className="font-bold text-red-800">🔒 CONFIDENTIAL - ADMIN ACCESS ONLY</h3>
            <p className="text-sm text-red-700">
              This page shows the complete mapping between public offer IDs and internal buyer information. 
              This data is NEVER shown to publishers or external parties.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <DataTable
          value={offers}
          loading={loading}
          paginator
          rows={25}
          rowsPerPageOptions={[25, 50, 100]}
          dataKey="id"
          globalFilter={globalFilter}
          header={header}
          emptyMessage="No offers found."
          stripedRows
          showGridlines
          sortMode="multiple"
          className="text-sm"
        >
          <Column
            field="offer_id"
            header="Public Offer ID"
            sortable
            filter
            style={{ fontFamily: 'monospace', fontWeight: 'bold', minWidth: '10rem' }}
          />
          <Column
            field="campaign_name"
            header="Public Campaign Name"
            sortable
            filter
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="vertical"
            header="Vertical"
            sortable
            filter
            style={{ minWidth: '8rem' }}
          />
          <Column
            header="🔒 Buyer (Internal)"
            body={buyerBodyTemplate}
            sortable
            sortField="buyer.buyer_name"
            style={{ minWidth: '12rem', backgroundColor: '#fff3cd' }}
          />
          <Column
            field="status"
            header="Status"
            body={statusBodyTemplate}
            sortable
            filter
            style={{ minWidth: '8rem' }}
          />
          <Column
            field="created_at"
            header="Created"
            body={dateBodyTemplate}
            sortable
            style={{ minWidth: '8rem' }}
          />
          <Column
            field="notes"
            header="Internal Notes"
            sortable
            style={{ minWidth: '15rem', fontSize: '0.75rem' }}
          />
        </DataTable>
      </Card>

      <Card className="mt-4" title="📋 Backup & Recovery">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Automated Backups:</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Database automatically backed up daily via Supabase</li>
              <li>All offer data stored with full buyer relationships</li>
              <li>Change history tracked with timestamps</li>
              <li>Can restore from any point in time</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Manual Export:</h4>
            <p className="text-sm text-gray-700 mb-2">
              Click "Export Backup" above to download a CSV with complete mapping:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Save to secure location (encrypted drive)</li>
              <li>Export weekly for extra safety</li>
              <li>Include in your backup rotation</li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
            <h4 className="font-semibold mb-2 text-blue-800">💡 Recovery Process:</h4>
            <p className="text-sm text-blue-700">
              If system fails, use exported CSV to restore mappings. Each offer_id links to buyer_id permanently in database.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
