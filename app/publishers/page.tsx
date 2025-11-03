'use client'

import { useEffect, useState } from 'react'
import { fetchPublishers, type Publisher } from '@/lib/supabase'
import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'

export default function PublishersPage() {
  const [publishers, setPublishers] = useState<Publisher[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPublishers()
  }, [])

  async function loadPublishers() {
    try {
      const data = await fetchPublishers()
      setPublishers(data)
    } catch (error) {
      console.error('Error loading publishers:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusBodyTemplate = (rowData: Publisher) => {
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
        <h1 className="text-3xl font-bold mb-2">Publishers</h1>
        <p className="text-gray-600">Manage your publisher relationships</p>
      </div>

      <Card>
        <DataTable
          value={publishers}
          loading={loading}
          paginator
          rows={10}
          dataKey="id"
          emptyMessage="No publishers found."
          stripedRows
        >
          <Column field="publisher_id" header="Publisher ID" sortable />
          <Column field="publisher_name" header="Name" sortable />
          <Column field="company_name" header="Company" sortable />
          <Column field="email" header="Email" sortable />
          <Column
            field="status"
            header="Status"
            body={statusBodyTemplate}
            sortable
          />
        </DataTable>
      </Card>
    </div>
  )
}
