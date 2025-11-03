'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { fetchOffers, type Offer } from '@/lib/supabase'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { Card } from 'primereact/card'
import { FilterMatchMode } from 'primereact/api'

export default function OffersPagePrime() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    vertical: { value: null, matchMode: FilterMatchMode.EQUALS },
  })
  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<Offer[]>>(null)

  useEffect(() => {
    loadOffers()
  }, [])

  async function loadOffers() {
    try {
      setLoading(true)
      const data = await fetchOffers()
      setOffers(data)
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: `Loaded ${data.length} offers`,
        life: 3000,
      })
    } catch (error) {
      console.error('Error loading offers:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load offers',
        life: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const _filters: any = { ...filters }
    _filters.global.value = value
    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  const exportCSV = () => {
    dt.current?.exportCSV()
  }

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(offers)
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] }
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      })
      saveAsExcelFile(excelBuffer, 'offers')
    })
  }

  const saveAsExcelFile = (buffer: any, fileName: string) => {
    import('file-saver').then((module) => {
      if (module && module.default) {
        const EXCEL_TYPE =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        const EXCEL_EXTENSION = '.xlsx'
        const data = new Blob([buffer], { type: EXCEL_TYPE })
        module.default.saveAs(
          data,
          fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
        )
      }
    })
  }

  // Templates
  const statusBodyTemplate = (rowData: Offer) => {
    return (
      <Tag
        value={rowData.status}
        severity={rowData.status === 'Active' ? 'success' : 'warning'}
      />
    )
  }

  const verticalBodyTemplate = (rowData: Offer) => {
    return <Tag value={rowData.vertical} severity="info" />
  }

  const payoutBodyTemplate = (rowData: Offer) => {
    if (rowData.publisher_payout_min && rowData.publisher_payout_max) {
      return `$${rowData.publisher_payout_min} - $${rowData.publisher_payout_max}`
    }
    if (rowData.publisher_payout_min) {
      return `$${rowData.publisher_payout_min}`
    }
    return 'N/A'
  }

  const buyerBodyTemplate = (rowData: Offer) => {
    // TODO: Check user role - for now showing for admins only
    // Publishers should see '[Private]' instead
    return rowData.buyer?.buyer_name || 'N/A'
  }

  const actionBodyTemplate = (rowData: Offer) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          rounded
          outlined
          className="mr-2"
          onClick={() => {
            window.location.href = `/offers/${rowData.offer_id}`
          }}
        />
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          severity="success"
          onClick={() => {
            window.location.href = `/offers/${rowData.offer_id}/edit`
          }}
        />
      </div>
    )
  }

  // Toolbar
  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Link href="/offers/new">
          <Button label="New" icon="pi pi-plus" severity="success" />
        </Link>
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          disabled
        />
      </div>
    )
  }

  const rightToolbarTemplate = () => {
    return (
      <div className="flex gap-2">
        <Button
          label="Export CSV"
          icon="pi pi-file"
          onClick={exportCSV}
          className="p-button-help"
        />
        <Button
          label="Export Excel"
          icon="pi pi-file-excel"
          severity="success"
          onClick={exportExcel}
        />
      </div>
    )
  }

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Offers</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
      </span>
    </div>
  )

  const statuses = ['Active', 'Paused', 'Testing', 'Archived']
  const statusFilterTemplate = (options: any) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterCallback(e.value)}
        placeholder="Select Status"
        className="p-column-filter"
        showClear
      />
    )
  }

  const verticals = Array.from(new Set(offers.map((o) => o.vertical))).sort()
  const verticalFilterTemplate = (options: any) => {
    return (
      <Dropdown
        value={options.value}
        options={verticals}
        onChange={(e) => options.filterCallback(e.value)}
        placeholder="Select Vertical"
        className="p-column-filter"
        showClear
      />
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Toast ref={toast} />

      <Card className="mb-4">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        />

        <DataTable
          ref={dt}
          value={offers}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          dataKey="id"
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={[
            'offer_id',
            'campaign_name',
            'vertical',
            'buyer.buyer_name',
          ]}
          header={header}
          emptyMessage="No offers found."
          className="p-datatable-sm"
          stripedRows
          showGridlines
          sortMode="multiple"
          removableSort
        >
          <Column
            field="offer_id"
            header="Offer ID"
            sortable
            filter
            filterPlaceholder="Search by ID"
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="campaign_name"
            header="Campaign Name"
            sortable
            filter
            filterPlaceholder="Search by name"
            style={{ minWidth: '15rem' }}
          />
          <Column
            field="vertical"
            header="Vertical"
            sortable
            filter
            filterElement={verticalFilterTemplate}
            body={verticalBodyTemplate}
            style={{ minWidth: '10rem' }}
          />
          <Column
            field="status"
            header="Status"
            sortable
            filter
            filterElement={statusFilterTemplate}
            body={statusBodyTemplate}
            style={{ minWidth: '8rem' }}
          />
          <Column
            field="buyer.buyer_name"
            header="Buyer"
            sortable
            body={buyerBodyTemplate}
            style={{ minWidth: '10rem' }}
          />
          <Column
            header="Payout"
            body={payoutBodyTemplate}
            sortable
            sortField="publisher_payout_max"
            style={{ minWidth: '10rem' }}
          />
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: '8rem' }}
          />
        </DataTable>
      </Card>
    </div>
  )
}
