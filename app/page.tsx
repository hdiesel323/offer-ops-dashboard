'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getStats } from '@/lib/supabase'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Chart } from 'primereact/chart'
import { ProgressSpinner } from 'primereact/progressspinner'

export default function Home() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const data = await getStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Chart data
  const statusChartData = stats
    ? {
        labels: Object.keys(stats.offersByStatus || {}),
        datasets: [
          {
            label: 'Offers by Status',
            data: Object.values(stats.offersByStatus || {}),
            backgroundColor: [
              '#22c55e', // Active - green
              '#eab308', // Paused - yellow
              '#3b82f6', // Testing - blue
              '#6b7280', // Archived - gray
            ],
          },
        ],
      }
    : null

  const verticalChartData = stats
    ? {
        labels: Object.keys(stats.offersByVertical || {}),
        datasets: [
          {
            label: 'Offers by Vertical',
            data: Object.values(stats.offersByVertical || {}),
            backgroundColor: [
              '#3b82f6',
              '#8b5cf6',
              '#ec4899',
              '#f59e0b',
              '#10b981',
              '#06b6d4',
              '#6366f1',
            ],
          },
        ],
      }
    : null

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Offer-Ops Dashboard</h1>
        <p className="text-gray-600 text-lg">
          Professional offer management system
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm opacity-90 mb-2">Total Offers</div>
              {loading ? (
                <div className="text-3xl font-bold">--</div>
              ) : (
                <div className="text-3xl font-bold">{stats?.totalOffers}</div>
              )}
              <div className="text-sm opacity-75 mt-2">
                {stats?.activeOffers} active
              </div>
            </div>
            <i className="pi pi-file text-3xl opacity-50"></i>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm opacity-90 mb-2">Buyers</div>
              {loading ? (
                <div className="text-3xl font-bold">--</div>
              ) : (
                <div className="text-3xl font-bold">{stats?.totalBuyers}</div>
              )}
              <div className="text-sm opacity-75 mt-2">Active partnerships</div>
            </div>
            <i className="pi pi-users text-3xl opacity-50"></i>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm opacity-90 mb-2">Publishers</div>
              {loading ? (
                <div className="text-3xl font-bold">--</div>
              ) : (
                <div className="text-3xl font-bold">
                  {stats?.totalPublishers}
                </div>
              )}
              <div className="text-sm opacity-75 mt-2">Traffic sources</div>
            </div>
            <i className="pi pi-building text-3xl opacity-50"></i>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm opacity-90 mb-2">Verticals</div>
              {loading ? (
                <div className="text-3xl font-bold">--</div>
              ) : (
                <div className="text-3xl font-bold">
                  {Object.keys(stats?.offersByVertical || {}).length}
                </div>
              )}
              <div className="text-sm opacity-75 mt-2">Active markets</div>
            </div>
            <i className="pi pi-chart-bar text-3xl opacity-50"></i>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Offers by Status">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <ProgressSpinner />
            </div>
          ) : statusChartData ? (
            statusChartData ? <Chart type="doughnut" data={statusChartData} /> : <div>No data</div>
          ) : (
            <div className="text-center py-10 text-gray-500">No data available</div>
          )}
        </Card>

        <Card title="Offers by Vertical">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <ProgressSpinner />
            </div>
          ) : verticalChartData ? (
            <Chart type="bar" data={verticalChartData} />
          ) : (
            <div className="text-center py-10 text-gray-500">No data available</div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Manage Offers">
          <p className="text-gray-600 mb-4">
            View, create, and update your offer inventory
          </p>
          <Link href="/offers">
            <Button
              label="View All Offers"
              icon="pi pi-arrow-right"
              className="w-full"
            />
          </Link>
        </Card>

        <Card title="Quick Actions">
          <div className="flex flex-col gap-2">
            <Link href="/offers/new">
              <Button
                label="Add New Offer"
                icon="pi pi-plus"
                severity="success"
                outlined
                className="w-full"
              />
            </Link>
            <Link href="/buyers">
              <Button
                label="Manage Buyers"
                icon="pi pi-users"
                outlined
                className="w-full"
              />
            </Link>
            <Button
              label="Export Data"
              icon="pi pi-download"
              outlined
              className="w-full"
            />
          </div>
        </Card>
      </div>

      {/* System Status */}
      <Card className="mt-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <div>
            <div className="font-semibold">All Systems Operational</div>
            <div className="text-sm text-gray-600">
              Connected to Supabase • ClickUp integration active
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
